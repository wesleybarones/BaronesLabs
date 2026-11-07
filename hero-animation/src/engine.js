// Motor de coreografia: transforma um script declarativo (choreography.js)
// numa master timeline do GSAP. Cada passo vira a timeline da sua ação e é
// posicionado com `at` ("<", "+=0.2", "<0.2", número…), então os cursores
// trabalham EM PARALELO.
import { gsap } from './motion.js';
import { actions } from './actions/index.js';
import { CURSORS, getCursor } from './swarm/registry.js';
import { point } from './actions/_utils.js';

export function createChoreography(script, opts = {}) {
  const mobile = !!opts.mobile;
  const ctx = { mobile, cleanups: [], relayout: new Set(), moving: new Set(), parked: new Map(), store: {} };
  const steps = script.filter((s) => !(mobile && s.mobile === false) && !(!mobile && s.mobileOnly));
  let master;
  let done = false;

  // Tudo dentro de um gsap.context → revert() devolve o DOM ao estado natural.
  const gctx = gsap.context(() => {
    steps.forEach((s) => actions[s.action]?.prepare?.(s, ctx));
    master = gsap.timeline({ paused: true, onComplete: () => finish() });
    steps.forEach((s) => {
      const act = actions[s.action];
      if (!act) return console.warn(`[coreografia] ação desconhecida: ${s.action}`);
      const cursorApi = s.cursor ? getCursor(s.cursor) ?? null : null;
      master.add(act({ ...s, cursorApi }, ctx), s.at ?? '>');
    });
    master.timeScale(mobile ? opts.mobileSpeed ?? 2 : opts.speed ?? 1);
  });

  // Recalcula posições no resize (debounce): alvos em movimento e cursores parados.
  let timer = 0;
  const relayout = () => {
    if (done) return;
    ctx.relayout.forEach((fn) => fn());
    ctx.parked.forEach((anchor, id) => {
      if (ctx.moving.has(id)) return;
      const c = getCursor(id);
      const p = point(anchor);
      if (c && p) gsap.set(c.el, { x: p.x, y: p.y });
    });
  };
  const onResize = () => { clearTimeout(timer); timer = setTimeout(relayout, 150); };
  window.addEventListener('resize', onResize);

  const hideCursors = () =>
    CURSORS.forEach(({ id }) => { const c = getCursor(id); if (c) { c.setState('idle'); gsap.set(c.el, { autoAlpha: 0 }); } });

  const teardown = () => {
    window.removeEventListener('resize', onResize);
    clearTimeout(timer);
    ctx.cleanups.splice(0).reverse().forEach((fn) => { try { fn(); } catch { /* noop */ } });
    ctx.relayout.clear();
  };

  function finish() {
    if (done) return;
    done = true;
    gctx.revert(); // estado final == estado natural da página
    teardown();
    hideCursors();
    opts.onComplete?.();
  }

  return {
    timeline: master,
    duration: () => master.totalDuration(),
    play: () => master.play(),
    /** Pula para o estado final (página 100% utilizável). */
    skip: () => { if (!done) { master.progress(1, false); finish(); } },
    /** Desmonta sem disparar onComplete (para "Rever montagem" / StrictMode). */
    destroy: () => {
      if (done) return;
      done = true;
      master.kill();
      gctx.revert();
      teardown();
      hideCursors();
    },
  };
}
