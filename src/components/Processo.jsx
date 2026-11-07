import { processo as p } from '../content/site.js';
import { SectionHead } from './ui.jsx';

export default function Processo() {
  return (
    <section id="process" aria-labelledby="proc-title" className="section">
      <div className="container-site">
        <SectionHead label={p.label} title={p.title} titleId="proc-title" />

        <ol id="proc-timeline" className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Linha base + linha que se desenha com a rolagem (etapa 5) */}
          <span className="absolute left-[15px] top-0 h-full w-px bg-line md:left-0 md:top-[15px] md:h-px md:w-full" aria-hidden="true" />
          <span
            id="proc-line"
            className="absolute left-[15px] top-0 h-full w-px origin-top bg-gradient-to-b from-cyan to-magenta md:left-0 md:top-[15px] md:h-px md:w-full md:origin-left md:bg-gradient-to-r"
            aria-hidden="true"
          />
          {p.steps.map((s, i) => (
            <li key={s.title} className="proc-step relative pl-12 md:pl-0 md:pt-12">
              <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center border border-cyan bg-bg font-mono text-xs text-cyan shadow-[0_0_14px_rgba(0,240,255,.35)]">
                0{i + 1}
              </span>
              <h3 className="text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
