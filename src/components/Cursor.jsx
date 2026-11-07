import { AnimatePresence, motion, useMotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { useLang } from '../i18n/LangContext'

/*
  Desktop-only cursor: a HUD hexagon reticle in the brand style. It sits exactly on the pointer
  (no trailing/lag); only its size and state animate.
  - default: small cyan hexagon with a magenta offset (like the logo), slowly spinning, precise centre dot;
  - hover on links/buttons: grows and shows four "target lock" corners;
  - data-cursor="view": large, with a VIEW label;
  - click: the hexagon compresses and emits a hexagonal ripple.
*/

const HEX = 'M50 4 L90 27 L90 73 L50 96 L10 73 L10 27 Z'

function Hex({ className = '', stroke, width = 4, style }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="none" aria-hidden>
      <path d={HEX} stroke={stroke} strokeWidth={width} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const on = fine && !reduce
  const { lang } = useLang()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const [mode, setMode] = useState('default') // default | hover | view
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ripples, setRipples] = useState([])
  const rippleId = useRef(0)

  useEffect(() => {
    if (!on) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target.closest?.('[data-cursor], a, button, [role="button"], summary, input, textarea, label')
      const attr = t?.getAttribute('data-cursor')
      const m = !t ? 'default' : attr === 'view' ? 'view' : 'hover'
      setMode((prev) => (prev === m ? prev : m))
    }
    const down = (e) => {
      setPressed(true)
      const id = ++rippleId.current
      setRipples((r) => [...r.slice(-3), { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples((r) => r.filter((k) => k.id !== id)), 700)
    }
    const up = () => setPressed(false)
    const out = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.addEventListener('pointerleave', out)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', out)
    }
  }, [on]) // eslint-disable-line

  if (!on) return null
  const size = { default: 30, hover: 50, view: 84 }[mode]
  const lock = mode === 'hover' || mode === 'view'
  const label = lang === 'en' ? 'VIEW' : 'VER'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0, transition: 'opacity .25s' }}>
      {/* click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="absolute left-0 top-0"
            style={{ x: r.x, y: r.y }}
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Hex className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_6px_#00F0FF]" stroke="#00F0FF" width={1.4} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* reticle: exactly on the pointer, no lag */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          animate={{ width: size, height: size, scale: pressed ? 0.78 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          {/* hexagon (+ magenta offset); spins slowly, settles on targets */}
          <div className={`absolute inset-0 ${lock ? '' : 'cursor-spin'}`}>
            <Hex className="absolute inset-0 h-full w-full -translate-x-[1.5px] translate-y-[1px] opacity-70" stroke="#E040D8" width={1.3} />
            <Hex
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]"
              stroke="#00F0FF"
              width={1.5}
              style={{ fill: mode === 'view' ? 'rgba(0,240,255,0.12)' : 'transparent' }}
            />
          </div>
          {/* target-lock corners */}
          <AnimatePresence>
            {lock && (
              <motion.div
                className="absolute -inset-[7px]"
                initial={{ opacity: 0, scale: 1.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.25 }}
              >
                {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
                  <span key={c} className={`absolute h-2 w-2 border-cyan ${c}`} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {mode === 'view' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="relative font-mono text-[11px] tracking-[0.2em] text-cyan"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* precise centre dot */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <span className="block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EFFFFF] shadow-[0_0_6px_#00F0FF,0_0_12px_rgba(0,240,255,0.6)]" />
      </motion.div>
    </div>
  )
}
