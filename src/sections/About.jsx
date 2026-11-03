import { useLang } from '../i18n/LangContext'
import { ABOUT_PHOTO, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../config'
import RevealHeading from '../components/ui/RevealHeading'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'
import HudCorners from '../components/ui/HudCorners'
import { IconInstagram } from '../components/Icons'
import { LogoSymbol } from '../components/Logo'

function Photo({ alt, placeholder }) {
  const img = (cls = '') =>
    ABOUT_PHOTO ? (
      <img src={ABOUT_PHOTO} alt={alt} loading="lazy" className={`h-full w-full object-cover object-[50%_20%] grayscale contrast-110 ${cls}`} />
    ) : (
      <div role="img" aria-label={alt} className={`relative flex h-full w-full items-end justify-center overflow-hidden bg-[linear-gradient(170deg,#121a28,#07080D)] ${cls}`}>
        {/* abstract silhouette placeholder */}
        <svg viewBox="0 0 200 250" className="h-[88%] w-auto text-cyan/25" aria-hidden>
          <circle cx="100" cy="88" r="42" fill="currentColor" />
          <path d="M20 250c0-56 36-92 80-92s80 36 80 92Z" fill="currentColor" />
        </svg>
        <span className="hud absolute left-1/2 top-[44%] -translate-x-1/2 whitespace-nowrap text-[10px] text-cyan/70">{placeholder}</span>
      </div>
    )
  return (
    <div className="photo-glitch group relative mx-auto aspect-[4/5] w-full max-w-[440px]">
      {/* magenta double outline */}
      <div aria-hidden className="absolute inset-0 translate-x-[-6px] translate-y-[4px] border border-magenta/60" />
      <div className="relative h-full w-full overflow-hidden border border-cyan shadow-[0_0_30px_rgba(0,240,255,0.25)]">
        {img()}
        {/* duotone wash */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,240,255,0.18),rgba(7,8,13,0.55))] mix-blend-color" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        {/* glitch layer (hover) */}
        <div aria-hidden className="photo-layer-m absolute inset-0 opacity-0 mix-blend-screen" style={{ filter: 'hue-rotate(270deg) saturate(3)' }}>
          {img()}
        </div>
        <div aria-hidden className="bg-scanlines pointer-events-none absolute inset-0 opacity-80" />
        <span className="hud absolute bottom-4 left-4 text-[10px] text-cyan/80">ID · W.BARONES</span>
        <LogoSymbol className="absolute right-4 top-4 h-8 w-8 opacity-80" />
      </div>
      <HudCorners inset={-12} size={20} />
    </div>
  )
}

export default function About() {
  const { t } = useLang()
  const a = t.about
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-4 md:px-8 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5" blur>
          <Photo alt={a.photoAlt} placeholder={a.photoPlaceholder} />
        </Reveal>
        <div className="lg:col-span-7">
          <SectionLabel>{a.label}</SectionLabel>
          <RevealHeading text={a.title} className="h2 text-ink" />
          {a.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.12 + i * 0.08} className="lead mt-6 max-w-[580px]">
              {p}
            </Reveal>
          ))}
          <Reveal as="dl" delay={0.3} className="mt-10 grid max-w-[580px] grid-cols-3 border-y border-line">
            {a.stats.map((s, i) => (
              <div key={s.k} className={`py-5 ${i > 0 ? 'border-l border-line pl-4 md:pl-6' : ''}`}>
                <dt className="hud text-[10.5px] text-ink-3">{s.k}</dt>
                <dd className="mt-1.5 font-display text-[15px] font-semibold text-ink md:text-[18px]">{s.v}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.38} className="mt-8">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u inline-flex min-h-12 items-center gap-3 font-display text-[16px] font-semibold text-cyan"
            >
              <IconInstagram className="h-5 w-5" />@{INSTAGRAM_HANDLE}
              <span className="font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-ink-3">· {a.instagram}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
