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
    <section id="final" ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-x-clip pb-24 pt-28 md:pt-36">
      {/* soft divider: a breath between FAQ and this call, fading at both ends (no hard edge) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 flex w-[min(80%,720px)] -translate-x-1/2 items-center justify-center">
        <span className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,240,255,0.35)_35%,rgba(0,240,255,0.35)_65%,transparent)]" />
        <span className="absolute h-1.5 w-1.5 rotate-45 bg-cyan shadow-[0_0_10px_#00F0FF,0_0_24px_rgba(0,240,255,0.5)]" />
      </div>
      {/* decor fades out on every side and bleeds a little upward, keeping the sense of continuity */}
      <motion.div aria-hidden className="final-fade pointer-events-none absolute inset-x-0 -top-[14vh] bottom-0 flex items-center justify-center" style={{ scale }}>
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
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[14vh] bottom-0 bg-[radial-gradient(50%_45%_at_50%_58%,rgba(0,240,255,0.08),transparent_70%)]" />


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
