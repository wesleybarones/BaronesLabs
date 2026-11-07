import { gsap } from '../motion.js';
import { $, fxNode, rectDoc } from './_utils.js';

/** Pulso de luz sobre um bloco (contorno + brilho), na cor pedida. */
export default function flash(step, ctx) {
  const el = $(step.target);
  const tl = gsap.timeline();
  if (!el) return tl;
  const node = fxNode('fx-pulse', '', ctx);
  node.style.setProperty('--pc', step.color ?? '#D4FF24');
  const place = () => {
    const r = rectDoc(el);
    if (!r) return;
    node.style.width = `${r.w}px`;
    node.style.height = `${r.h}px`;
    gsap.set(node, { x: r.x, y: r.y });
  };
  ctx.relayout.add(place);
  return tl
    .call(place)
    .fromTo(node, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.04, duration: step.duration ?? 0.7, ease: 'power2.out', immediateRender: false });
}
