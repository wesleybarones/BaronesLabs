import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useIsDesktop } from '../lib/hooks'
import { EASE } from '../lib/motion'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import Counter from '../components/ui/Counter'
import HudCorners from '../components/ui/HudCorners'
import { IconCheck } from '../components/Icons'

/* ── Visual 1: delivery timer ring ───────────────────────── */
function TimerVisual({ active }) {
  const { t } = useLang()
  const C = 2 * Math.PI * 120
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
        <g transform="translate(150 150)">
          {Array.from({ length: 48 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-140"
              x2="0"
              y2={i % 6 === 0 ? -130 : -135}
              stroke={i % 6 === 0 ? '#00F0FF' : 'rgba(0,240,255,0.3)'}
              strokeWidth="1"
              transform={`rotate(${i * 7.5})`}
            />
          ))}
          <circle r="120" fill="none" stroke="rgba(0,240,255,0.1)" strokeWidth="2" />
          <motion.circle
            r="120"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform="rotate(-90)"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: active ? C * 0.0 : C }}
            transition={{ duration: 1.6, ease: EASE }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.8))' }}
          />
          <circle r="120" fill="none" stroke="#E040D8" strokeWidth="1" opacity="0.35" transform="translate(-2 1)" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="hud mb-2 text-[11px] text-ink-3">{t.solution.timer.label}</span>
        <span className="hl font-display text-[96px] font-bold leading-none md:text-[120px]">
          {active ? <Counter value={48} duration={1.6} once={false} /> : '00'}
        </span>
        <span className="mt-1 font-mono text-[13px] uppercase tracking-[0.3em] text-ink-2">{t.solution.timer.unit}</span>
        <span className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan/80">
          <span className="live-dot scale-75" />
          {t.solution.timer.status}
        </span>
      </div>
    </div>
  )
}

/* ── Visual 2: mockup assembling layer by layer ──────────── */
function BuildVisual({ active }) {
  const { t } = useLang()
  const steps = t.solution.build
  const layer = (i) => ({
    initial: { opacity: 0, y: 14 },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.5, ease: EASE, delay: active ? 0.15 + i * 0.28 : 0 },
  })
  return (
    <div className="relative mx-auto grid w-full max-w-[520px] grid-cols-[1fr_auto] gap-5">
      <div className="relative aspect-[4/3.4] border border-line bg-surface/70 p-4">
        <HudCorners inset={-1} size={14} />
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-white/15" />
          ))}
        </div>
        <div className="relative h-[calc(100%-20px)]">
          <motion.div {...layer(0)} className="absolute inset-0 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="border-x border-dashed border-cyan/15" />
            ))}
          </motion.div>
          <motion.div {...layer(1)} className="absolute left-[6%] top-[10%] w-[55%] space-y-2.5">
            <span className="block h-4 w-full bg-ink/85" />
            <span className="block h-4 w-3/4 bg-ink/85" />
            <span className="block h-2 w-5/6 bg-ink/25" />
            <span className="block h-2 w-2/3 bg-ink/25" />
          </motion.div>
          <motion.div
            {...layer(2)}
            className="absolute right-[5%] top-[8%] h-[56%] w-[32%] bg-[linear-gradient(150deg,rgba(0,240,255,0.35),rgba(224,64,216,0.15))]"
          />
          <motion.div {...layer(3)} className="absolute bottom-[14%] left-[6%]">
            <span className="chamfer chamfer-sm block h-9 w-32 bg-cyan shadow-[0_0_20px_rgba(0,240,255,0.6)]" />
          </motion.div>
          <motion.div {...layer(4)} className="absolute bottom-[14%] right-[5%]">
            <span className="flex items-center gap-2 border border-yellow/40 bg-yellow/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-yellow">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
              Live
            </span>
          </motion.div>
        </div>
      </div>
      <ol className="flex flex-col justify-center gap-3">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
            initial={{ color: '#55637A' }}
            animate={{ color: active ? '#00F0FF' : '#55637A' }}
            transition={{ delay: active ? 0.15 + i * 0.28 : 0 }}
          >
            <span className="w-5 text-ink-3">0{i + 1}</span>
            {s}
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

/* ── Visual 3: self-ticking checklist ───────────────────── */
function ChecklistVisual({ active }) {
  const { t } = useLang()
  const items = t.solution.checklist
  return (
    <div className="relative mx-auto w-full max-w-[460px] border border-line bg-surface/80 font-mono">
      <HudCorners inset={-1} size={14} />
      <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-ink-3">
        <span>setup.sh</span>
        <span className="text-cyan/70">barones-labs</span>
      </div>
      <ul className="space-y-1 p-5">
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={it} className="flex items-center gap-4 py-2">
              <span className="relative flex h-6 w-6 items-center justify-center border border-cyan/40">
                <motion.span
                  className={`absolute inset-0 ${last ? 'bg-yellow' : 'bg-cyan'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: active ? 1 : 0 }}
                  transition={{ delay: active ? 0.2 + i * 0.22 : 0, type: 'spring', stiffness: 300, damping: 18 }}
                />
                <motion.span
                  className="relative text-bg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{ delay: active ? 0.28 + i * 0.22 : 0 }}
                >
                  <IconCheck className="h-4 w-4" />
                </motion.span>
              </span>
              <motion.span
                className="text-[14px] tracking-[0.04em]"
                initial={{ color: '#55637A' }}
                animate={{ color: active ? (last ? '#D4FF24' : '#E8F7FA') : '#55637A' }}
                transition={{ delay: active ? 0.2 + i * 0.22 : 0 }}
              >
                {it}
              </motion.span>
              <motion.span
                className="ml-auto text-[11px] tracking-[0.2em] text-cyan/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ delay: active ? 0.3 + i * 0.22 : 0 }}
              >
                OK
              </motion.span>
            </li>
          )
        })}
      </ul>
      <div className="h-[3px] bg-cyan/10">
        <motion.div
          className="h-full origin-left bg-cyan shadow-[0_0_10px_#00F0FF]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: 0.22 * items.length + 0.2, ease: 'linear', delay: active ? 0.2 : 0 }}
        />
      </div>
    </div>
  )
}

const VISUALS = [TimerVisual, BuildVisual, ChecklistVisual]

/* Each text block has its own composition (not identical cards). */
function Block({ i, block, desktop }) {
  const V = VISUALS[i]
  const [seen, setSeen] = useState(false)
  const head = (
    <>
      <span className="hud mb-4 flex items-center gap-3">
        <span className="font-display text-[15px] font-bold text-cyan">0{i + 1}</span>
        <span className="h-px w-10 bg-cyan/40" />
        {block.tag}
      </span>
    </>
  )
  return (
    <div className="flex min-h-0 flex-col justify-center py-14 lg:min-h-[78vh] lg:py-0">
      {!desktop && (
        <motion.div className="mb-10" onViewportEnter={() => setSeen(true)} viewport={{ amount: 0.5 }}>
          <V active={seen} />
        </motion.div>
      )}
      {i === 0 && (
        <Reveal>
          {head}
          <h3 className="font-display text-[34px] font-bold leading-[1.08] text-ink md:text-[46px]">{block.title}</h3>
          <p className="lead mt-5 max-w-[460px]">{block.text}</p>
        </Reveal>
      )}
      {i === 1 && (
        <Reveal className="relative pl-6 md:pl-10">
          <span aria-hidden className="absolute bottom-1 left-0 top-1 w-px bg-gradient-to-b from-cyan via-magenta/60 to-transparent" />
          {head}
          <h3 className="font-display text-[34px] font-bold leading-[1.08] text-ink md:text-[46px]">
            <span className="hl-soft">{block.title.split(',')[0]},</span>
            {block.title.split(',').slice(1).join(',')}
          </h3>
          <p className="lead mt-5 max-w-[460px]">{block.text}</p>
        </Reveal>
      )}
      {i === 2 && (
        <Reveal>
          {head}
          <h3 className="max-w-[520px] font-display text-[30px] font-bold leading-[1.12] text-ink md:text-[40px]">{block.title}</h3>
          <div className="glass mt-6 max-w-[480px] border border-line p-5">
            <p className="text-[16px] leading-relaxed text-ink-2 md:text-[17px]">{block.text}</p>
          </div>
        </Reveal>
      )}
    </div>
  )
}

export default function Solution() {
  const { t } = useLang()
  const s = t.solution
  const desktop = useIsDesktop()
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(2, Math.max(0, Math.floor(v * 3)))))
  const V = VISUALS[active]

  return (
    <section id="solution" className="relative pb-16 pt-10 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(50%_60%_at_30%_0%,rgba(0,240,255,0.07),transparent)]" />
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="max-w-[820px]">
          <SectionLabel>{s.label}</SectionLabel>
          <RevealHeading text={s.title} className="h2 text-ink" />
        </div>

        <div ref={ref} className="mt-6 grid grid-cols-1 lg:mt-0 lg:grid-cols-12 lg:gap-16">
          {desktop && (
            <div className="lg:col-span-6">
              <div className="sticky top-0 flex h-screen items-center">
                <div className="relative w-full">
                  <div className="mb-8 flex gap-2" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-[2px] flex-1 overflow-hidden bg-cyan/10">
                        <motion.span
                          className="block h-full bg-cyan"
                          animate={{ scaleX: i <= active ? 1 : 0 }}
                          style={{ originX: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      </span>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <V active />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
          <div className="lg:col-span-6">
            {s.blocks.map((b, i) => (
              <Block key={i} i={i} block={b} desktop={desktop} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
