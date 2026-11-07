import { gsap } from '../motion.js';
import { $, fxNode, rectDoc, travelEl } from './_utils.js';

/**
 * Arrasta a cópia (ctx.store.clip) até o destino, com guias de alinhamento
 * magenta e medidas em px. O cursor acompanha a cópia.
 */
export default function drag(step, ctx) {
  const c = step.cursorApi;
  const tl = gsap.timeline();
  const wrap = ctx.store.clip;
  if (!wrap || !$(step.to)) return tl;

  const gv = fxNode('fx-guide fx-guide-v', '', ctx);
  const gh = fxNode('fx-guide fx-guide-h', '', ctx);
  const mx = fxNode('fx-dim', '', ctx);
  const my = fxNode('fx-dim', '', ctx);
  const guides = [gv, gh, mx, my];
  let off = { x: 0, y: 0 }, dest = null;

  const begin = () => {
    const p = { x: +gsap.getProperty(wrap, 'x'), y: +gsap.getProperty(wrap, 'y') };
    if (c) { const cp = c.pos(); off = { x: cp.x - p.x, y: cp.y - p.y }; c.setState('dragging'); ctx.moving.add(c.id); }
  };
  const measureDest = () => { dest = rectDoc(step.to); };
  ctx.relayout.add(measureDest);
  const update = (pos, prog) => {
    if (!dest) measureDest();
    if (!dest) return;
    if (c) gsap.set(c.el, { x: pos.x + off.x, y: pos.y + off.y });
    const a = Math.max(0, Math.min(1, (prog - 0.3) / 0.25));
    const top = Math.min(pos.y, dest.y) - 40, bottom = Math.max(pos.y, dest.y) + dest.h + 40;
    const left = Math.min(pos.x, dest.x) - 40, right = Math.max(pos.x, dest.x) + dest.w + 40;
    gsap.set(gv, { x: dest.x, y: top, scaleY: (bottom - top) / 100, autoAlpha: a });
    gsap.set(gh, { x: left, y: dest.y, scaleX: (right - left) / 100, autoAlpha: a });
    const dx = Math.round(dest.x - pos.x), dy = Math.round(dest.y - pos.y);
    mx.textContent = `↔ ${Math.abs(dx)} px`;
    my.textContent = `↕ ${Math.abs(dy)} px`;
    gsap.set(mx, { x: (pos.x + dest.x) / 2, y: dest.y - 22, autoAlpha: a });
    gsap.set(my, { x: dest.x + 6, y: (pos.y + dest.y) / 2, autoAlpha: a });
  };

  const sel = ctx.store.selection;
  if (sel) tl.to(sel, { autoAlpha: 0, duration: 0.15 });
  tl.add(
    travelEl(
      wrap,
      () => ({ x: +gsap.getProperty(wrap, 'x'), y: +gsap.getProperty(wrap, 'y') }),
      () => { const r = rectDoc(step.to); return r && { x: r.x, y: r.y }; },
      ctx,
      {
        duration: step.duration ?? (ctx.mobile ? 0.5 : 0.9),
        onStart: begin,
        onUpdate: update,
        onComplete() {
          if (c) { c.setState('idle'); ctx.moving.delete(c.id); ctx.parked.set(c.id, { target: step.to, ax: 0.8, ay: 0.7 }); }
        },
      }
    ), '<'
  )
    .to(wrap, { scale: 1, duration: 0.2 }, '<')
    .to(guides, { autoAlpha: 0, duration: 0.25 }, '+=0.05');
  tl.addLabel('dropped', '-=0.3');
  return tl;
}
