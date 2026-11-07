import { marquee } from '../content/site.js';

export default function Marquee() {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marquee.map((m) => (
        <li key={m} className="flex items-center">
          <span className="px-6 font-display text-xl font-semibold uppercase tracking-wide text-white/90 md:text-2xl">{m}</span>
          <span className="text-magenta" aria-hidden="true">◆</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee relative z-10 overflow-hidden border-y border-line bg-panel/60 py-4" aria-label="Segmentos atendidos">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
