import { gsap } from '../motion.js';
import { $ } from './_utils.js';

const GLYPHS = '!<>-_\\/[]{}=+*^?#0123456789ABCDEF';
export const scrambleFrame = (final, v) => {
  const n = Math.floor(v * final.length);
  return final.slice(0, n) + [...final.slice(n)].map((ch) => (ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
};
const textNode = (el) => [...el.childNodes].find((n) => n.nodeType === 3);

/** Troca o texto de status com efeito "scramble" (ex.: "ONLINE ✓ · 0.8s"). */
export default function status(step, ctx) {
  const el = $(step.target);
  const tl = gsap.timeline();
  const node = el && textNode(el);
  if (!node) return tl;
  const final = step.text ?? ctx.store[`status:${step.target}`] ?? node.data;
  const p = { v: 0 };
  tl.fromTo(p, { v: 0 }, {
    v: 1, duration: step.duration ?? 0.5, ease: 'none', immediateRender: false,
    onUpdate() {
      node.data = scrambleFrame(final, p.v);
    },
    onComplete() { node.data = final; el.classList.remove('is-pending'); },
  }).fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(3)', immediateRender: false });
  return tl;
}

status.prepare = (step, ctx) => {
  const el = $(step.target);
  const node = el && textNode(el);
  if (!node) return;
  const original = node.data;
  ctx.store[`status:${step.target}`] = original;
  if (step.pending) { node.data = step.pending; el.classList.add('is-pending'); }
  ctx.cleanups.push(() => { node.data = original; el.classList.remove('is-pending'); });
};
