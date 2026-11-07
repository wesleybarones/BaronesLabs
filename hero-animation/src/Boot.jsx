import { useLayoutEffect, useRef } from 'react';
import { gsap } from './motion.js';

const LOAD = 0.88; // carregamento; + glitch de saída (~0,3s) → total ≤ 1,2s

/**
 * Tela de inicialização: logo + "INICIALIZANDO_" + progresso + "pular →".
 * Sai com um glitch rápido e chama onDone() (direto para a montagem).
 */
export default function Boot({ onDone, logo, logoAlt = '', text = 'INICIALIZANDO', skipLabel = 'pular →' }) {
  const root = useRef(null);
  const tl = useRef(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      tl.current = gsap
        .timeline({ onComplete: () => onDone?.() })
        .from(q('.ha-boot-inner'), { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.out' })
        .fromTo(q('.ha-boot-bar'), { scaleX: 0 }, { scaleX: 1, duration: LOAD, ease: 'power1.inOut' }, 0)
        .to(counter, {
          v: 100, duration: LOAD, ease: 'power1.inOut',
          onUpdate: () => { const el = q('.ha-boot-pct')[0]; if (el) el.textContent = `${String(Math.round(counter.v)).padStart(3, '0')}%`; },
        }, 0)
        .addLabel('glitch')
        .set(q('.ha-boot-ghost'), { opacity: 0.85 })
        .to(q('.ha-boot-ghost-c'), { x: -10, duration: 0.04 }, 'glitch')
        .to(q('.ha-boot-ghost-m'), { x: 10, duration: 0.04 }, 'glitch')
        .to(q('.ha-boot-inner'), { x: 7, skewX: -14, clipPath: 'inset(20% 0 35% 0)', duration: 0.05, ease: 'steps(1)' }, 'glitch')
        .to(q('.ha-boot-inner'), { x: -5, skewX: 10, clipPath: 'inset(55% 0 8% 0)', duration: 0.05, ease: 'steps(1)' })
        .to(q('.ha-boot-inner'), { x: 3, skewX: 0, clipPath: 'inset(0% 0 0% 0)', duration: 0.04, ease: 'steps(1)' })
        .to(q('.ha-boot-ghost'), { opacity: 0, duration: 0.06 })
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

  const img = (extra) => logo && <img src={logo} alt="" width="720" height="296" className={`ha-boot-logo ${extra}`} />;

  return (
    <div ref={root} id="ha-boot" className="ha-boot" role="status" aria-live="polite">
      <div className="ha-boot-ghost ha-boot-ghost-c" aria-hidden="true">{img('')}</div>
      <div className="ha-boot-ghost ha-boot-ghost-m" aria-hidden="true">{img('ha-boot-logo-m')}</div>
      <div className="ha-boot-inner">
        {logo && <img src={logo} alt={logoAlt} width="720" height="296" className="ha-boot-logo" />}
        <div className="ha-boot-row">
          <span>{text}<span className="ha-blink">_</span></span>
          <span className="ha-boot-pct">000%</span>
        </div>
        <div className="ha-boot-track"><div className="ha-boot-bar" /></div>
      </div>
      <button type="button" onClick={skip} className="ha-boot-skip">{skipLabel}</button>
    </div>
  );
}
