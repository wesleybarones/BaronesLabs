import { gsap } from '../motion.js';
import { $$, travel } from './_utils.js';

/**
 * O cursor visita cada alvo da lista, clica e o alvo "salta" na tela
 * (ex.: marcar "ERR" no diagnóstico, ticar o checklist da solução).
 * { cursor, action:'mark', target:'seletor (vários)', enter?, travel?, pause?, from? }
 */
export default function mark(step, ctx) {
  const c = step.cursorApi;
  const els = $$(step.target);
  const tl = gsap.timeline();
  let pos = 0;
  els.forEach((el, i) => {
    let hit = pos;
    if (c) {
      const dur = i === 0 ? step.enter ?? 0.5 : step.travel ?? 0.25;
      tl.add(travel(c, { target: el, ax: step.ax ?? 0.5, ay: step.ay ?? 0.6 }, ctx, { duration: dur }), pos);
      hit = pos + dur + (step.pause ?? 0.1);
      tl.add(c.click(), hit);
    } else {
      hit = pos + (i === 0 ? 0 : step.interval ?? 0.18);
    }
    tl.fromTo(el, { autoAlpha: 0, scale: step.from ?? 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, hit);
    pos = hit + 0.12;
  });
  return tl;
}
mark.prepare = (step) => gsap.set($$(step.target), { autoAlpha: 0 });
