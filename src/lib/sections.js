// Dispara as mini-coreografias das seções (ScrollTrigger once: true).
// Cada seção é preparada (estado inicial escondido) quando o herói termina.
import { ScrollTrigger } from './motion.js';
import { createChoreography } from './engine.js';
import { sectionScripts } from './choreography.js';

export function initSectionChoreographies({ mobile }) {
  let running = null;
  const items = [];
  sectionScripts.forEach((sc) => {
    if (mobile && sc.mobile === false) return;
    const el = document.querySelector(sc.trigger);
    if (!el) return;
    const engine = createChoreography(sc.steps, { mobile });
    const st = ScrollTrigger.create({
      trigger: el,
      start: sc.start ?? 'top 60%',
      once: true,
      onEnter: () => {
        // Se a seção já saiu da tela (rolagem rápida / âncora), vai direto ao estado final.
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return engine.skip();
        // Um cursor não faz duas coisas ao mesmo tempo: encerra a seção anterior.
        if (running && running !== engine) running.skip();
        running = engine;
        engine.play();
      },
    });
    items.push({ engine, st });
  });
  ScrollTrigger.refresh();
  return () => items.forEach(({ engine, st }) => { st.kill(); engine.destroy(); });
}
