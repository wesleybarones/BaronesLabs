import { useEffect, useState } from 'react';
import { nav } from '../content/site.js';
import { config, waLink } from '../config.js';
import { Icon } from './ui.jsx';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      id="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <a href="#top" className="flex shrink-0 items-center" aria-label="Barones Labs, voltar ao início">
          <img src={config.assets.logo} srcSet={config.assets.logoSrcSet} sizes="96px" alt="Barones Labs" width="720" height="296" className="h-9 w-auto md:h-10" />
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="font-mono text-[13px] uppercase tracking-wider text-muted transition-colors hover:text-cyan">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a id="btn-orcamento" href={waLink()} target="_blank" rel="noopener" className="btn-primary !px-4 !py-2 text-sm">
            Orçamento
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-line text-cyan md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav id="mobile-menu" aria-label="Menu móvel" hidden={!open} className="border-t border-line md:hidden">
        <ul className="container-site flex flex-col py-3">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)} className="block py-3 font-mono text-sm uppercase tracking-wider text-muted hover:text-cyan">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
