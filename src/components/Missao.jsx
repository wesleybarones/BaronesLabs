import { missao as m } from '../content/site.js';
import { waLink } from '../config.js';
import { Icon, RichTitle, SectionLabel } from './ui.jsx';

export default function Missao() {
  return (
    <section id="missao" aria-labelledby="mis-title" className="section relative overflow-hidden border-y border-line bg-panel/40">
      {/* Canvas da chuva de moedas (etapa 5) */}
      <canvas id="missao-rain" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,255,36,0.07),transparent_60%)]" aria-hidden="true" />

      <div className="container-site relative text-center">
        <SectionLabel>{m.label}</SectionLabel>
        <RichTitle text={m.title} id="mis-title" className="h-section mx-auto max-w-4xl md:!text-6xl" />
        <p className="sub mx-auto mt-6 max-w-2xl">{m.text}</p>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          {m.points.map((pt) => (
            <li key={pt} className="chip !px-3 !py-2 !text-xs">
              <span className="dot-live" aria-hidden="true" /> {pt}
            </li>
          ))}
        </ul>
        <a href={waLink()} target="_blank" rel="noopener" className="btn-primary mt-10">
          <Icon name="whatsapp" /> {m.cta}
        </a>
      </div>
    </section>
  );
}
