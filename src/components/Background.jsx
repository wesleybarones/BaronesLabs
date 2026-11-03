/*
  Global fixed background: subtle grid, circuit traces (almost imperceptible), scanlines and grain.
  The circuit pattern is a tiny tiled SVG (360px tile anchored at the top-left of the screen);
  a few dots of light slide along straight traces of that tile (transform/opacity → compositor only).
*/
const T = 360 // tile size
const PULSES = [
  { x: T, y: 60, tx: 90, ty: 0, d: '13s', delay: '0s' }, // horizontal trace y=60
  { x: 0, y: T + 60, tx: 90, ty: 0, d: '15s', delay: '6s' },
  { x: 2 * T + 180, y: 300, tx: 0, ty: 100, d: '12s', delay: '3s' }, // vertical trace x=180, across the tile edge
  { x: 2 * T + 330, y: T + 210, tx: 70, ty: 0, d: '14s', delay: '9s' }, // horizontal trace y=210, across the edge
  { x: 60, y: T + 280, tx: 0, ty: 106, d: '16s', delay: '1.5s' }, // vertical trace x=60
  { x: 3 * T + 60, y: 280, tx: 0, ty: 106, d: '13s', delay: '7.5s' },
]

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid-global absolute inset-0" />
      <div className="bg-circuits absolute inset-0" />
      <div className="absolute inset-0 opacity-50">
        {PULSES.map((p, i) => (
          <span
            key={i}
            className="circuit-pulse"
            style={{ left: p.x, top: p.y, '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--d': p.d, '--delay': p.delay }}
          />
        ))}
      </div>
      <div className="bg-scanlines absolute inset-0" />
      <div className="bg-grain absolute inset-0" />
    </div>
  )
}
