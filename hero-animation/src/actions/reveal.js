import { gsap } from '../motion.js';
import { $$ } from './_utils.js';

/** Revela elementos (fade + leve subida), em cascata. */
export default function reveal(step) {
  const els = $$(step.target);
  return gsap.timeline().to(els, { autoAlpha: 1, y: 0, duration: step.duration ?? 0.45, stagger: step.stagger ?? 0.07, ease: 'power2.out' });
}
reveal.prepare = (step) => gsap.set($$(step.target), { autoAlpha: 0, y: 14 });
