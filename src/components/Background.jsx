/*
  Global fixed background: subtle grid, circuit traces (almost imperceptible), scanlines and grain.
  The circuit pattern is a tiny tiled SVG; a few traces carry a rare, slow pulse of light.
*/
const PULSES = [
  { d: 'M-20 180H300l60 60h300l40-40h220', dur: '13s', delay: '0s' },
  { d: 'M1460 620H1120l-50-50H820l-40 40H560', dur: '15s', delay: '4s' },
  { d: 'M240 920V700l50-50V480l40-40h180', dur: '12s', delay: '8s' },
  { d: 'M1180 -20v160l-40 40v180l60 60h260', dur: '14s', delay: '2.5s' },
]

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="bg-grid-global absolute inset-0" />
      <div className="bg-circuits absolute inset-0" />
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {PULSES.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength="1000"
            className="circuit-pulse"
            stroke="#00F0FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ '--d': p.dur, '--delay': p.delay, filter: 'drop-shadow(0 0 3px #00F0FF)' }}
          />
        ))}
      </svg>
      <div className="bg-scanlines absolute inset-0" />
      <div className="bg-grain absolute inset-0" />
    </div>
  )
}
