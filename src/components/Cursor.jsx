import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { useLang } from '../i18n/LangContext'

/** Desktop-only cursor: yellow dot + lagging cyan ring that grows on interactive elements. */
export default function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const on = fine && !reduce
  const { lang } = useLang()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 160, damping: 20, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 160, damping: 20, mass: 0.5 })
  const [mode, setMode] = useState('default') // default | hover | view
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!on) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
      const t = e.target.closest?.('[data-cursor], a, button, [role="button"], summary, input, textarea')
      const m = t ? (t.getAttribute('data-cursor') === 'view' ? 'view' : 'hover') : 'default'
      setMode((prev) => (prev === m ? prev : m))
    }
    const out = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', out)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', out)
    }
  }, [on]) // eslint-disable-line

  if (!on) return null
  const size = mode === 'view' ? 76 : mode === 'hover' ? 46 : 28
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/80"
          animate={{
            width: size,
            height: size,
            backgroundColor: mode === 'view' ? 'rgba(0,240,255,0.14)' : 'rgba(0,240,255,0)',
            boxShadow: mode === 'default' ? '0 0 0 rgba(0,240,255,0)' : '0 0 18px rgba(0,240,255,0.45)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <AnimatePresence>
            {mode === 'view' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[11px] tracking-[0.2em] text-cyan"
              >
                {lang === 'en' ? 'VIEW' : 'VER'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <span className="block h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow shadow-[0_0_8px_#FFE600]" />
      </motion.div>
    </div>
  )
}
