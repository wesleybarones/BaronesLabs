import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Cursor from './Cursor.jsx';
import { CURSORS, registerCursor } from './registry.js';

/**
 * Camada dos cursores e efeitos, montada no <body> e do tamanho do documento
 * (os cursores usam coordenadas de documento e rolam junto com a página).
 * Decorativa: aria-hidden e sem eventos de ponteiro.
 */
export default function Swarm({ mobile = false }) {
  const layer = useRef(null);
  const list = useMemo(() => CURSORS.filter((c) => !mobile || c.mobile), [mobile]);

  useEffect(() => {
    const el = layer.current;
    const fit = () => { el.style.height = `${document.documentElement.scrollHeight}px`; };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div ref={layer} className="ha-swarm" aria-hidden="true">
      {list.map((c) => (
        <Cursor key={c.id} {...c} ref={(api) => registerCursor(c.id, api)} />
      ))}
      <div id="ha-fx-layer" />
    </div>,
    document.body
  );
}
