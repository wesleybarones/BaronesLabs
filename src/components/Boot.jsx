import { useLayoutEffect, useRef } from 'react';
import { boot } from '../content/site.js';
import { config } from '../config.js';
import { gsap } from '../lib/motion.js';

const LOAD = 0.88; // carregamento
// + glitch de saída (~0.3s) → total ≤ 1,2s

/**
 * Tela de inicialização: logo + "INICIALIZANDO_" + progresso + "pular →".
 * Sai com um glitch rápido e chama onDone() (direto para a montagem).
 */
export default function Boot({ onDone }) {
  const root = useRef(null);
  const tl = useRef(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      tl.current = gsap
        .timeline({ onComplete: () => onDone?.() })
        .from(q('.boot-inner'), { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.out' })
        .fromTo(q('.boot-bar'), { scaleX: 0 }, { scaleX: 1, duration: LOAD, ease: 'power1.inOut' }, 0)
        .to(counter, {
          v: 100, duration: LOAD, ease: 'power1.inOut',
          onUpdate: () => { const el = q('.boot-pct')[0]; if (el) el.textContent = `${String(Math.round(counter.v)).padStart(3, '0')}%`; },
        }, 0)
        .addLabel('glitch')
        // glitch: fatias deslocadas + fantasmas ciano/magenta
        .set(q('.boot-ghost'), { opacity: 0.85 })
        .to(q('.boot-g-c'), { x: -10, duration: 0.04 }, 'glitch')
        .to(q('.boot-g-m'), { x: 10, duration: 0.04 }, 'glitch')
        .to(q('.boot-inner'), { x: 7, skewX: -14, clipPath: 'inset(20% 0 35% 0)', duration: 0.05, ease: 'steps(1)' }, 'glitch')
        .to(q('.boot-inner'), { x: -5, skewX: 10, clipPath: 'inset(55% 0 8% 0)', duration: 0.05, ease: 'steps(1)' })
        .to(q('.boot-inner'), { x: 3, skewX: 0, clipPath: 'inset(0% 0 0% 0)', duration: 0.04, ease: 'steps(1)' })
        .to(q('.boot-ghost'), { opacity: 0, duration: 0.06 })
        .to(root.current, { autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, '-=0.04');
    }, root);
    return () => ctx.revert();
  }, [onDone]);

  const skip = () => {
    const t = tl.current;
    if (!t) return onDone?.();
    if (t.time() < t.labels.glitch) t.seek('glitch');
    t.timeScale(1.6);
  };

  return (
    <div
      ref={root}
      id="boot"
      className="fixed inset-0 z-[100] grid place-items-center bg-bg"
      role="status"
      aria-live="polite"
    >
      <div className="boot-ghost boot-g-c grid place-items-center" aria-hidden="true">
        <img src={config.assets.logo} alt="" width="720" height="296" className="h-16 w-auto opacity-70" style={{ filter: 'drop-shadow(0 0 0 #00F0FF) hue-rotate(0deg)' }} />
      </div>
      <div className="boot-ghost boot-g-m grid place-items-center" aria-hidden="true">
        <img src={config.assets.logo} alt="" width="720" height="296" className="h-16 w-auto opacity-70" style={{ filter: 'hue-rotate(110deg) saturate(2)' }} />
      </div>

      <div className="boot-inner flex w-[min(80vw,320px)] flex-col items-center">
        <img src={config.assets.logo} alt="Barones Labs" width="720" height="296" className="h-16 w-auto" />
        <div className="mt-8 flex w-full items-center justify-between font-mono text-xs tracking-[0.2em] text-cyan">
          <span>
            {boot.text.replace(/_$/, '')}
            <span className="blink">_</span>
          </span>
          <span className="boot-pct text-muted">000%</span>
        </div>
        <div className="mt-2 h-px w-full bg-line">
          <div className="boot-bar h-full w-full origin-left bg-lime" style={{ boxShadow: '0 0 10px rgba(212,255,36,.8)' }} />
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 right-6 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-cyan"
      >
        {boot.skip}
      </button>
    </div>
  );
}
