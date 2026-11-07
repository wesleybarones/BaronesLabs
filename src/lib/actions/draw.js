import { gsap } from '../motion.js';
import { $, fxNode, rectDoc, travel } from './_utils.js';

/** UI.BOT desenha o contorno do bloco (traço neon) e o bloco aparece. */
export default function draw(step, ctx) {
  const c = step.cursorApi;
  const el = $(step.target);
  const tl = gsap.timeline();
  if (!el) return tl;
  // 4 arestas animadas só com transform (scaleX/scaleY) — sem stroke-dashoffset
  const node = fxNode('fx-draw', '<i class="e e-t"></i><i class="e e-r"></i><i class="e e-b"></i><i class="e e-l"></i>', ctx);
  const [et, er, eb, el2] = node.querySelectorAll('.e');
  if (step.color) node.style.setProperty('--dc', step.color);
  const setEdges = (t) => {
    if (!r) return;
    const { w, h } = r; let d = t * 2 * (w + h);
    const f = (len) => { const v = Math.max(0, Math.min(1, d / len)); d -= len; return v; };
    gsap.set(et, { scaleX: f(w) }); gsap.set(er, { scaleY: f(h) });
    gsap.set(eb, { scaleX: f(w) }); gsap.set(el2, { scaleY: f(h) });
  };
  let r = null;
  const place = () => {
    r = rectDoc(el);
    if (!r) return;
    node.style.width = `${r.w}px`; node.style.height = `${r.h}px`;
    gsap.set(node, { x: r.x, y: r.y });
  };
  ctx.relayout.add(place);

  // ponto no perímetro (sentido horário a partir do canto superior esquerdo)
  const perim = (t) => {
    const { x, y, w, h } = r; const P = 2 * (w + h); let d = t * P;
    if (d <= w) return { x: x + d, y };
    d -= w; if (d <= h) return { x: x + w, y: y + d };
    d -= h; if (d <= w) return { x: x + w - d, y: y + h };
    d -= w; return { x, y: y + h - d };
  };

  if (c) tl.add(travel(c, { target: el, ax: 0, ay: 0 }, ctx, { duration: step.travel }));
  const proxy = { t: 0 };
  tl.call(() => { place(); setEdges(0); c && ctx.moving.add(c.id); })
    .set(node, { autoAlpha: 1 })
    .fromTo(proxy, { t: 0 }, {
      t: 1, duration: step.duration ?? 1, ease: 'power1.inOut', immediateRender: false,
      onUpdate() {
        if (!r) place();
        setEdges(proxy.t);
        if (c) { const p = perim(proxy.t); gsap.set(c.el, { x: p.x, y: p.y }); }
      },
      onComplete() { if (c) { ctx.moving.delete(c.id); ctx.parked.set(c.id, { target: el, ax: 0, ay: 0 }); } },
    })
  if (step.hide !== false) tl.fromTo(el, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
  tl.to(node, { autoAlpha: 0, duration: 0.4 }, step.hide !== false ? '<0.1' : '+=0.25');
  // sai de cima do bloco depois de desenhar
  if (c) tl.add(travel(c, { target: el, ax: 0, ay: 0.12, dx: -70 }, ctx, { duration: 0.45 }), '<');
  return tl;
}
draw.prepare = (step) => step.hide !== false && gsap.set($(step.target), { autoAlpha: 0 });
