import { useMemo } from 'react';
import Cursor from './Cursor.jsx';
import { CURSORS, registerCursor } from '../../lib/swarm/registry.js';

/** Camada dos cursores (decorativa: aria-hidden, sem eventos de ponteiro). */
export default function Swarm({ mobile = false }) {
  const list = useMemo(() => CURSORS.filter((c) => !mobile || c.mobile), [mobile]);
  return (
    <div className="swarm-layer" aria-hidden="true">
      {list.map((c) => (
        <Cursor key={c.id} {...c} ref={(api) => registerCursor(c.id, api)} />
      ))}
      <div id="swarm-fx" />
    </div>
  );
}
