import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { LogoHorizontal, LogoSymbol } from '../components/Logo'
import RevealHeading from '../components/ui/RevealHeading'
import Reveal from '../components/ui/Reveal'
import SectionLabel from '../components/ui/SectionLabel'

/** E-book cover, same design as the PDFs of the series (ebooks/src): original, brand-only artwork. */
function Book({ book }) {
  return (
    <div className="relative h-full w-full">
      {/* front cover */}
      <div
        className="absolute inset-0 overflow-hidden border border-cyan/30 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.95)]"
        style={{ background: 'radial-gradient(90% 55% at 90% 0%, rgba(0,240,255,0.16), transparent 65%), #07080D' }}
      >
        <div className="bg-grid-global absolute inset-0 [mask-image:none] opacity-80" />
        <div className="absolute -right-[22%] top-[20%] w-[95%] opacity-[0.16]">
          <LogoSymbol className="h-auto w-full" sizes="200px" />
        </div>
        <div className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/60 to-transparent" />
        <span aria-hidden className="absolute left-[6%] top-[4%] h-3 w-3 border-l border-t border-cyan" />
        <span aria-hidden className="absolute bottom-[4%] right-[6%] h-3 w-3 border-b border-r border-cyan" />
        <div className="relative flex h-full flex-col p-[11%]">
          <LogoHorizontal className="!h-5 self-start md:!h-6" loading="lazy" sizes="90px" />
          <div className="mt-auto">
            <span className="font-mono text-[8px] tracking-[0.25em] text-cyan md:text-[9px]">// GUIA · {book.vol}</span>
            <p className="mt-2 font-display text-[16px] font-bold leading-[1.04] text-ink [text-shadow:-1.5px_0_#E040D8] md:text-[18px]">{book.title}</p>
          </div>
          <span
            className={`mt-4 self-start px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] md:text-[8px] ${
              book.premium ? 'chamfer chamfer-sm bg-yellow text-bg' : 'border border-cyan/50 text-cyan'
            }`}
          >
            {book.premium ? '★ ' : ''}
            {book.short}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />
      </div>
    </div>
  )
}

/** Bonus card (used inside the combined Guarantee + Bonus section). */
export default function Bonus() {
  const { t } = useLang()
  const b = t.bonus
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scrollRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 8])
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 120, damping: 18 })
  const smy = useSpring(my, { stiffness: 120, damping: 18 })
  const rotY = useTransform([scrollRot, smx], ([s, m]) => s + m * 14)
  const rotX = useTransform(smy, (v) => v * -10)
  const floatY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])

  return (
    <div
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
      className="relative h-full"
    >
      <div className="h-full">
        <div className="relative flex h-full flex-col gap-10 overflow-hidden border border-line bg-surface/50 p-8 md:p-12">
          <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 h-[120%] w-[60%] -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,240,255,0.10),transparent_60%)]" />
          <div className="relative flex justify-center" style={{ perspective: 1200 }}>
            <motion.div
              className="relative h-[220px] w-[260px] md:h-[230px] md:w-[270px]"
              style={{ rotateY: rotY, rotateX: rotX, y: floatY }}
            >
              <div className="absolute left-0 top-6 aspect-[3/4] w-[128px] md:w-[140px]" style={{ transform: 'rotate(-5deg)' }}>
                <Book book={b.books[0]} />
              </div>
              <div className="absolute right-0 top-0 aspect-[3/4] w-[128px] md:w-[140px]" style={{ transform: 'rotate(4deg)' }}>
                <Book book={b.books[1]} />
              </div>
            </motion.div>
            <div aria-hidden className="absolute -bottom-6 left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-[50%] bg-cyan/20 blur-xl" />
          </div>
          <div className="relative">
            <SectionLabel>{b.label}</SectionLabel>
            <RevealHeading as="h3" text={b.title} className="font-display text-[30px] font-bold leading-[1.08] text-ink md:text-[38px]" />
            <Reveal delay={0.15} className="lead mt-5 max-w-[480px]">
              {b.text}
            </Reveal>
            <Reveal delay={0.25} className="mt-7">
              <ul className="space-y-3">
                {b.books.map((bk) => (
                  <li key={bk.vol} className="flex gap-4 border border-line bg-surface/60 p-4">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-cyan">{bk.vol}</span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-display text-[17px] font-semibold text-ink">{bk.title}</span>
                        <span
                          className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                            bk.premium ? 'chamfer chamfer-sm bg-yellow text-bg' : 'border border-cyan/40 text-cyan'
                          }`}
                        >
                          {bk.premium ? '★ ' : ''}
                          {bk.badge}
                        </span>
                      </span>
                      <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-2">{bk.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
