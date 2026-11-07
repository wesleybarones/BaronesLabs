import { useLang } from '../i18n/LangContext'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import HudCorners from '../components/ui/HudCorners'
import { useRef } from 'react'
import { IconArrow } from '../components/Icons'
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL, REVIEWS } from '../config'

/*
  Real reviews from the Google Business Profile (src/config.js → REVIEWS).
  Never invent testimonials: only text copied from Google, unedited.
*/

function Stars({ n = 5, className = '' }) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`} aria-label={`${n}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < n ? 'text-yellow drop-shadow-[0_0_4px_rgba(212,255,36,0.55)]' : 'text-ink-3/40'}`} aria-hidden>
          <path fill="currentColor" d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  )
}

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

function ReviewCard({ r, tt, lang }) {
  return (
    <figure className="group relative flex h-full flex-col border border-line bg-surface/80 backdrop-blur-sm p-7 transition-colors duration-500 hover:border-cyan/40 md:p-9">
      <HudCorners inset={-1} size={16} />
      <div className="flex items-center justify-between gap-4">
        <Stars n={r.stars} />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">{r.when}</span>
      </div>
      <span aria-hidden className="mt-5 font-display text-[56px] leading-none text-cyan/30 [text-shadow:-2px_0_rgba(224,64,216,0.4)]">
        “
      </span>
      <blockquote lang="pt-BR" className={`-mt-5 flex-1 whitespace-pre-line font-display font-medium leading-[1.45] text-ink ${r.text.length > 160 ? 'text-[17px] md:text-[19px]' : 'text-[20px] md:text-[23px]'}`}>
        {r.text}
      </blockquote>
      {lang !== 'pt' && tt.original && <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">{tt.original}</p>}
      <figcaption className="mt-8 flex items-center gap-4">
        <span className="relative h-11 w-11 shrink-0">
          <span className="absolute inset-0 translate-x-[-2px] translate-y-[1px] rounded-full border border-magenta/60" />
          <span className="absolute inset-0 flex items-center justify-center rounded-full border border-cyan bg-surface-2 font-display text-[14px] font-semibold text-cyan shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            {initials(r.name)}
          </span>
        </span>
        <span className="flex flex-col">
          <span className="font-display text-[16px] font-semibold text-ink">{r.name}</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-3">
            {r.business ? `${r.business} · ` : ''}
            {tt.source}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const { t, lang } = useLang()
  const tt = t.testimonials
  const trackRef = useRef(null)
  const slide = (d) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: d * step, behavior: 'smooth' })
  }
  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1180px] px-4 md:px-8">
        <div className="mb-12 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>{tt.label}</SectionLabel>
            <RevealHeading text={tt.title} className="h2 max-w-[16ch] text-ink" />
          </div>
          {/* aggregate rating + subtle link to the Google profile */}
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex items-center gap-3">
              <span className="font-display text-[40px] font-bold leading-none text-ink">{GOOGLE_RATING.score}</span>
              <span className="flex flex-col gap-1">
                <Stars n={5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
                  {GOOGLE_RATING.count} {tt.reviews}
                </span>
              </span>
            </div>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-cyan/80 transition-colors hover:text-cyan"
            >
              {tt.seeAll}
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M5 11L11 5M6 5h5v5" />
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* side-scrolling track over a soft glow; native scroll + snap (touch/trackpad), arrows on desktop */}
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[140%] -translate-y-1/2 bg-[radial-gradient(45%_55%_at_30%_50%,rgba(0,240,255,0.24),transparent_70%),radial-gradient(40%_50%_at_75%_55%,rgba(224,64,216,0.2),transparent_70%)] blur-2xl" />
        <div
          ref={trackRef}
          className="reviews-track flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 md:gap-6 md:px-[max(2rem,calc((100vw_-_1180px)/2_+_2rem))] md:scroll-px-[max(2rem,calc((100vw_-_1180px)/2_+_2rem))] scroll-px-4"
          role="region"
          aria-label={tt.label}
          tabIndex={0}
        >
          {REVIEWS.map((r) => (
            <div key={r.name} className="w-[min(86vw,420px)] shrink-0 snap-start">
              <ReviewCard r={r} tt={tt} lang={lang} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[1180px] items-center justify-end gap-3 px-4 md:px-8">
        <button type="button" onClick={() => slide(-1)} aria-label={t.a11y.prev} className="flex h-12 w-12 items-center justify-center border border-line text-cyan transition-colors hover:border-cyan hover:bg-cyan/10">
          <IconArrow className="h-5 w-5 rotate-180" />
        </button>
        <button type="button" onClick={() => slide(1)} aria-label={t.a11y.next} className="flex h-12 w-12 items-center justify-center border border-line text-cyan transition-colors hover:border-cyan hover:bg-cyan/10">
          <IconArrow className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
