import { motion, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useIsDesktop, useReducedMotion } from '../lib/hooks'
import { waLink } from '../config'
import RevealHeading from '../components/ui/RevealHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { IconArrow } from '../components/Icons'

/* deterministic pseudo-random so the "rain" looks the same on every visit */
function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stylised neon banknote (original design, not a real currency). */
function Note({ magenta }) {
  const c = magenta ? '#E040D8' : '#00F0FF'
  return (
    <svg viewBox="0 0 230 104" className="block h-auto w-full" aria-hidden>
      {magenta && <rect x="-2" y="4" width="228" height="98" rx="8" fill="none" stroke="#00F0FF" strokeOpacity="0.5" strokeWidth="1.5" />}
      <rect x="1" y="2" width="228" height="98" rx="8" fill="#0A1018" fillOpacity="0.92" stroke={c} strokeWidth="2" />
      <rect x="1" y="2" width="228" height="98" rx="8" fill="none" stroke={c} strokeOpacity="0.25" strokeWidth="7" />
      <rect x="10" y="11" width="210" height="80" rx="4" fill="none" stroke={c} strokeOpacity="0.35" strokeWidth="1" />
      {[30, 40, 50, 60, 70].map((y) => (
        <g key={y} stroke={c} strokeOpacity="0.22" strokeWidth="1.2">
          <line x1="22" x2={y % 20 ? 62 : 74} y1={y} y2={y} />
          <line x1={y % 20 ? 168 : 156} x2="208" y1={y} y2={y} />
        </g>
      ))}
      <path d="M115 22 139 36v28l-24 14-24-14V36Z" fill="none" stroke={c} strokeWidth="2" />
      <text x="115" y="61" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="30" fill={c}>
        $
      </text>
      <text x="24" y="86" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={c} fillOpacity="0.8">
        $$$
      </text>
      <text x="206" y="26" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={c} fillOpacity="0.8">
        BL
      </text>
    </svg>
  )
}

function FallingNote({ n, progress, still }) {
  // each note loops top → bottom a few times over the section, so it rains the whole way down
  const fall = (v) => (still ? n.offset : (v * n.cycles + n.offset) % 1)
  const y = useTransform(progress, (v) => `${-22 + 140 * fall(v)}vh`)
  const x = useTransform(progress, (v) => (still ? 0 : Math.sin(v * n.sway * Math.PI * 2 + n.phase) * n.amp))
  const rotate = useTransform(progress, (v) => n.r0 + (n.r1 - n.r0) * (still ? 0.5 : v * n.cycles))
  const rotateX = useTransform(progress, (v) => (still ? 0 : Math.sin(v * n.flutter * Math.PI * 2 + n.phase) * 55))
  return (
    <motion.div
      className="absolute top-0 will-change-transform"
      style={{
        left: `${n.left}%`,
        width: n.w,
        marginLeft: -n.w / 2,
        y,
        x,
        rotate,
        rotateX,
        opacity: n.op,
        filter: n.blur ? `blur(${n.blur}px)` : undefined,
        zIndex: n.front ? 20 : 1,
      }}
    >
      <Note magenta={n.magenta} />
    </motion.div>
  )
}

/**
 * "Meu objetivo é colocar dinheiro no seu bolso": a pinned section where neon banknotes
 * fall as you scroll down and rise back up as you scroll up.
 */
export default function MoneyRain() {
  const { t } = useLang()
  const m = t.money
  const ref = useRef(null)
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end end'] })

  const notes = useMemo(() => {
    const r = rng(48)
    const count = desktop ? 26 : 14
    return Array.from({ length: count }, (_, i) => {
      const depth = r() // 0 far … 1 near
      const front = desktop && i % 8 === 3 // on desktop a few notes pass in front of everything, on the sides only
      const side = r() < 0.5 ? r() * 16 + 2 : r() * 16 + 82
      return {
        left: front ? side : r() * 96 + 2,
        w: Math.round((desktop ? 70 : 54) + depth * (desktop ? 90 : 60) + (front ? 40 : 0)),
        offset: r(),
        cycles: 1.4 + r() * 1.6,
        r0: r() * 80 - 40,
        r1: r() * 360 - 180,
        sway: 0.6 + r() * 1.4,
        amp: 20 + r() * 50,
        flutter: 1 + r() * 2.5,
        phase: r() * Math.PI * 2,
        op: front ? 0.95 : 0.35 + depth * 0.55,
        blur: front ? 0 : depth < 0.3 ? 2.5 : 0,
        magenta: r() < 0.22,
        front,
      }
    })
  }, [desktop])

  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.6])

  return (
    <section id="goal" ref={ref} className="relative h-[200vh] lg:h-[260vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden" style={{ perspective: 900 }}>
        {/* floor glow where the notes land */}
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(0,240,255,0.14),transparent_70%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />

        <div aria-hidden className="pointer-events-none absolute inset-0">
          {notes.map((n, i) => (
            <FallingNote key={i} n={n} progress={scrollYProgress} still={reduce} />
          ))}
        </div>

        {/* content, on a soft dark halo so it stays readable over the notes */}
        <div className="relative z-10 mx-auto max-w-[900px] px-4 text-center md:px-8">
          <div aria-hidden className="absolute inset-[-12%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(7,8,13,0.92),rgba(7,8,13,0.6)_60%,transparent)]" />
          <Reveal distance={14} className="hud mb-6 flex items-center justify-center gap-3">
            <span aria-hidden className="h-px w-8 bg-cyan/50" />
            {m.label}
            <span aria-hidden className="h-px w-8 bg-cyan/50" />
          </Reveal>
          <RevealHeading text={m.title} className="h1 mx-auto max-w-[16ch] text-ink" />
          <Reveal delay={0.15} className="lead mx-auto mt-7 max-w-[560px] text-ink-2">
            {m.text}
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2.5">
              {m.points.map((pt) => (
                <li key={pt} className="glass flex items-center gap-2 border border-line px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink">
                  <span aria-hidden className="h-1.5 w-1.5 bg-cyan shadow-[0_0_6px_#00F0FF]" />
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.35} className="mt-10">
            <Button href={waLink(t.wa.default)} size="lg" magnetic icon={<IconArrow className="h-5 w-5" />}>
              {m.cta}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
