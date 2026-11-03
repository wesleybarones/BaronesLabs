import { motion } from 'motion/react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import { HEX_PATH, HEX_INNER } from '../components/Logo'
import Reveal from '../components/ui/Reveal'

export default function Guarantee() {
  const { t } = useLang()
  const g = t.guarantee
  return (
    <section id="guarantee" className="relative py-24 md:py-36">
      <div className="mx-auto flex max-w-[760px] flex-col items-center px-4 text-center md:px-8">
        <Reveal once distance={14} className="hud mb-10">
          {g.label}
        </Reveal>
        <div className="relative h-[220px] w-[220px] md:h-[260px] md:w-[260px]">
          <div aria-hidden className="absolute inset-[15%] rounded-full bg-cyan/15 blur-3xl" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 0.7, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
              style={{ transformOrigin: '50px 50px' }}
            />
          </svg>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          >
            <span className="font-display text-[34px] font-bold leading-none text-ink md:text-[40px]">{g.seal}</span>
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">{g.sealSub}</span>
          </motion.div>
        </div>
        <Reveal once delay={0.2} className="mt-12">
          <h2 className="h2 text-ink">{g.title}</h2>
        </Reveal>
        <Reveal once delay={0.3} className="mt-6">
          <p className="mx-auto max-w-[560px] text-[18px] leading-[1.7] text-ink-2 md:text-[20px]">{g.text}</p>
        </Reveal>
      </div>
    </section>
  )
}
