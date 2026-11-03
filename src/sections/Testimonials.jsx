import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'
import { EASE } from '../lib/motion'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import HudCorners from '../components/ui/HudCorners'
import { IconArrow } from '../components/Icons'

/*
  IMPORTANTE: não inventamos depoimentos.
  Preencha TESTIMONIALS com falas reais (quote/name/business/photo) — enquanto vazios,
  os cards mostram os placeholders marcados das traduções.
*/
const TESTIMONIALS = [
  { quote: '', name: '', business: '', photo: '' },
  { quote: '', name: '', business: '', photo: '' },
  { quote: '', name: '', business: '', photo: '' },
  { quote: '', name: '', business: '', photo: '' },
  { quote: '', name: '', business: '', photo: '' },
]

function Card({ item, t, active }) {
  return (
    <figure className={`relative flex h-full flex-col justify-between border bg-surface p-7 transition-colors duration-500 md:p-10 ${active ? 'border-cyan/35' : 'border-line'}`}>
      <HudCorners inset={-1} size={16} />
      <span aria-hidden className="font-display text-[64px] leading-none text-cyan/30 [text-shadow:-2px_0_rgba(224,64,216,0.4)]">
        “
      </span>
      <blockquote className="-mt-4 font-display text-[21px] font-medium leading-[1.4] text-ink md:text-[26px]">
        {item.quote || <span className="text-ink-2">{t.placeholder}</span>}
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-4">
        <span className="relative h-12 w-12 shrink-0">
          <span className="absolute inset-0 translate-x-[-2px] translate-y-[1px] rounded-full border border-magenta/60" />
          <span className="absolute inset-0 overflow-hidden rounded-full border border-cyan bg-surface-2 shadow-[0_0_12px_rgba(0,240,255,0.35)]">
            {item.photo ? (
              <img src={item.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-mono text-[10px] text-ink-3">LOGO</span>
            )}
          </span>
        </span>
        <span className="flex flex-col">
          <span className="font-display text-[17px] font-semibold text-ink">{item.name || t.name}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{item.business || t.business}</span>
        </span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const { t } = useLang()
  const tt = t.testimonials
  const reduce = useReducedMotion()
  const n = TESTIMONIALS.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (d) => setActive((a) => (a + d + n) % n)

  useEffect(() => {
    if (paused || reduce) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [paused, reduce]) // eslint-disable-line

  const rel = (i) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>{tt.label}</SectionLabel>
            <RevealHeading text={tt.title} className="h2 max-w-[16ch] text-ink" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label={t.a11y.prev} className="flex h-12 w-12 items-center justify-center border border-line text-cyan transition-colors hover:border-cyan hover:bg-cyan/10">
              <IconArrow className="h-5 w-5 rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.a11y.next} className="flex h-12 w-12 items-center justify-center border border-line text-cyan transition-colors hover:border-cyan hover:bg-cyan/10">
              <IconArrow className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative h-[400px] md:h-[420px]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        aria-roledescription="carousel"
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) go(1)
            else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
          }}
        >
          {TESTIMONIALS.map((item, i) => {
            const d = rel(i)
            const isActive = d === 0
            const hidden = Math.abs(d) > 1
            return (
              <motion.div
                key={i}
                aria-hidden={!isActive}
                className="absolute left-1/2 top-0 h-full w-[min(620px,84vw)]"
                style={{ marginLeft: 'calc(min(620px, 84vw) / -2)' }}
                initial={false}
                animate={{
                  x: `${d * 104}%`,
                  scale: isActive ? 1 : 0.88,
                  opacity: hidden ? 0 : isActive ? 1 : 0.4,
                  filter: isActive ? 'blur(0px)' : 'blur(3px)',
                  zIndex: isActive ? 2 : 1,
                }}
                transition={{ duration: 0.7, ease: EASE }}
                onClick={() => !isActive && go(d)}
              >
                <Card item={item} t={tt} active={isActive} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center gap-2" role="tablist">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`${i + 1} / ${n}`}
            onClick={() => setActive(i)}
            className="flex h-8 items-center px-1"
          >
            <span className={`block h-[2px] transition-all duration-500 ${i === active ? 'w-10 bg-cyan shadow-[0_0_8px_#00F0FF]' : 'w-5 bg-cyan/20'}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
