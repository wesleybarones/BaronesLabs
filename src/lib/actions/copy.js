import { gsap } from '../motion.js';
import { $, fxNode, microPause, point, rectDoc } from './_utils.js';

/** Copia o elemento: tooltip "Ctrl+C" e um clone flutuante que vai para a "área de transferência". */
export default function copy(step, ctx) {
  const c = step.cursorApi;
  const el = $(step.target);
  const tl = gsap.timeline();
  if (!el) return tl;

  const tip = fxNode('fx-tooltip', `<kbd>${step.shortcut ?? 'Ctrl+C'}</kbd>`, ctx);
  const wrap = fxNode('fx-clone', '', ctx);
  const clone = el.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  // o original pode estar oculto pelo prepare de outra ação: o clone nasce visível
  [clone, ...clone.querySelectorAll('[style]')].forEach((n) => n.removeAttribute('style'));
  wrap.appendChild(clone);
  ctx.store.clip = wrap;

  const place = () => {
    const r = rectDoc(el);
    if (!r) return;
    wrap.style.width = `${r.w}px`; wrap.style.height = `${r.h}px`;
    gsap.set(wrap, { x: r.x, y: r.y });
    const p = c ? c.pos() : point({ target: el, ax: 1, ay: 0 });
    gsap.set(tip, { x: p.x + 16, y: p.y - 34 });
  };

  tl.add(microPause()).call(place);
  if (c) tl.add(c.click());
  tl.fromTo(tip, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.18, ease: 'back.out(3)', immediateRender: false }, '<')
    .fromTo(wrap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, immediateRender: false }, '<0.1')
    .to(wrap, { x: '+=10', y: '+=10', scale: 1.03, duration: 0.3, ease: 'power2.out' })
    .to(tip, { autoAlpha: 0, duration: 0.2 }, '<0.1');
  return tl;
}
