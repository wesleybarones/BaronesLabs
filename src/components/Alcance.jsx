import { alcance as a, hud } from '../content/site.js';
import { waLink } from '../config.js';
import Globe from './Globe.jsx';
import { Icon, SectionHead } from './ui.jsx';

export default function Alcance() {
  return (
    <section id="alcance" aria-labelledby="alc-title" className="section overflow-hidden">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHead label={a.label} title={a.title} sub={a.text} titleId="alc-title" />
          <ul className="-mt-4 grid gap-3">
            {a.points.map((pt) => (
              <li key={pt} className="flex items-center gap-3 text-white/90">
                <span className="grid h-6 w-6 place-items-center border border-cyan/50 text-cyan"><Icon name="check" className="h-3.5 w-3.5" /></span>
                {pt}
              </li>
            ))}
          </ul>
          <a href={waLink()} target="_blank" rel="noopener" className="btn-primary mt-10">
            <Icon name="whatsapp" /> {a.cta}
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <Globe marker={a.marker} />
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted" aria-hidden="true">
            ↔ {a.hint}
          </p>
          <p className="pointer-events-none absolute right-0 top-2 font-mono text-[10px] tracking-widest text-muted/70" aria-hidden="true">{hud.coords}</p>
        </div>
      </div>
    </section>
  );
}
