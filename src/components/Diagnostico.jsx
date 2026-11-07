import { diagnostico as d } from '../content/site.js';
import { Hud, SectionHead } from './ui.jsx';

/**
 * Estado natural (sem animação / reduced-motion) = estado FINAL da mini-coreografia:
 * erros riscados, tags "corrigido" visíveis e "Sistema OK".
 */
export default function Diagnostico() {
  return (
    <section id="diagnostico" aria-labelledby="diag-title" className="section">
      <div className="container-site">
        <SectionHead label={d.label} title={d.title} sub={d.sub} titleId="diag-title" />

        <Hud id="diag-panel" className="relative overflow-hidden p-2 sm:p-3" color="#E040D8">
          {/* Scanner: faixa horizontal que varre o painel de cima para baixo */}
          <div id="diag-scanner" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 opacity-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan/20" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-cyan shadow-[0_0_14px_#00F0FF]" />
          </div>

          <ul className="divide-y divide-line">
            {d.items.map((item, i) => (
              <li key={item} className="diag-item flex items-start gap-4 px-3 py-5 sm:items-center sm:px-5">
                <span className="diag-code is-fixed shrink-0 border border-err/60 bg-err/10 px-2 py-0.5 font-mono text-xs font-semibold tracking-widest text-[#FF7A93]">
                  ERR_0{i + 1}
                </span>
                <span className="flex-1 text-base text-white/90 md:text-lg">{item}</span>
                <span className="diag-fix hidden shrink-0 font-mono text-[11px] uppercase tracking-widest text-lime sm:inline">
                  ✓ {d.fixed}
                </span>
              </li>
            ))}
          </ul>

          <div className="relative mt-2 flex items-center justify-between border-t border-line px-3 py-3 font-mono text-xs tracking-wider sm:px-5">
            <span id="diag-bar" className="absolute inset-x-0 -top-px h-px origin-left bg-lime shadow-[0_0_8px_rgba(212,255,36,.8)]" aria-hidden="true" />
            <span id="diag-scan-text" className="text-muted">{d.scanning}</span>
            <span id="diag-ok" className="inline-flex items-center gap-2 text-lime">
              <span className="dot-live" aria-hidden="true" /> {d.ok}
            </span>
          </div>
        </Hud>
      </div>
    </section>
  );
}
