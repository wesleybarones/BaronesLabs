import { useRef } from 'react';
import { depoimentos as d } from '../content/site.js';
import { config } from '../config.js';
import { Hud, Icon, SectionHead, Stars } from './ui.jsx';

const LONG = 160;

export default function Depoimentos() {
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: 'smooth' });
  };

  return (
    <section id="depoimentos" aria-labelledby="dep-title" className="section overflow-hidden">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead label={d.label} title={d.title} titleId="dep-title" />
          <div className="mb-12 flex flex-col items-start gap-4 md:mb-16 md:items-end">
            <p className="flex items-center gap-3 border border-line bg-panel/70 px-3 py-2">
              <span className="font-display text-lg font-bold text-white">{d.ratingLabel}</span>
              <Stars n={5} />
              <span className="font-mono text-xs text-muted">· {d.count} avaliações no Google</span>
            </p>
            <div className="flex items-center gap-4">
              <a href={config.google.reviewsUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan underline-offset-4 hover:underline">
                {d.seeAll} <Icon name="external" className="h-3.5 w-3.5" />
              </a>
              <div className="hidden gap-2 md:flex">
                <button type="button" onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center border border-line text-cyan hover:border-cyan" aria-label="Avaliação anterior">
                  <Icon name="arrowLeft" />
                </button>
                <button id="dep-next" type="button" onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center border border-line text-cyan hover:border-cyan" aria-label="Próxima avaliação">
                  <Icon name="arrowRight" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* brilho suave atrás dos cards */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,240,255,.12),transparent_60%),radial-gradient(ellipse_at_70%_50%,rgba(224,64,216,.12),transparent_60%)]" aria-hidden="true" />
        <ul
          ref={track}
          id="dep-track"
          className="no-scrollbar edge-fade relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 py-4 sm:px-6 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]"
          style={{ scrollPaddingInline: 'max(1rem, calc((100vw - 1240px) / 2 + 2rem))' }}
          aria-label="Avaliações do Google"
          tabIndex={0}
        >
          {d.items.map((r) => {
            const long = r.text.length > LONG;
            return (
              <li key={r.name} className="w-[min(86vw,420px)] shrink-0 snap-start">
                <Hud as="figure" className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <Stars n={r.stars} className="text-lg" />
                    <span className="font-mono text-[11px] text-muted">{r.date}</span>
                  </div>
                  <blockquote className={`mt-4 flex-1 whitespace-pre-line text-white/90 ${long ? 'text-[0.9rem] leading-relaxed' : 'text-lg leading-relaxed'}`}>
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center border border-cyan/40 bg-bg font-display font-semibold text-cyan" aria-hidden="true">
                      {r.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{r.name}</span>
                      <span className="block font-mono text-[11px] text-muted">
                        {r.business ? `${r.business} · Avaliação no Google` : 'Avaliação no Google'}
                      </span>
                    </span>
                  </figcaption>
                </Hud>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
