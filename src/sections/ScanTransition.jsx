import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'

/**
 * Problem → Solution: a horizontal scan line sweeps down and "fixes" the visuals,
 * turning the error mood (magenta noise) into system-OK (clean cyan grid). Scroll-linked and reversible.
 */
export default function ScanTransition() {
  const { t } = useLang()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 25%'] })
  const top = useTransform(scrollYProgress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`)
  const clipFixed = useTransform(scrollYProgress, (v) => `inset(0 0 ${100 - Math.min(100, Math.max(0, v * 100))}% 0)`)
  const [ok, setOk] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setOk(v > 0.55))

  return (
    <div ref={ref} aria-hidden className="relative h-[42vh] overflow-hidden md:h-[52vh]">
      {/* error layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(224,64,216,0.07) 0 2px, transparent 2px 9px), linear-gradient(90deg, rgba(224,64,216,0.05) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 48px 48px',
          }}
        />
        <div className="absolute left-[12%] top-[30%] h-6 w-40 bg-magenta/15 blur-[1px]" />
        <div className="absolute right-[18%] top-[55%] h-3 w-64 bg-magenta/20" />
        <div className="absolute left-[40%] top-[72%] h-2 w-24 bg-magenta/25" />
      </div>
      {/* fixed layer revealed behind the scan line */}
      <motion.div className="absolute inset-0 bg-bg" style={{ clipPath: clipFixed }}>
        <div className="bg-grid-global absolute inset-0 opacity-100" style={{ maskImage: 'none' }} />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_100%,rgba(0,240,255,0.08),transparent)]" />
      </motion.div>
      {/* scan line */}
      <motion.div className="absolute inset-x-0 z-10" style={{ top }}>
        <div className="h-px bg-cyan shadow-[0_0_24px_4px_rgba(0,240,255,0.6)]" />
        <div className="h-16 -translate-y-full bg-gradient-to-t from-cyan/15 to-transparent" />
      </motion.div>
      {/* status */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.span
          key={ok ? 'ok' : 'fix'}
          initial={{ opacity: 0, skewX: -12, x: -6 }}
          animate={{ opacity: 1, skewX: 0, x: 0 }}
          transition={{ duration: 0.25 }}
          className={`glass flex items-center gap-3 border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.24em] ${
            ok ? 'border-cyan/40 text-cyan' : 'border-magenta/40 text-magenta'
          }`}
        >
          <span className={`h-1.5 w-1.5 ${ok ? 'rounded-full bg-yellow shadow-[0_0_8px_#FFE600]' : 'bg-magenta'}`} />
          {ok ? t.scan.ok : `${t.scan.fixing}…`}
        </motion.span>
      </div>
    </div>
  )
}
