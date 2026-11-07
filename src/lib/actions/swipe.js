import { gsap } from '../motion.js';
import { $, microPause, travel } from './_utils.js';

/**
 * O cursor "pega" um item de um carrossel e arrasta para o lado, mostrando
 * que dá para arrastar; depois solta e o carrossel volta (dica de interação).
 * { cursor, action:'swipe', target:'#trilho', item:'#trilho .card', distance? (fração do item) }
 */
export default function swipe(step, ctx) {
  const c = step.cursorApi;
  const track = $(step.target);
  const item = $(step.item);
  const tl = gsap.timeline();
  if (!track || !item) return tl;

  let start = 0, dist = 0, c0 = null;
  const st = { v: 0 };
  const apply = () => {
    track.scrollLeft = start + dist * st.v;
    if (c && c0) gsap.set(c.el, { x: c0.x - dist * st.v, y: c0.y });
  };
  const release = () => {
    track.style.scrollSnapType = '';
    track.style.scrollBehavior = '';
    if (c) { c.setState('idle'); ctx.moving.delete(c.id); }
  };
  ctx.cleanups.push(release);

  if (c) tl.add(travel(c, { target: item, ax: 0.6, ay: 0.4 }, ctx, { duration: step.enter ?? 0.55 }));
  tl.add(microPause())
    .call(() => {
      start = track.scrollLeft;
      dist = item.getBoundingClientRect().width * (step.distance ?? 0.55);
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      if (c) { c0 = c.pos(); c.setState('dragging'); ctx.moving.add(c.id); }
    })
    .fromTo(st, { v: 0 }, { v: 1, duration: 0.7, ease: 'power2.inOut', immediateRender: false, onUpdate: apply })
    .to(st, { v: 0, duration: 0.6, ease: 'back.out(1.4)', onUpdate: apply }, '+=0.15')
    .call(release);
  return tl;
}
