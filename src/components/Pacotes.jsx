import { pacotes as p } from '../content/site.js';
import { waMaintenance, waPackage } from '../config.js';
import { Hud, Icon, SectionHead } from './ui.jsx';

function Plan({ plan }) {
  const f = plan.featured;
  return (
    <li id={`plan-${plan.id}`} className={`relative ${f ? 'lg:-mt-4' : ''}`}>
      <Hud
        className={`flex h-full flex-col p-6 md:p-7 ${f ? '!border-magenta/70 !bg-[#120b16] shadow-[0_0_50px_-12px_rgba(224,64,216,.45)]' : ''}`}
        color={f ? '#E040D8' : '#00F0FF'}
      >
        {f && (
          <svg id="premium-border" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
            <rect x="1" y="1" style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }} fill="none" stroke="#E040D8" strokeWidth="1.5" />
          </svg>
        )}
        {plan.badge && (
          <span className="absolute -top-3 right-5 inline-flex items-center gap-1.5 bg-lime px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-bg shadow-[0_0_14px_rgba(212,255,36,.6)]">
            ★ {plan.badge}
          </span>
        )}
        <h3 className="font-display text-sm font-semibold tracking-[0.25em] text-cyan">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted">{plan.pitch}</p>

        <p className="mt-6 font-display text-5xl font-bold text-white">
          <span className="plan-price">{plan.priceLabel}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-sky">{plan.cashLabel}</p>
        <p className="mt-3 inline-flex w-max items-center gap-2 border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80">
          <span className="dot-live" aria-hidden="true" /> {plan.delivery}
        </p>
        {plan.nudge && <p className="mt-3 text-sm font-semibold text-magenta">{plan.nudge}</p>}

        <ul className="mt-6 grid gap-2.5 border-t border-line pt-6 text-sm">
          {plan.features.map((ft) => (
            <li key={ft} className="flex gap-3 text-white/90">
              <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${f ? 'text-magenta' : 'text-cyan'}`} />
              {ft}
            </li>
          ))}
        </ul>

        <a href={waPackage(plan.waName)} target="_blank" rel="noopener" className={`${f ? 'btn-primary' : 'btn-secondary'} mt-8 w-full`}>
          {plan.cta}
        </a>
      </Hud>
    </li>
  );
}

export default function Pacotes() {
  const s = p.signature;
  return (
    <section id="pricing" aria-labelledby="price-title" className="section">
      <div className="container-site">
        <SectionHead label={p.label} title={p.title} sub={p.sub} titleId="price-title" />

        <ul className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {p.plans.map((pl) => <Plan key={pl.id} plan={pl} />)}
        </ul>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted" aria-label="Formas de pagamento">
          {p.payments.map((pay) => (
            <li key={pay} className="flex items-center gap-2"><span className="text-cyan" aria-hidden="true">◆</span>{pay}</li>
          ))}
        </ul>

        {/* Signature */}
        <Hud
          id="plan-signature"
          className="mt-16 overflow-hidden !border-[#C8A86A]/40 !bg-[linear-gradient(135deg,#0E0D12_0%,#14110C_55%,#0B0A0F_100%)] p-6 md:p-10"
          color="#E8C98A"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(232,201,138,.18),transparent_70%)]" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8C98A]">{s.label} · {s.slots}</p>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-[0.12em] text-[#F6E7C6] md:text-4xl">{s.name}</h3>
              <p className="mt-4 text-white/80">{s.pitch}</p>
              <p className="mt-8 font-display text-5xl font-bold text-[#F6E7C6]">{s.priceLabel}</p>
              <p className="mt-1 font-mono text-xs text-[#E8C98A]">{s.installments}</p>
              <p className="mt-4 inline-flex items-center gap-2 border border-[#E8C98A]/40 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-[#F6E7C6]">
                <span className="dot-live" aria-hidden="true" /> {s.delivery}
              </p>
              <div className="mt-8">
                <a href={waPackage(s.waName)} target="_blank" rel="noopener" className="btn w-full border-[#E8C98A] bg-[#E8C98A] text-bg hover:shadow-[0_0_24px_rgba(232,201,138,.5)] sm:w-auto">
                  {s.cta}
                </a>
              </div>
            </div>
            <ul className="grid content-start gap-3 text-sm sm:grid-cols-2">
              {s.features.map((ft) => (
                <li key={ft} className="flex gap-3 border-b border-white/5 pb-3 text-white/85">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-[#E8C98A]" />
                  {ft}
                </li>
              ))}
            </ul>
          </div>
        </Hud>

        {/* Manutenção */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border border-line bg-panel/60 p-5 md:flex-row md:items-center md:px-7">
          <p className="text-white/90">
            <span className="font-display font-semibold text-white">{p.maintenance.title}</span>
            <span className="mx-2 text-cyan">·</span>
            <span className="font-mono text-cyan">{p.maintenance.price}</span>
            <span className="mx-2 text-line">·</span>
            <span className="text-muted">{p.maintenance.text}</span>
          </p>
          <a href={waMaintenance()} target="_blank" rel="noopener" className="btn-secondary !py-2.5">{p.maintenance.cta}</a>
        </div>
      </div>
    </section>
  );
}
