import { solucao as s } from '../content/site.js';
import { Hud, Icon, SectionHead } from './ui.jsx';

export default function Solucao() {
  const w = s.widget;
  return (
    <section id="solucao" aria-labelledby="sol-title" className="section">
      <div className="container-site">
        <SectionHead label={s.label} title={s.title} titleId="sol-title" />

        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
          <ol className="grid gap-4">
            {s.pillars.map((p, i) => (
              <li key={p.tag}>
                <Hud className="group flex gap-5 p-6 transition-colors hover:border-cyan/40 md:p-7">
                  <span className="font-mono text-sm text-magenta" aria-hidden="true">0{i + 1}</span>
                  <div>
                    <p className="label-mono !text-sky">{p.tag}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{p.title}</h3>
                    <p className="mt-2 text-muted">{p.text}</p>
                  </div>
                </Hud>
              </li>
            ))}
          </ol>

          {/* Widget de produção */}
          <Hud id="sol-widget" className="self-start p-6" aria-label="Painel de produção do site">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{w.timerLabel}</p>
                <p className="mt-2 font-display text-6xl font-bold leading-none text-white">
                  {w.timerValue}<span className="ml-2 text-2xl font-semibold text-cyan">{w.timerUnit}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-2 border border-lime/40 px-2 py-1 font-mono text-[11px] text-lime">
                <span className="dot-live" aria-hidden="true" /> {w.timerStatus}
              </span>
            </div>

            <div className="mt-7">
              <div className="h-1.5 w-full bg-line">
                <div id="sol-build-bar" className="h-full w-full origin-left bg-gradient-to-r from-cyan via-sky to-magenta" />
              </div>
              <ol className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-muted">
                {w.build.map((b, i) => (
                  <li key={b} className={`sol-build-step ${i === w.build.length - 1 ? 'text-lime' : ''}`}>
                    {b}{i < w.build.length - 1 && <span className="ml-2 text-muted/50" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
            </div>

            <ul id="sol-checklist" className="mt-7 grid gap-2.5">
              {w.checklist.map((c) => (
                <li key={c} className="sol-check flex items-center gap-3 text-sm text-white/90">
                  <span className="grid h-5 w-5 place-items-center border border-cyan/60 text-cyan">
                    <Icon name="check" className="sol-tick h-3.5 w-3.5" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </Hud>
        </div>

        {/* Túnel de transição (animado na etapa 5) */}
        {/* Túnel de transição: anéis que "voam" na direção do visitante conforme a rolagem */}
        <div id="sol-tunnel" className="relative mt-20 grid h-56 place-items-center overflow-hidden border-y border-line md:h-72" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={`tunnel-ring ${i % 3 === 2 ? 'tunnel-ring-m' : ''}`}
              style={{ transform: `scale(${0.35 + i * 0.45})`, opacity: Math.max(0, 0.5 - i * 0.06) }}
            />
          ))}
          <p className="tunnel-text relative px-4 text-center font-mono text-sm uppercase tracking-[0.35em] text-cyan md:text-base">{s.tunnel}</p>
        </div>
      </div>
    </section>
  );
}
