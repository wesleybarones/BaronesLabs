import { useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'

/**
  Infinite ticker: speeds up with scroll velocity, reverses when scrolling up.
  The drift itself is a CSS animation (runs on the compositor, zero main-thread work per frame);
  scrolling only changes its playbackRate (speed and direction).
*/
export default function Marquee() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1500], [0, 4], { clamp: false })
  const dirRef = useRef(1)
  const trackRef = useRef(null)

  useMotionValueEvent(factor, 'change', (f) => {
    const anim = trackRef.current?.getAnimations?.()[0]
    if (!anim) return
    if (f < 0) dirRef.current = -1
    else if (f > 0) dirRef.current = 1
    anim.playbackRate = dirRef.current * (1 + Math.min(Math.abs(f), 4))
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
        <div
          ref={trackRef}
          className={`flex w-max whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.22em] text-ink/85 md:text-[15px] ${reduce ? '' : 'marquee-track'}`}
        >
          {row('a')}
          {row('b')}
          {row('c')}
          {row('d')}
        </div>
      </div>
    </section>
  )
}
