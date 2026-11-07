import { gsap } from '../motion.js';
import { $, microPause, travel } from './_utils.js';

/** { cursor, action:'click', target, trigger? } — trigger:true dispara o clique real no elemento. */
export default function click(step, ctx) {
  const tl = gsap.timeline();
  const c = step.cursorApi;
  const el = $(step.target);
  if (c) tl.add(travel(c, { target: step.target, ax: step.ax ?? 0.55, ay: step.ay ?? 0.6 }, ctx, { duration: step.duration }));
  tl.add(microPause());
  if (c) tl.add(c.click());
  if (el) tl.fromTo(el, { scale: 1 }, { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut' }, c ? '<' : '>');
  if (el && step.pressClass) {
    tl.call(() => el.classList.add(step.pressClass), null, '<');
    ctx.cleanups.push(() => el.classList.remove(step.pressClass));
  }
  if (step.trigger) {
    tl.call(() => {
      const t = $(step.target);
      if (!t || (step.trigger === 'expand' && t.getAttribute('aria-expanded') === 'true')) return;
      t.click();
    });
  }
  return tl;
}
