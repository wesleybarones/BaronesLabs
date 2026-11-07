import { useInView } from 'motion/react'
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

/** One falling note: a CSS loop (runs on the compositor, independent of scroll). */
function FallingNote({ n }) {
  return (
    <div
      className="note-fall absolute top-0"
      style={{
        left: `${n.left}%`,
        width: n.w,
        marginLeft: -n.w / 2,
        opacity: n.op,
        filter: n.blur ? `blur(${n.blur}px)` : undefined,
        zIndex: n.front ? 20 : 1,
        '--dur': `${n.dur}s`,
        '--delay': `${-n.offset * n.dur}s`, // negative delay: every note starts mid-fall, no empty first seconds
        '--dx': `${n.drift}px`,
        '--r0': `${n.r0}deg`,
        '--r1': `${n.r1}deg`,
        '--still-y': `${n.offset * 100 - 10}vh`,
      }}
    >
      <div className="note-flutter" style={{ '--fl': `${n.fl}s`, '--fl-delay': `${-n.offset * n.fl}s` }}>
        <Note magenta={n.magenta} />
      </div>
    </div>
  )
}

/**
 * "Meu objetivo é colocar dinheiro no seu bolso": neon banknotes keep falling on their own
 * (not tied to scroll). The loop pauses while the section is off screen.
 */
export default function MoneyRain() {
  const { t } = useLang()
  const m = t.money
  const ref = useRef(null)
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  const inView = useInView(ref, { margin: '200px 0px' })

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
        dur: 7 + r() * 6 - depth * 2, // nearer notes fall a bit faster
        drift: r() * 120 - 60,
        r0: r() * 80 - 40,
        r1: r() * 360 - 180,
        fl: 0.9 + r() * 1.4,
        op: front ? 0.95 : 0.35 + depth * 0.55,
        blur: front ? 0 : depth < 0.3 ? 2.5 : 0,
        magenta: r() < 0.22,
        front,
      }
    })
  }, [desktop])

  return (
    <section id="goal" ref={ref} className={`relative ${inView && !reduce ? '' : 'money-paused'} ${reduce ? 'money-still' : ''}`}>
      <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-24" style={{ perspective: 900 }}>
        {/* rain + floor glow fade out at the top and bottom, so the section blends into its neighbours */}
        <div aria-hidden className="money-fade pointer-events-none absolute inset-0">
          {/* floor glow where the notes land */}
          <div className="absolute inset-x-0 bottom-[8%] h-[45%] opacity-80 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(0,240,255,0.14),transparent_70%)]" />
          <div className="absolute inset-x-[10%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
          {notes.filter((n) => !n.front).map((n, i) => (
            <FallingNote key={i} n={n} />
          ))}
        </div>
        {/* the few notes that pass in front of the text (desktop), same fade */}
        <div aria-hidden className="money-fade pointer-events-none absolute inset-0 z-20">
          {notes.filter((n) => n.front).map((n, i) => (
            <FallingNote key={i} n={n} />
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
