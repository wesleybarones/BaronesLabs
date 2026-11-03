import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { waLink } from '../config'
import { IconWhatsApp } from './Icons'

const HEX = 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'

export default function WhatsAppFloat() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [atFinal, setAtFinal] = useState(false)
  const [tip, setTip] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setPast(v > window.innerHeight * 0.75))

  useEffect(() => {
    const el = document.getElementById('final')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setAtFinal(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const show = past && !atFinal
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-5 right-5 z-[65] md:bottom-8 md:right-8"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          <AnimatePresence>
            {tip && (
              <motion.span
                role="tooltip"
                id="wa-tip"
                className="glass hud absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap border border-line px-3 py-2 text-cyan"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {t.float.tooltip}
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href={waLink(t.wa.default)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.a11y.whatsapp}
            aria-describedby={tip ? 'wa-tip' : undefined}
            onPointerEnter={() => setTip(true)}
            onPointerLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
            data-cursor
            className="wa-pulse group relative isolate flex h-[60px] w-[54px] items-center justify-center [filter:drop-shadow(0_0_14px_rgba(0,240,255,0.5))] transition-[filter] hover:[filter:drop-shadow(0_0_24px_rgba(0,240,255,0.8))] md:h-[68px] md:w-[60px]"
          >
            <span className="absolute inset-0 translate-x-[-2px] translate-y-[1px] bg-magenta/80" style={{ clipPath: HEX }} />
            <span className="absolute inset-0 bg-cyan transition-colors group-hover:bg-cyan-hi" style={{ clipPath: HEX }} />
            <IconWhatsApp className="relative h-7 w-7 text-bg" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
