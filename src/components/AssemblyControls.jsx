import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const cls =
  'border border-line bg-bg/85 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-cyan hover:text-cyan';

/**
 * Botões discretos:
 *  - "Pular animação →" fixo no rodapé enquanto a montagem roda;
 *  - "↻ Rever montagem" dentro do herói (#replay-slot) depois — não cobre conteúdo.
 */
export default function AssemblyControls({ phase, onSkip, onReplay }) {
  const [slot, setSlot] = useState(null);
  useEffect(() => setSlot(document.getElementById('replay-slot')), []);

  if (phase === 'boot') return null;
  if (phase === 'assemble') {
    return (
      <button type="button" onClick={onSkip} className={`${cls} fixed left-1/2 top-[76px] z-[70] -translate-x-1/2 backdrop-blur md:bottom-5 md:top-auto`}>
        Pular animação →
      </button>
    );
  }
  return slot
    ? createPortal(
        <button type="button" onClick={onReplay} className={`${cls} !border-transparent !bg-transparent !px-0 hover:!border-transparent`}>
          ↻ Rever montagem
        </button>,
        slot
      )
    : null;
}
