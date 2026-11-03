import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** Infinite ticker: speeds up with scroll velocity, reverses when scrolling up. */
export default function Marquee() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1500], [0, 4], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dirRef = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dirRef.current * -2.2 * (delta / 1000)
    const f = factor.get()
    if (f < 0) dirRef.current = -1
    else if (f > 0) dirRef.current = 1
    move += dirRef.current * -2.2 * (delta / 1000) * Math.min(Math.abs(f), 4)
    base.set(base.get() + move)
  })

  const row = (k) => (
    <span key={k} className="flex shrink-0 items-center">
      {t.marquee.map((w) => (
        <span key={w + k} className="flex items-center">
          <span className="px-6 md:px-8">{w}</span>
          <span aria-hidden className="text-[0.7em] text-cyan [text-shadow:-1.5px_0_#E040D8]">
            ◆
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <section aria-label={t.marquee.join(', ')} className="relative border-y border-cyan/25 bg-surface/40 py-4 backdrop-blur-sm md:py-5">
      <span aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-70" />
      <span aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-40" />
      <div aria-hidden className="edge-fade overflow-hidden">
        <motion.div
          className="flex w-max whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.22em] text-ink/85 md:text-[15px]"
          style={{ x: reduce ? 0 : x }}
        >
          {row('a')}
          {row('b')}
          {row('c')}
          {row('d')}
        </motion.div>
      </div>
    </section>
  )
}
