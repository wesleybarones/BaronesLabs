import { gsap } from '../motion.js';
import { $, fxNode, rand, rectDoc, travel } from './_utils.js';

/**
 * Quebra os nós de texto em <span class="ch"> SEM mudar o layout (CLS ≈ 0).
 * restore() devolve os nós de texto originais (o React continua íntegro).
 */
function splitChars(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const chars = [], records = [];
  nodes.forEach((n) => {
    if (!n.data.length) return;
    const frag = document.createDocumentFragment();
    const spans = [...n.data].map((ch) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      frag.appendChild(s);
      return s;
    });
    records.push({ node: n, spans });
    n.parentNode.replaceChild(frag, n);
    chars.push(...spans);
  });
  const restore = () => {
    records.splice(0).forEach(({ node, spans }) => {
      const first = spans[0];
      if (first.parentNode) first.parentNode.insertBefore(node, first);
      spans.forEach((s) => s.remove());
    });
  };
  return { chars, restore };
}

const key = (step) => `type:${step.target}`;

/** COPY.BOT digita o texto letra por letra, com caret "_" piscando. */
export default function type(step, ctx) {
  const c = step.cursorApi;
  const el = $(step.target);
  const tl = gsap.timeline();
  const split = ctx.store[key(step)];
  if (!el || !split) return tl;
  const { chars, restore } = split;

  // ritmo humano: cada letra com duração variável, pausa maior após pontuação/espaço
  const base = step.speed ?? 0.034;
  const times = [];
  let acc = 0;
  chars.forEach((ch) => {
    const t = ch.textContent;
    acc += base * rand(0.55, 1.45) * (/[.,!?]/.test(t) ? 4 : t === ' ' ? 1.6 : 1);
    times.push(acc);
  });

  const caret = fxNode('ha-fx-caret', '<span class="ha-blink">_</span>', ctx);
  let shown = 0;
  let rects = null; // cache: o layout não muda durante a digitação (só opacidade)
  const measure = () => { rects = chars.map((ch) => rectDoc(ch)); };
  let lastSize = 0;
  const placeCaret = () => {
    if (!rects) measure();
    const r = rects[Math.max(0, shown - 1)];
    if (!r) return;
    const x = shown ? r.x + r.w : r.x;
    const fs = Math.round(r.h * 0.85);
    if (fs !== lastSize) { caret.style.fontSize = `${fs}px`; lastSize = fs; }
    gsap.set(caret, { x, y: r.y });
    if (c) gsap.set(c.el, { x: x + 8, y: r.y + r.h * 0.9 });
  };
  ctx.relayout.add(() => { measure(); placeCaret(); });

  if (c) tl.add(travel(c, { target: chars[0], ax: 0, ay: 1, dx: 8, dy: 4 }, ctx, { duration: step.travel }));
  const clock = { t: 0 };
  tl.call(() => { c && ctx.moving.add(c.id); placeCaret(); })
    .set(caret, { autoAlpha: 1 })
    .fromTo(clock, { t: 0 }, {
      t: acc, duration: acc, ease: 'none', immediateRender: false,
      onUpdate() {
        while (shown < chars.length && times[shown] <= clock.t + 1e-6) chars[shown++].style.opacity = '1';
        placeCaret();
      },
    })
    .to(caret, { autoAlpha: 0, duration: 0.2 }, '+=0.3')
    .call(() => {
      restore();
      el.classList.remove('ha-typing');
      if (c) ctx.moving.delete(c.id);
    });
  if (c) tl.add(travel(c, { target: el, ax: 1, ay: 0.35, dx: 48 }, ctx, { duration: 0.45 }), '<');
  return tl;
}

type.prepare = (step, ctx) => {
  const el = $(step.target);
  if (!el || ctx.store[key(step)]) return;
  const split = splitChars(el);
  split.chars.forEach((s) => (s.style.opacity = '0'));
  el.classList.add('ha-typing');
  ctx.store[key(step)] = split;
  ctx.cleanups.push(() => { split.restore(); el.classList.remove('ha-typing'); });
};
