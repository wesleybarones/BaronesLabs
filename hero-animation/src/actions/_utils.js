// Utilitários compartilhados pelas ações. Coordenadas sempre em pixels do DOCUMENTO.
import { gsap, MotionPathPlugin } from '../motion.js';

export const $ = (t) => (typeof t === 'string' ? document.querySelector(t) : t);
export const $$ = (t) => (typeof t === 'string' ? [...document.querySelectorAll(t)] : [t].flat().filter(Boolean));
export const rand = (a, b) => a + Math.random() * (b - a);
export const clamp01 = (v) => Math.max(0, Math.min(1, v));

export function rectDoc(target) {
  const el = $(target);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

/** Ponto de ancoragem: { target, ax, ay, dx, dy } → {x, y} no documento. */
export function point(a) {
  const r = rectDoc(a.target);
  if (!r) return null;
  return { x: r.x + r.w * (a.ax ?? 0.5) + (a.dx || 0), y: r.y + r.h * (a.ay ?? 0.5) + (a.dy || 0) };
}

/** Borda da viewport mais próxima do alvo (de onde o cursor entra). */
export function edgePoint(target) {
  const p = point({ target }) ?? { x: innerWidth / 2, y: scrollY + innerHeight / 2 };
  const vx = p.x, vy = p.y - scrollY;
  const d = [vx, innerWidth - vx, vy, innerHeight - vy];
  const i = d.indexOf(Math.min(...d));
  return [
    { x: -40, y: p.y + rand(-80, 80) },
    { x: innerWidth + 40, y: p.y + rand(-80, 80) },
    { x: p.x + rand(-120, 120), y: scrollY - 40 },
    { x: p.x + rand(-120, 120), y: scrollY + innerHeight + 40 },
  ][i];
}

export const fxLayer = () => document.getElementById('ha-fx-layer');

/** Cria um nó de efeito (oculto) na camada do enxame. */
export function fxNode(cls, html = '', ctx) {
  const d = document.createElement('div');
  d.className = `ha-fx ${cls}`;
  d.innerHTML = html;
  fxLayer()?.appendChild(d);
  gsap.set(d, { autoAlpha: 0 });
  ctx?.cleanups.push(() => d.remove());
  return d;
}

/** Caminho "humano": bezier cúbica com pontos de controle aleatórios. */
export function humanPath(s, e) {
  const dx = e.x - s.x, dy = e.y - s.y;
  const d = Math.hypot(dx, dy) || 1;
  const nx = -dy / d, ny = dx / d;
  const k1 = rand(-0.28, 0.28) * d, k2 = rand(-0.1, 0.1) * d;
  const raw = MotionPathPlugin.arrayToRawPath(
    [s, { x: s.x + dx * 0.3 + nx * k1, y: s.y + dy * 0.3 + ny * k1 }, { x: s.x + dx * 0.75 + nx * k2, y: s.y + dy * 0.75 + ny * k2 }, e],
    { type: 'cubic' }
  );
  MotionPathPlugin.cacheRawPathMeasurements(raw);
  return raw;
}

export const onPath = (raw, t) => MotionPathPlugin.getPositionOnPath(raw, clamp01(t));

/**
 * Desloca um elemento por um caminho humano até a âncora.
 * Ponto final calculado NA EXECUÇÃO e recalculado em resize (ctx.relayout).
 */
export function travelEl(el, getStart, getEnd, ctx, { duration = 0.65, ease = 'power2.inOut', onStart, onUpdate, onComplete } = {}) {
  const proxy = { p: 0 };
  let raw = null, p0 = 0, last = null;
  const compute = () => {
    const s = getStart();
    const e = getEnd() ?? s;
    raw = humanPath(s, e);
    p0 = proxy.p;
  };
  return gsap.to(proxy, {
    p: 1, duration, ease,
    onStart() { onStart?.(); compute(); ctx.relayout.add(compute); },
    onUpdate() {
      if (!raw) compute();
      const t = p0 >= 1 ? 1 : (proxy.p - p0) / (1 - p0);
      last = onPath(raw, t);
      gsap.set(el, { x: last.x, y: last.y });
      onUpdate?.(last, proxy.p);
    },
    onComplete() { ctx.relayout.delete(compute); raw = null; onComplete?.(last); },
  });
}

/** Leva um cursor até uma âncora (entra pela borda se estiver oculto). */
export function travel(c, anchor, ctx, vars = {}) {
  return travelEl(c.el, () => c.pos(), () => point(anchor), ctx, {
    ...vars,
    onStart() {
      if (+gsap.getProperty(c.el, 'opacity') < 0.05) {
        const ep = edgePoint(anchor.target);
        gsap.set(c.el, { x: ep.x, y: ep.y });
      }
      gsap.set(c.el, { autoAlpha: 1 });
      ctx.moving.add(c.id);
    },
    onComplete() { ctx.moving.delete(c.id); ctx.parked.set(c.id, anchor); },
  });
}

/** Micro-pausa humana antes de um clique (80–200ms). */
export const microPause = () => gsap.to({}, { duration: rand(0.08, 0.2) });
