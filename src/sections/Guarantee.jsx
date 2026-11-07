import { motion, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import { HEX_PATH, HEX_INNER } from '../components/Logo'
import Reveal from '../components/ui/Reveal'
import { useReducedMotion } from '../lib/hooks'

export default function Guarantee() {
  const { t } = useLang()
  const g = t.guarantee
  const reduce = useReducedMotion()

  // press and twist: the hexagon follows the pointer's angle around its centre, then keeps spinning
  // with inertia when released
  const sealRef = useRef(null)
  const rot = useMotionValue(0)
  const drag = useRef(null)
  const vel = useRef(0)
  const raf = useRef(0)
  const angle = (e) => {
    const r = sealRef.current.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }
  const onDown = (e) => {
    cancelAnimationFrame(raf.current)
    sealRef.current.setPointerCapture?.(e.pointerId)
    drag.current = { a: angle(e), t: performance.now() }
    vel.current = 0
  }
  const onMove = (e) => {
    if (!drag.current) return
    const a = angle(e)
    let d = a - drag.current.a
    if (d > 180) d -= 360
    if (d < -180) d += 360
    const now = performance.now()
    vel.current = (d / Math.max(8, now - drag.current.t)) * 1000 // deg/s
    rot.set(rot.get() + d)
    drag.current = { a, t: now }
  }
  const onUp = () => {
    if (!drag.current) return
    drag.current = null
    if (reduce) return
    let v = Math.max(-1800, Math.min(1800, vel.current))
    let last = performance.now()
    const spin = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      v *= Math.pow(0.12, dt) // friction
      rot.set(rot.get() + v * dt)
      if (Math.abs(v) > 4) raf.current = requestAnimationFrame(spin)
    }
    raf.current = requestAnimationFrame(spin)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div className="relative flex h-full flex-col items-center justify-center border border-cyan/30 bg-surface/60 p-8 pb-12 text-center md:p-12 md:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(0,240,255,0.08),transparent)]" />
      <div className="relative flex flex-col items-center">
        <Reveal once distance={14} className="hud mb-8">
          {g.label}
        </Reveal>
        <div
          ref={sealRef}
          className="relative h-[190px] w-[190px] touch-none select-none md:h-[220px] md:w-[220px]"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-cursor
          title={g.spin}
        >
          <motion.div
            aria-hidden
            className="absolute inset-[15%] rounded-full bg-cyan/15 blur-3xl"
            animate={reduce ? {} : { opacity: [0.6, 1, 0.6], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden style={{ rotate: rot }}>
            <motion.path
              d={HEX_PATH}
              fill="none"
              stroke="#E040D8"
              strokeWidth="1.4"
              transform="translate(-1.6 0.8)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <motion.path
              d={HEX_PATH}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="1.4"
              style={{ filter: 'drop-shadow(0 0 4px #00F0FF)' }}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <motion.path
              d={HEX_INNER}
              fill="rgba(0,240,255,0.04)"
              stroke="#00F0FF"
              strokeWidth="0.5"
              strokeDasharray="1.5 1.5"
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              whileInView={reduce ? { opacity: 0.7, scale: 1 } : { opacity: 0.7, scale: 1, rotate: 360 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                opacity: { duration: 0.8, ease: EASE, delay: 0.7 },
                scale: { duration: 0.8, ease: EASE, delay: 0.7 },
                rotate: { duration: 30, ease: 'linear', repeat: Infinity },
              }}
              style={{ transformOrigin: '50px 50px' }}
            />
            {/* light running around the seal, after it is drawn */}
            {!reduce && (
              <>
                <motion.path
                  d={HEX_PATH}
                  fill="none"
                  stroke="#E9FFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 3px #00F0FF) drop-shadow(0 0 7px #00F0FF)' }}
                  initial={{ pathLength: 0.14, pathOffset: 0, opacity: 0 }}
                  whileInView={{ pathOffset: [0, 1], opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ pathOffset: { duration: 3.4, ease: 'linear', repeat: Infinity, delay: 1.5 }, opacity: { duration: 0.4, delay: 1.5 } }}
                />
                <motion.path
                  d={HEX_PATH}
                  fill="none"
                  stroke="#E040D8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  transform="translate(-1.6 0.8)"
                  initial={{ pathLength: 0.08, pathOffset: 0.5, opacity: 0 }}
                  whileInView={{ pathOffset: [0.5, 1.5], opacity: 0.8 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ pathOffset: { duration: 5.2, ease: 'linear', repeat: Infinity, delay: 1.5 }, opacity: { duration: 0.4, delay: 1.5 } }}
                />
              </>
            )}
          </motion.svg>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          >
            <motion.span
              className="font-display text-[30px] font-bold leading-none text-ink md:text-[34px]"
              animate={reduce ? {} : { textShadow: ['0 0 0px rgba(0,240,255,0)', '0 0 16px rgba(0,240,255,0.7)', '0 0 0px rgba(0,240,255,0)'] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              {g.seal}
            </motion.span>
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">{g.sealSub}</span>
          </motion.div>
        </div>
        <Reveal once delay={0.2} className="mt-10">
          <h3 className="font-display text-[30px] font-bold leading-[1.08] text-ink md:text-[38px]">{g.title}</h3>
        </Reveal>
        <Reveal once delay={0.3} className="mt-6">
          <p className="mx-auto max-w-[460px] text-[17px] leading-[1.7] text-ink-2 md:text-[18px]">{g.text}</p>
        </Reveal>
      </div>
      {g.fine && (
        <p className="absolute bottom-3 right-4 font-mono text-[10px] lowercase tracking-[0.08em] text-ink-3 md:bottom-4 md:right-5 md:text-[11px]">
          {g.fine}
        </p>
      )}
    </div>
  )
}
