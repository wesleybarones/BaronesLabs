import { hud, sobre as s } from '../content/site.js';
import { config } from '../config.js';
import { Hud, Icon, RichTitle, SectionLabel } from './ui.jsx';

export default function Sobre() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="section">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Hud className="relative mx-auto aspect-[5/6] w-full max-w-[380px] overflow-hidden" color="#E040D8">
          <img
            src={config.assets.portrait}
            alt="Retrato de Wesley Barones"
            width="768" height="1024" loading="lazy" decoding="async"
            className="h-full w-full object-cover"
          />
          <p className="absolute bottom-3 left-3 flex items-center gap-2 bg-bg/80 px-2 py-1 font-mono text-[11px] tracking-wider text-white/90">
            <span className="dot-live" aria-hidden="true" /> {hud.id}
          </p>
        </Hud>

        <div>
          <SectionLabel>{s.label}</SectionLabel>
          <RichTitle text={s.title} id="sobre-title" />
          {s.paragraphs.map((t) => <p key={t} className="sub mt-5">{t}</p>)}
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {s.stats.map((st) => (
              <div key={st.label} className="border border-line bg-panel/60 p-4">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">{st.label}</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-white">{st.value}</dd>
              </div>
            ))}
          </dl>
          <a href={config.instagram.url} target="_blank" rel="noopener" className="btn-secondary mt-8">
            <Icon name="instagram" /> {s.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
