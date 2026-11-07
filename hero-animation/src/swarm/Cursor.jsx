import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { gsap } from '../motion.js';

/**
 * Cursor do enxame: seta SVG + etiqueta mono colorida.
 * Estados: idle | clicking | dragging (em data-state).
 * Coordenadas em pixels do DOCUMENTO (a camada rola junto com a página).
 */
const Cursor = forwardRef(function Cursor({ id, label, color }, ref) {
  const root = useRef(null);
  const body = useRef(null);
  const ripple = useRef(null);

  useLayoutEffect(() => {
    gsap.set(root.current, { x: -80, y: -80, autoAlpha: 0 });
  }, []);

  useImperativeHandle(ref, () => {
    const setState = (s) => { if (root.current) root.current.dataset.state = s; };
    return {
      id,
      color,
      get el() { return root.current; },
      setState,
      /** Clique: scale 0.85 → 1 + ripple ciano. Retorna uma timeline. */
      click() {
        return gsap.timeline()
          .call(() => setState('clicking'))
          .to(body.current, { scale: 0.85, duration: 0.08, ease: 'power2.in' })
          .to(body.current, { scale: 1, duration: 0.24, ease: 'back.out(3)' })
          .fromTo(ripple.current, { scale: 0, opacity: 0.95 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: 'power2.out' }, '<-0.04')
          .call(() => setState('idle'), null, '-=0.3');
      },
      /** Posição atual (coordenadas de documento). */
      pos() {
        return { x: gsap.getProperty(root.current, 'x'), y: gsap.getProperty(root.current, 'y') };
      },
    };
  }, [id, color]);

  return (
    <div ref={root} className="ha-cursor" data-state="idle" data-cursor={id} style={{ '--cc': color }}>
      <span ref={ripple} className="ha-cursor-ripple" />
      <div ref={body} className="ha-cursor-body">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
          <path d="M2 2v19.5l5.2-5 3.6 8 3.4-1.5-3.5-7.8H18z" fill={color} stroke="#07080D" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <svg className="ha-cursor-grab" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4">
          <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />
        </svg>
        <span className="ha-cursor-label">{label}</span>
      </div>
    </div>
  );
});

export default Cursor;
