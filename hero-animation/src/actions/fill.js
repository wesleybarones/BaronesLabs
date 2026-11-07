import { gsap } from '../motion.js';
import { $$ } from './_utils.js';

/** Barra de progresso que se completa (scaleX 0 → 1). */
export default function fill(step) {
  return gsap.timeline().fromTo(
    $$(step.target),
    { scaleX: 0 },
    { scaleX: 1, duration: step.duration ?? 0.5, ease: step.ease ?? 'power2.inOut', immediateRender: false }
  );
}
fill.prepare = (step) => gsap.set($$(step.target), { scaleX: 0, transformOrigin: '0% 50%' });
