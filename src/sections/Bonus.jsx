import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { LogoSymbol } from '../components/Logo'
import RevealHeading from '../components/ui/RevealHeading'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'

/** Original e-book cover, rendered in CSS with brand language (no third-party imagery). */
function Book({ cover }) {
  return (
    <div className="relative h-full w-full [transform-style:preserve-3d]">
      {/* pages (thickness) */}
      <div
        className="absolute right-0 top-[1.5%] h-[97%] w-[28px] origin-right bg-[repeating-linear-gradient(90deg,#d9e4ea_0_1px,#f3f8fa_1px_3px)]"
        style={{ transform: 'rotateY(90deg) translateZ(0px) translateX(14px)' }}
      />
      {/* back */}
      <div className="absolute inset-0 bg-[#05060a]" style={{ transform: 'translateZ(-28px)' }} />
      {/* front cover */}
      <div className="absolute inset-0 overflow-hidden border border-cyan/30 bg-[linear-gradient(160deg,#0F1522,#07080D_65%)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="bg-grid-global absolute inset-0 [mask-image:none] opacity-80" />
        <div className="absolute -right-[30%] -top-[10%] h-[70%] w-[90%] opacity-20">
          <LogoSymbol className="h-full w-full" />
        </div>
        <div className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-[10%]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-cyan/80 md:text-[10px]">
            <span>{cover.kicker}</span>
            <span>{cover.vol}</span>
          </div>
          <div>
            <span className="mb-3 block h-px w-10 bg-cyan shadow-[0_0_8px_#00F0FF]" />
            <p className="font-display text-[26px] font-bold leading-[1.02] text-ink [text-shadow:-2px_0_#E040D8] md:text-[32px]">
              {cover.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LogoSymbol className="h-6 w-6" />
            <span className="font-display text-[11px] font-bold tracking-[0.18em] text-ink">BARONES LABS</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />
      </div>
    </div>
  )
}

export default function Bonus() {
  const { t } = useLang()
  const b = t.bonus
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scrollRot = useTransform(scrollYProgress, [0, 1], reduce ? [-18, -18] : [-38, 8])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 120, damping: 18 })
  const smy = useSpring(my, { stiffness: 120, damping: 18 })
  const rotY = useTransform([scrollRot, smx], ([s, m]) => s + m * 14)
  const rotX = useTransform(smy, (v) => v * -10)
  const floatY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (!fine || reduce) return
        const r = ref.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      className="relative py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="relative grid grid-cols-1 items-center gap-12 overflow-hidden border border-line bg-surface/50 p-8 md:grid-cols-12 md:p-14">
          <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 h-[120%] w-[60%] -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,240,255,0.10),transparent_60%)]" />
          <div className="relative flex justify-center md:col-span-5" style={{ perspective: 1200 }}>
            <motion.div
              className="aspect-[3/4] w-[200px] md:w-[250px]"
              style={{ rotateY: rotY, rotateX: rotX, y: floatY, transformStyle: 'preserve-3d' }}
            >
              <Book cover={b.cover} />
            </motion.div>
            <div aria-hidden className="absolute -bottom-6 left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-[50%] bg-cyan/20 blur-xl" />
          </div>
          <div className="relative md:col-span-7">
            <SectionLabel>{b.label}</SectionLabel>
            <RevealHeading text={b.title} className="font-display text-[32px] font-bold leading-[1.08] text-ink md:text-[44px]" />
            <Reveal delay={0.15} className="lead mt-5 max-w-[480px]">
              {b.text}
            </Reveal>
            <Reveal delay={0.25} className="mt-7">
              <span className="inline-flex items-center gap-3 border border-cyan/40 bg-cyan/[0.06] px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.18em] text-cyan">
                <span className="h-1.5 w-1.5 bg-cyan shadow-[0_0_8px_#00F0FF]" />
                {b.badge}
              </span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
