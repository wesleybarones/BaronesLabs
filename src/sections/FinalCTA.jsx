import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'
import { waLink } from '../config'
import { LogoSymbol } from '../components/Logo'
import RevealHeading from '../components/ui/RevealHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { IconWhatsApp } from '../components/Icons'

export default function FinalCTA() {
  const { t } = useLang()
  const f = t.final
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [hot, setHot] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [0.85, 1])

  return (
    <section id="final" ref={ref} className="relative -mt-16 flex min-h-[100svh] items-center justify-center overflow-x-clip pb-24 pt-12 md:-mt-24">
      {/* decor fades out on every side (no hard edge): the FAQ and this section read as one */}
      <motion.div aria-hidden className="final-fade pointer-events-none absolute inset-x-0 -top-[30vh] bottom-0 flex items-center justify-center" style={{ scale }}>
        <motion.div
          className="h-[130vmin] w-[130vmin] md:h-[110vmin] md:w-[110vmin]"
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="h-full w-full"
            animate={{
              opacity: hot ? 0.26 : [0.08, 0.14, 0.08],
              filter: hot ? 'drop-shadow(0 0 40px rgba(0,240,255,0.9))' : 'drop-shadow(0 0 16px rgba(0,240,255,0.45))',
            }}
            transition={hot ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LogoSymbol className="h-full w-full" sizes="110vmin" />
          </motion.div>
        </motion.div>
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[30vh] bottom-0 bg-[radial-gradient(50%_45%_at_50%_58%,rgba(0,240,255,0.08),transparent_70%)]" />


      <div className="relative mx-auto flex max-w-[980px] flex-col items-center px-4 text-center md:px-8">
        <Reveal distance={14} className="hud mb-8 flex items-center gap-3">
          <span className="live-dot" aria-hidden /> {t.hero.status}
        </Reveal>
        <RevealHeading text={f.title} className="h1 text-ink" glitch />
        <Reveal delay={0.2} className="lead mt-7 max-w-[520px] text-[18px] md:text-[20px]">
          {f.sub}
        </Reveal>
        <Reveal delay={0.3} className="mt-12 w-full sm:w-auto">
          <Button
            href={waLink(t.wa.default)}
            size="xl"
            magnetic
            className="w-full sm:w-auto"
            icon={<IconWhatsApp className="h-6 w-6" />}
            onHoverChange={setHot}
          >
            {f.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
