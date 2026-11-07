import { gsap } from '../motion.js';
import { $, fxNode, microPause, rectDoc, travel } from './_utils.js';

const HANDLES = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]]
  .map(([l, t]) => `<i class="ha-fx-handle" style="left:${l}%;top:${t}%"></i>`).join('');

/** W.BARONES seleciona o card: caixa de seleção com alças e medida "L × A". */
export default function select(step, ctx) {
  const c = step.cursorApi;
  const el = $(step.target);
  const tl = gsap.timeline();
  if (!el) return tl;
  const box = fxNode('ha-fx-select', `${HANDLES}<span class="ha-fx-measure"></span>`, ctx);
  const label = box.querySelector('.ha-fx-measure');
  const PAD = 4;
  const place = () => {
    const r = rectDoc(el);
    if (!r) return;
    box.style.width = `${r.w + PAD * 2}px`; box.style.height = `${r.h + PAD * 2}px`;
    gsap.set(box, { x: r.x - PAD, y: r.y - PAD });
    label.textContent = step.label ?? `${Math.round(r.w)} × ${Math.round(r.h)}`;
  };
  ctx.relayout.add(place);
  ctx.store.selection = box;

  if (c) tl.add(travel(c, { target: el, ax: 0.78, ay: 0.7 }, ctx, { duration: step.duration }));
  tl.add(microPause());
  if (c) tl.add(c.click());
  tl.call(place, null, '<')
    .fromTo(box, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'power2.out', immediateRender: false }, '<0.05');
  return tl;
}
