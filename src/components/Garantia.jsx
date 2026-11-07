import { garantia as g } from '../content/site.js';
import { Hud, Icon, SectionHead } from './ui.jsx';

function Seal() {
  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label="Selo: garantia de 7 dias">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><path id="sealPath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text fill="#D4FF24" fontFamily="JetBrains Mono, monospace" fontSize="13">
          <textPath href="#sealPath" textLength="486" lengthAdjust="spacing">GARANTIA ◆ 7 DIAS ◆ GARANTIA ◆ 7 DIAS ◆</textPath>
        </text>
      </svg>
      <div className="absolute inset-[22%] grid place-items-center rounded-full border border-lime/60 bg-bg text-center shadow-[0_0_24px_rgba(212,255,36,.35)]">
        <div>
          <p className="font-display text-xl font-bold leading-none text-lime">{g.seal.big}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{g.seal.small}</p>
        </div>
      </div>
    </div>
  );
}

function Book({ b }) {
  return (
    <li className="book-wrap flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="book relative aspect-[3/4] w-40 border border-white/10 p-4 shadow-[18px_18px_40px_-10px_rgba(0,0,0,.9)]"
        style={{ background: `linear-gradient(150deg, #0E1220 0%, #07080D 60%), #07080D` }}
        aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-2" style={{ background: b.color, boxShadow: `0 0 16px ${b.color}` }} />
        <span className="absolute inset-y-0 -right-2 w-2 origin-left bg-[#cfd6e2]" style={{ transform: 'rotateY(90deg)' }} />
        <p className="pl-2 font-mono text-[10px] tracking-widest" style={{ color: b.color }}>{b.vol}</p>
        <p className="mt-3 pl-2 font-display text-lg font-bold leading-tight text-white">{b.title}</p>
        <p className="absolute bottom-3 left-6 font-mono text-[9px] tracking-widest text-muted">BARONES LABS</p>
      </div>
      <p className="mt-6 font-mono text-[11px] tracking-widest" style={{ color: b.color }}>{b.vol}</p>
      <h4 className="mt-1 text-lg font-semibold text-white">{b.title}</h4>
      <p className="mt-1 text-sm text-muted">{b.text}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider" style={{ color: b.color, borderColor: `${b.color}66` }}>
        {b.badge}
      </span>
    </li>
  );
}

export default function Garantia() {
  return (
    <section id="garantia" aria-labelledby="gar-title" className="section">
      <div className="container-site">
        <SectionHead label={g.label} title={g.title} titleId="gar-title" />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Hud className="flex flex-col gap-8 p-7 sm:flex-row sm:items-center md:p-9" color="#D4FF24">
            <Seal />
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-semibold text-white">
                <Icon name="shield" className="h-6 w-6 text-lime" /> {g.guarantee.title}
              </h3>
              <p className="mt-3 text-muted">{g.guarantee.text}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted/80">{g.guarantee.fine}</p>
            </div>
          </Hud>
          <Hud className="p-7 md:p-9">
            <h3 className="text-2xl font-semibold text-white">{g.bonus.title}</h3>
            <p className="mt-2 text-muted">{g.bonus.text}</p>
            <ul className="mt-8 grid gap-10 sm:grid-cols-2">
              {g.bonus.books.map((b) => <Book key={b.vol} b={b} />)}
            </ul>
          </Hud>
        </div>
      </div>
    </section>
  );
}
