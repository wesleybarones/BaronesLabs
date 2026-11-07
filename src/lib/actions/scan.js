import { gsap } from '../motion.js';
import { $, $$ } from './_utils.js';

/**
 * Scanner que varre um painel de cima para baixo. Ao passar por cada linha:
 * adiciona `fixClass` ao elemento `fix` da linha e revela a `tag` dela.
 * { action:'scan', target:'#painel', scanner:'#faixa', rows:'.linha', fix?, fixClass?, tag?, duration? }
 */
export default function scan(step, ctx) {
  const panel = $(step.target);
  const scanner = $(step.scanner);
  const rows = $$(step.rows);
  const tl = gsap.timeline();
  if (!panel || !scanner) return tl;
  const dur = step.duration ?? 0.8;
  const band = () => scanner.offsetHeight || 64;
  const p = { v: 0 };

  tl.set(scanner, { autoAlpha: 1 })
    .fromTo(p, { v: 0 }, {
      v: 1, duration: dur, ease: 'none', immediateRender: false,
      onUpdate: () => gsap.set(scanner, { y: p.v * (panel.offsetHeight + band()) - band() }),
    });

  rows.forEach((row, i) => {
    const t = ((i + 0.6) / rows.length) * dur; // instante em que a faixa cruza a linha
    const fix = step.fix && row.querySelector(step.fix);
    const tag = step.tag && row.querySelector(step.tag);
    if (fix && step.fixClass) tl.call(() => fix.classList.add(step.fixClass), null, t);
    if (tag) tl.fromTo(tag, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.25, ease: 'power2.out', immediateRender: false }, t);
  });

  tl.to(scanner, { autoAlpha: 0, duration: 0.2 });
  return tl;
}

scan.prepare = (step, ctx) => {
  $$(step.rows).forEach((row) => {
    const fix = step.fix && row.querySelector(step.fix);
    const tag = step.tag && row.querySelector(step.tag);
    if (fix && step.fixClass && fix.classList.contains(step.fixClass)) {
      fix.classList.remove(step.fixClass);
      ctx.cleanups.push(() => fix.classList.add(step.fixClass));
    }
    if (tag) gsap.set(tag, { autoAlpha: 0 });
  });
};
