import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'
import { LogoSymbol } from './Logo'

/*
  "Barones Signature" seal for the footer: a holographic hexagon (same shape as the logo and the guarantee seal).
  - neon border (magenta → white → cyan) spinning around the hexagon, light sweep every few seconds;
  - pointer: 3D tilt on a spring + a holographic reflection that follows it;
  - first click flips it like a coin: "Este site é um projeto Signature · Ver o pacote";
    clicking the back takes you to the Signature package. It flips back on its own when the pointer leaves.
*/
export default function SignatureSeal({ onOpen, className = '' }) {
  const { t } = useLang()
  const s = t.footer.seal
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const back = useRef(0)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 170, damping: 16, mass: 0.6 }
  const rotateX = useSpring(useTransform(my, (v) => v * -20), spring)
  const rotateY = useSpring(useTransform(mx, (v) => v * 24), spring)
  const hx = useTransform(mx, (v) => `${(v + 0.5) * 100}%`)
  const hy = useTransform(my, (v) => `${(v + 0.5) * 100}%`)
  const sheen = useMotionTemplate`radial-gradient(150px circle at ${hx} ${hy}, rgba(0,240,255,0.28), transparent 60%), linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.07) 45%, rgba(224,64,216,0.1) 55%, transparent 75%)`
  const turn = useSpring(0, { stiffness: 120, damping: 13 })

  const flipTo = (v) => {
    setFlipped(v)
    turn.set(v ? 180 : 0)
  }
  const onMove = (e) => {
    if (reduce) return
    clearTimeout(back.current)
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    if (flipped) back.current = setTimeout(() => flipTo(false), 1400)
  }
  const onClick = () => {
    clearTimeout(back.current)
    if (!flipped) return flipTo(true)
    flipTo(false)
    onOpen?.()
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={flipped ? s.ariaBack : s.ariaFront}
      className={`group relative block h-[208px] w-[184px] shrink-0 [perspective:900px] focus-visible:outline-none ${className}`}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
    >
      <motion.span
        className="sig-tilt absolute inset-0 block [filter:drop-shadow(0_0_24px_rgba(0,240,255,0.16))_drop-shadow(0_0_18px_rgba(224,64,216,0.12))]"
        style={{ rotateX, rotateY }}
      >
        <motion.span className="sig-flip absolute inset-0 block" style={{ rotateY: turn }}>
          {/* front */}
          <span className="sig-face sig-hex absolute inset-0 block">
            <span aria-hidden className="sig-edge sig-hex absolute inset-0 block" />
            <span className="sig-inner sig-hex absolute inset-[2px] flex flex-col items-center justify-center text-center">
              <span aria-hidden className="sig-hex absolute inset-[13px] border border-dashed border-cyan/30" />
              <LogoSymbol className="relative mb-2 w-9" shine={false} sizes="40px" />
              <span className="signature-title relative font-display text-[24px] font-bold leading-none tracking-[0.02em]">BARONES</span>
              <span className="relative mt-1.5 pl-[0.42em] font-mono text-[10px] tracking-[0.42em] text-ink">SIGNATURE</span>
              <span className="relative mt-3 font-mono text-[7.5px] leading-[1.7] tracking-[0.18em] text-magenta">
                {s.edition}
                <br />
                Nº 001
              </span>
              {!reduce && <span aria-hidden className="sig-sweep absolute inset-0" />}
            </span>
          </span>
          {/* back */}
          <span className="sig-face sig-back sig-hex absolute inset-0 block">
            <span aria-hidden className="sig-edge sig-hex absolute inset-0 block" />
            <span className="sig-inner sig-hex absolute inset-[2px] flex flex-col items-center justify-center gap-2 px-7 text-center">
              <span aria-hidden className="sig-hex absolute inset-[13px] border border-dashed border-cyan/30" />
              <span className="signature-title relative font-display text-[15px] font-bold leading-tight">{s.back}</span>
              <span className="relative font-mono text-[9.5px] tracking-[0.14em] text-cyan">{s.cta}</span>
            </span>
          </span>
        </motion.span>
        {!reduce && (
          <motion.span
            aria-hidden
            className="sig-hex pointer-events-none absolute inset-0 block opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: sheen }}
          />
        )}
      </motion.span>
    </motion.button>
  )
}
