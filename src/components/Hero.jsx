import { hero, hud } from '../content/site.js';
import { config, waLink } from '../config.js';
import { Hud, Icon, RichTitle } from './ui.jsx';

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-h1" className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* HUD de canto */}
      <div className="container-site pointer-events-none relative" aria-hidden="true">
        <div className="hidden items-center justify-between font-mono text-[11px] tracking-widest text-muted/80 md:flex">
          <span>{hud.coords}</span>
          <span>{hud.system}</span>
        </div>
      </div>

      <div className="container-site relative mt-6 grid items-center gap-12 md:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        {/* Coluna de texto */}
        <div id="hero-copy" className="relative">
          <p id="hero-status" className="mb-6 inline-flex items-center gap-2 border border-line bg-panel/70 px-3 py-1.5 font-mono text-xs text-white/90">
            <span className="dot-live" aria-hidden="true" />
            {hero.status}
          </p>

          <h1 id="hero-h1" className="font-display">
            <span id="hero-kicker" className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-cyan md:text-sm">
              {hero.kicker}
            </span>
            <RichTitle
              as="span"
              id="hero-title"
              text={hero.title}
              className="block text-[2.6rem] font-bold leading-[1.02] text-white sm:text-6xl lg:text-[4.4rem]"
            />
          </h1>

          <p id="hero-sub" className="sub mt-6 max-w-xl">{hero.sub}</p>

          <div id="hero-ctas" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a id="cta-hero" href={waLink()} target="_blank" rel="noopener" className="btn-primary">
              <Icon name="whatsapp" className="h-5 w-5" />
              {hero.ctaPrimary}
            </a>
            <a href="#portfolio" className="btn-secondary">
              {hero.ctaSecondary}
              <Icon name="arrowRight" className="h-4 w-4" />
            </a>
          </div>

          <ul id="hero-proofs" className="mt-8 flex flex-wrap gap-2" aria-label="Garantias">
            {hero.proofs.map((p) => (
              <li key={p.id} id={p.id} className="inline-flex items-center gap-2 border border-line bg-panel/60 px-3 py-2 text-sm text-white/90">
                <Icon name="check" className="h-4 w-4 text-lime" />
                {p.text}
              </li>
            ))}
          </ul>

          <ul id="hero-chips" className="mt-4 flex flex-wrap gap-2" aria-label="Indicadores técnicos">
            {hero.chips.map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>
          <div id="replay-slot" className="mt-6 min-h-[20px]" />
        </div>

        {/* Coluna visual */}
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <Hud id="hero-frame" className="relative aspect-[5/6] w-full overflow-hidden !bg-panel">
            <svg id="hero-frame-svg" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 120">
              <rect x="0.5" y="0.5" width="99" height="119" fill="none" stroke="rgba(0,240,255,.35)" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
            </svg>
            <picture>
              <img
                src={config.assets.avatar}
                srcSet={config.assets.avatarSrcSet}
                sizes="(min-width: 1024px) 470px, (min-width: 640px) 420px, 92vw"
                alt="Wesley Barones, fundador da Barones Labs, usando óculos futuristas"
                width="780"
                height="968"
                fetchpriority="high"
                className="h-full w-full object-cover"
              />
            </picture>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" aria-hidden="true" />

            <p className="absolute left-3 top-3 flex items-center gap-2 bg-bg/70 px-2 py-1 font-mono text-[11px] tracking-wider text-white/90">
              <span className="dot-live" aria-hidden="true" /> {hud.id}
            </p>

            <p className="neon absolute bottom-16 left-5 text-[2.6rem] leading-[0.95] sm:text-5xl" aria-label={hero.neon.join(' ')}>
              <span className="block">{hero.neon[0]}</span>
              <span className="neon-m block pl-6">{hero.neon[1]}</span>
            </p>

            {/* Barra de deploy (usada na montagem) */}
            <div id="deploy-bar" className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 border border-line bg-bg/85 px-2 py-1.5">
              <span id="deploy-progress" className="absolute inset-x-0 bottom-0 h-px origin-left bg-lime shadow-[0_0_8px_rgba(212,255,36,.8)]" aria-hidden="true" />
              <span id="deploy-status" className="inline-block font-mono text-[11px] tracking-wider text-lime" role="status">
                ONLINE ✓ · 0.8s
              </span>
              <span id="btn-deploy" className="inline-block border border-cyan/60 px-2 py-0.5 font-mono text-[11px] tracking-widest text-cyan" aria-hidden="true">
                DEPLOY
              </span>
            </div>
          </Hud>

          {/* Encaixe da cópia da prova (drag & drop da montagem) */}
          <div
            id="slot-proof"
            className="absolute -left-4 top-[38%] hidden items-center gap-2 border border-cyan/50 bg-bg/90 px-3 py-2 text-sm text-white shadow-[0_0_24px_rgba(0,240,255,.18)] sm:-left-10 sm:flex"
            aria-hidden="true"
          >
            <Icon name="check" className="h-4 w-4 text-lime" />
            {hero.proofs[0].text}
          </div>
        </div>
      </div>

      <a
        href="#diagnostico"
        className="mx-auto mt-14 flex w-max flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.3em] text-muted hover:text-cyan"
      >
        {hero.scroll}
        <Icon name="arrowDown" className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
