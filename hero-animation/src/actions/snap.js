import { gsap } from '../motion.js';
import { $, fxNode, rectDoc } from './_utils.js';

/** O bloco encaixa na grade com mola (leve overshoot) e um flash ciano. */
export default function snap(step, ctx) {
  const el = $(step.target);
  const tl = gsap.timeline();
  if (!el) return tl;
  const flash = fxNode('ha-fx-flash', '', ctx);
  const place = () => {
    const r = rectDoc(el);
    if (!r) return;
    flash.style.width = `${r.w}px`; flash.style.height = `${r.h}px`;
    gsap.set(flash, { x: r.x, y: r.y });
  };
  const clip = ctx.store.clip;
  tl.call(place);
  if (clip) tl.to(clip, { autoAlpha: 0, duration: 0.12 });
  tl.fromTo(el, { autoAlpha: 0, scale: 0.9, y: -8 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(2.6)' }, '<')
    .fromTo(flash, { autoAlpha: 0.8, scale: 1 }, { autoAlpha: 0, scale: 1.12, duration: 0.5, ease: 'power2.out', immediateRender: false }, '<0.06');
  return tl;
}
snap.prepare = (step) => gsap.set($(step.target), { autoAlpha: 0 });
