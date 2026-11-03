import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'

export default function Process() {
  const { t } = useLang()
  const steps = t.process.steps
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  const [lit, setLit] = useState(-1)
  useMotionValueEvent(draw, 'change', (v) => {
    const n = steps.length
    let c = -1
    for (let i = 0; i < n; i++) if (v >= (i + 0.15) / n) c = i
    setLit(c)
  })

  return (
    <section id="process" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_50%,rgba(0,240,255,0.05),transparent)]" />
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="mb-16 text-left md:mb-24 md:text-center">
          <SectionLabel className="md:justify-center">{t.process.label}</SectionLabel>
          <RevealHeading text={t.process.title} className="h2 mx-auto max-w-[18ch] text-ink" />
        </div>

        <div ref={ref} className="relative">
          {/* the line: drawn by scroll, erased when scrolling back up */}
          <svg
            aria-hidden
            className="absolute bottom-0 left-[23px] top-0 h-full w-[2px] overflow-visible md:left-1/2 md:-translate-x-1/2"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
          >
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(0,240,255,0.12)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              stroke="#00F0FF"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw, filter: 'drop-shadow(0 0 6px #00F0FF)' }}
            />
          </svg>

          <ol className="relative">
            {steps.map((s, i) => {
              const on = i <= lit
              const right = i % 2 === 1
              return (
                <li key={i} className="relative grid grid-cols-[48px_1fr] gap-5 pb-16 last:pb-0 md:grid-cols-[1fr_96px_1fr] md:gap-0 md:pb-28">
                  {/* node */}
                  <div className="relative flex justify-center md:col-start-2 md:row-start-1">
                    <motion.span
                      className="relative z-10 flex h-12 w-12 items-center justify-center"
                      animate={{ scale: on ? 1 : 0.85 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <span
                        className="absolute inset-0 border transition-all duration-500"
                        style={{
                          clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                          background: on ? '#00F0FF' : '#0D1018',
                          borderColor: 'transparent',
                          boxShadow: on ? '0 0 30px rgba(0,240,255,0.7)' : 'none',
                        }}
                      />
                      <span
                        className="absolute inset-[1.5px] transition-colors duration-500"
                        style={{
                          clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)',
                          background: on ? '#00F0FF' : '#0D1018',
                          outline: 'none',
                        }}
                      />
                      <span className={`relative font-display text-[15px] font-bold transition-colors duration-500 ${on ? 'text-bg' : 'text-cyan/60'}`}>
                        0{i + 1}
                      </span>
                    </motion.span>
                    {on && (
                      <motion.span
                        aria-hidden
                        className="absolute left-1/2 top-6 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan"
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.9, ease: EASE }}
                      />
                    )}
                  </div>
                  {/* content */}
                  <motion.div
                    className={`md:row-start-1 ${right ? 'md:col-start-3 md:pl-10' : 'md:col-start-1 md:pr-10 md:text-right'}`}
                    animate={{ opacity: on ? 1 : 0.35, x: on ? 0 : right ? 16 : -16 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <span className="hud text-[11px]">STEP_0{i + 1}</span>
                    <h3 className="mt-2 font-display text-[26px] font-semibold leading-tight text-ink md:text-[32px]">{s.title}</h3>
                    <p className={`mt-3 max-w-[400px] text-[16px] leading-relaxed text-ink-2 md:text-[17px] ${right ? '' : 'md:ml-auto'}`}>{s.text}</p>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
