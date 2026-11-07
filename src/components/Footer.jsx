import { ctaFinal, footer as f, nav } from '../content/site.js';
import { config, waLink } from '../config.js';
import { Icon, RichTitle } from './ui.jsx';

export function CTAFinal() {
  return (
    <section id="cta-final" aria-labelledby="cta-title" className="section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,240,255,.12),transparent_60%)]" aria-hidden="true" />
      <div className="container-site relative text-center">
        <RichTitle text={ctaFinal.title} id="cta-title" className="h-section mx-auto max-w-4xl md:!text-6xl" />
        <p className="sub mx-auto mt-6 max-w-xl">{ctaFinal.text}</p>
        <a href={waLink()} target="_blank" rel="noopener" className="btn-primary mt-10 !px-8 !py-4 !text-base">
          <Icon name="whatsapp" /> {ctaFinal.cta}
        </a>
      </div>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-panel/60">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={config.assets.logo} srcSet={config.assets.logoSrcSet} sizes="120px" alt="Barones Labs" width="720" height="296" loading="lazy" className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-muted">{f.tagline}</p>
          <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lime">
            <span className="dot-live" aria-hidden="true" /> {f.status}
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">{f.navTitle}</h2>
          <ul className="mt-4 grid gap-2">
            {nav.map((n) => (
              <li key={n.href}><a href={n.href} className="text-muted hover:text-cyan">{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-cyan">{f.contactTitle}</h2>
          <ul className="mt-4 grid gap-3">
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-muted hover:text-cyan">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp {config.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={config.instagram.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-muted hover:text-cyan">
                <Icon name="instagram" className="h-4 w-4" /> Instagram {config.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col items-start justify-between gap-3 py-5 font-mono text-xs text-muted sm:flex-row sm:items-center">
          <p>{f.copyright}</p>
          <a href="#top" className="inline-flex items-center gap-1.5 uppercase tracking-wider hover:text-cyan">
            {f.backToTop} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
