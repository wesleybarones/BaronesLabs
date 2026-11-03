import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useIsDesktop, useReducedMotion } from '../lib/hooks'
import { PROJECTS, waLink } from '../config'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import HudCorners from '../components/ui/HudCorners'
import { Laptop, Phone } from '../components/Mockups'
import { IconArrowUpRight, IconArrow } from '../components/Icons'
import { LogoSymbol } from '../components/Logo'
import { canEmbed } from '../lib/embed'

// the live-site viewer is only downloaded when someone opens it
const LiveSiteModal = lazy(() => import('../components/LiveSiteModal'))

function ProjectSlide({ p, index, total, onExplore }) {
  const { t } = useLang()
  const seg = t.portfolio.segments[p.id] ?? ''
  const Wrap = p.url ? 'a' : 'div'
  // abre a navegação ao vivo; se a página não puder embutir outros sites, segue o link normal
  const explore = (e) => {
    if (!p.url || !canEmbed()) return
    e.preventDefault()
    onExplore(p)
  }
  return (
    <article className="group relative grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
      <Wrap
        {...(p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer', onClick: explore, 'aria-label': `${t.portfolio.explore}: ${p.name}` } : {})}
        data-cursor="view"
        className="relative block lg:col-span-8"
      >
        <div aria-hidden className="absolute inset-[8%] -z-10 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${p.accent}26, transparent 65%)` }} />
        <div className="relative pb-[6%] pr-[12%] transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5">
          <Laptop accent={p.accent} name={p.name} label={t.portfolio.preview} src={p.desktop} alt={t.portfolio.shotDesktop.replace('{name}', p.name)} />
          <div className="absolute bottom-0 right-0 w-[22%] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3">
            <Phone accent={p.accent} name={p.name} label={t.portfolio.preview} src={p.mobile} alt={t.portfolio.shotMobile.replace('{name}', p.name)} />
          </div>
        </div>
      </Wrap>
      <div className="lg:col-span-4">
        <span className="hud text-[11px] text-ink-3">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <h3 className="mt-3 font-display text-[clamp(30px,3.4vw,52px)] font-bold leading-[1.05] text-ink [overflow-wrap:anywhere]">{p.name}</h3>
        <span className="hud mt-4 inline-block border border-line px-2.5 py-1 text-[11px]">{seg}</span>
        <div className="mt-8">
          {p.url ? (
            <div className="flex flex-col items-start gap-4">
              <Button href={p.url} onClick={explore} icon={<IconArrow className="h-4 w-4" />}>
                {t.portfolio.explore}
              </Button>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-u link-u-tall inline-flex min-h-12 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-2 hover:text-cyan"
              >
                {t.portfolio.view} <IconArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-3">
              {t.portfolio.view} <IconArrowUpRight className="h-4 w-4" /> <span className="text-ink-3/70">· {t.portfolio.soon}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function NextSlot() {
  const { t } = useLang()
  const n = t.portfolio.next
  return (
    <article className="relative grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="relative flex aspect-[16/10] items-center justify-center border border-dashed border-cyan/30 lg:col-span-8">
        <HudCorners inset={-1} size={22} />
        <LogoSymbol className="h-[46%] w-auto opacity-25" sizes="300px" />
        <span className="hud absolute left-5 top-5 text-[11px]">{n.tag}</span>
      </div>
      <div className="lg:col-span-4">
        <span className="hud text-[11px] text-ink-3">+</span>
        <h3 className="mt-3 font-display text-[36px] font-bold leading-none text-ink md:text-[52px]">{n.title}</h3>
        <p className="lead mt-4">{n.text}</p>
        <div className="mt-8">
          <Button href={waLink(t.wa.default)} icon={<IconArrow className="h-4 w-4" />}>
            {n.cta}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function Portfolio() {
  const { t } = useLang()
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  const pinned = desktop && !reduce
  const total = PROJECTS.length
  const [live, setLive] = useState(null)
  const [viewerUsed, setViewerUsed] = useState(false)
  const slides = [...PROJECTS.map((p, i) => <ProjectSlide key={p.id} p={p} index={i} total={total} onExplore={(proj) => { setViewerUsed(true); setLive(proj) }} />), <NextSlot key="next" />]
  const modal = viewerUsed && (
    <Suspense fallback={null}>
      <LiveSiteModal project={live} onClose={() => setLive(null)} />
    </Suspense>
  )

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  useLayoutEffect(() => {
    if (!pinned) return
    const measure = () => {
      const tr = trackRef.current
      if (tr) setDist(Math.max(0, tr.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned, slides.length])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const xRaw = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist])
  const x = useSpring(xRaw, { stiffness: 140, damping: 26, mass: 0.4 })
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1])

  // mobile carousel progress
  const scroller = useRef(null)
  const [mIdx, setMIdx] = useState(0)

  const head = (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <SectionLabel>{t.portfolio.label}</SectionLabel>
        <RevealHeading text={t.portfolio.title} className="h2 text-ink" />
      </div>
      <Reveal className="max-w-[360px] text-[15px] text-ink-2">{t.portfolio.sub}</Reveal>
    </div>
  )

  if (pinned) {
    return (
      <section id="portfolio" ref={sectionRef} className="relative" style={{ height: `${slides.length * 100 + 20}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-[96px]">
          <div className="mx-auto w-full max-w-[1360px] px-8">{head}</div>
          <div className="relative flex flex-1 items-center">
            <motion.div ref={trackRef} className="flex w-max gap-[8vw] pl-[max(2rem,calc((100vw-1360px)/2+2rem))] pr-[15vw]" style={{ x }}>
              {slides.map((s, i) => (
                <div key={i} className="w-[70vw] max-w-[1180px] shrink-0">
                  {s}
                </div>
              ))}
            </motion.div>
          </div>
          <div className="mx-auto mb-10 flex w-full max-w-[1360px] items-center gap-6 px-8">
            <span className="hud text-[11px] text-ink-3">{t.portfolio.label.replace('// ', '')}</span>
            <div className="relative h-[2px] flex-1 bg-cyan/10">
              <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-cyan shadow-[0_0_10px_#00F0FF]" style={{ scaleX: bar }} />
            </div>
            <span className="hud text-[11px] text-ink-3">
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
        {modal}
      </section>
    )
  }

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">{head}</div>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          const w = el.firstChild?.firstChild?.getBoundingClientRect().width || 1
          setMIdx(Math.round(el.scrollLeft / w))
        }}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-4 pb-4 md:px-8"
      >
        <div className="flex gap-5">
          {slides.map((s, i) => (
            <div key={i} className="w-[86vw] shrink-0 snap-center md:w-[72vw]">
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-[1360px] gap-2 px-4 md:px-8" aria-hidden>
        {slides.map((_, i) => (
          <span key={i} className={`h-[2px] flex-1 transition-colors duration-300 ${i <= mIdx ? 'bg-cyan shadow-[0_0_8px_#00F0FF]' : 'bg-cyan/15'}`} />
        ))}
      </div>
      {modal}
    </section>
  )
}
