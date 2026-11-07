import { gsap } from '../motion.js';
import { travel } from './_utils.js';

/** { cursor, action:'move', target, ax?, ay?, dx?, dy?, duration? } */
export default function move(step, ctx) {
  const tl = gsap.timeline();
  const c = step.cursorApi;
  if (c) tl.add(travel(c, { target: step.target, ax: step.ax, ay: step.ay, dx: step.dx, dy: step.dy }, ctx, { duration: step.duration }));
  return tl;
}
