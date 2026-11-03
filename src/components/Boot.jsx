import { motion } from 'motion/react'
import { useEffect } from 'react'
import { HEX_PATH, HEX_INNER, LB_PATH, DOT } from './Logo'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'

/**
 * Boot sequence (≤1.6s): hex draws in neon (900ms) → LB flickers on → yellow dot blinks twice
 * → screen opens with a horizontal cut revealing the hero.
 */
export default function Boot({ onDone }) {
  const { t } = useLang()
  useEffect(() => {
    const id = setTimeout(onDone, 1600)
    const key = (e) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', key)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', key)
    }
  }, [onDone])

  const half = {
    initial: { y: 0 },
    transition: { duration: 0.32, ease: [0.7, 0, 0.3, 1], delay: 1.28 },
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200]"
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      aria-live="polite"
      aria-label={t.boot.loading}
    >
      {/* two halves that split apart */}
      <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-bg" {...half} animate={{ y: '-100%' }} />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-bg" {...half} animate={{ y: '100%' }} />
      {/* cut line */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px bg-cyan shadow-[0_0_20px_#00F0FF]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 1.1, ease: EASE }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={{ opacity: [1, 1, 0], scale: [1, 1, 1.08] }}
        transition={{ duration: 1.4, times: [0, 0.85, 1] }}
      >
        <svg viewBox="0 0 100 100" className="h-28 w-28 md:h-36 md:w-36" aria-hidden>
          <g fill="none" strokeLinejoin="round" strokeLinecap="round">
            <motion.path
              d={HEX_PATH}
              stroke="#E040D8"
              strokeWidth="3"
              transform="translate(-2.5 1)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.75 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            />
            <motion.path
              d={HEX_PATH}
              stroke="#00F0FF"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 6px #00F0FF)' }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <motion.path
              d={HEX_INNER}
              stroke="#00F0FF"
              strokeWidth="1.2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            />
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.2, 1, 0.5, 1] }}
              transition={{ duration: 0.32, delay: 0.72 }}
            >
              <path d={LB_PATH} stroke="#E040D8" strokeWidth="4.5" transform="translate(-2.5 1)" opacity="0.75" />
              <path d={LB_PATH} stroke="#00F0FF" strokeWidth="4.5" style={{ filter: 'drop-shadow(0 0 5px #00F0FF)' }} />
            </motion.g>
          </g>
          <motion.circle
            cx={DOT.cx}
            cy={DOT.cy}
            r="3.8"
            fill="#FFE600"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
            transition={{ duration: 0.36, delay: 0.98 }}
            style={{ filter: 'drop-shadow(0 0 6px #FFE600)' }}
          />
        </svg>
        <motion.span
          className="hud mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {t.boot.loading}
          <span className="text-yellow">_</span>
        </motion.span>
      </motion.div>

      <button
        type="button"
        onClick={onDone}
        className="hud absolute bottom-6 right-6 z-10 px-3 py-2 text-ink-3 transition-colors hover:text-cyan"
      >
        {t.boot.skip} →
      </button>
    </motion.div>
  )
}
