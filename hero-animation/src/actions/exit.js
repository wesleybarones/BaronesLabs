import { gsap } from '../motion.js';
import { CURSORS, getCursor } from '../swarm/registry.js';

/** Os cursores se dispersam e somem; overlays restantes saem junto. */
export default function exit(step, ctx) {
  const tl = gsap.timeline();
  const ids = step.cursors ?? CURSORS.map((c) => c.id);
  ids.map(getCursor).filter(Boolean).forEach((c, i, all) => {
    const ang = (i / all.length) * Math.PI * 2 + Math.random();
    tl.call(() => { ctx.parked.delete(c.id); ctx.moving.add(c.id); }, null, i * 0.05)
      .to(c.el, { x: `+=${Math.cos(ang) * 320}`, y: `+=${Math.sin(ang) * 240}`, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, i * 0.05);
  });
  if (ctx.store.selection) tl.to(ctx.store.selection, { autoAlpha: 0, duration: 0.3 }, 0);
  return tl;
}
