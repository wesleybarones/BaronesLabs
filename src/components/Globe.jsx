import { useEffect, useRef } from 'react';

/**
 * Globo de pontos em canvas 2D (leve, sem 3D pesado).
 * Arraste para girar; gira devagar sozinho; pausa fora da tela.
 */
export default function Globe({ marker, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let cleanup = null;
    let cancelled = false;
    // Lazy load: o renderizador + dados dos continentes só carregam perto da seção.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('../lib/globe.js').then(({ mountGlobe }) => {
        if (!cancelled) cleanup = mountGlobe(canvas, marker);
      });
    }, { rootMargin: '400px 0px' });
    io.observe(canvas);
    return () => { cancelled = true; io.disconnect(); cleanup?.(); };
  }, [marker]);

  return (
    <canvas
      ref={canvasRef}
      className={`aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
      role="img"
      aria-label={`Globo terrestre com marcador em ${marker.label}`}
    />
  );
}
