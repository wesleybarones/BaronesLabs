import { motion } from 'motion/react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import { HEX_PATH, HEX_INNER } from '../components/Logo'
import Reveal from '../components/ui/Reveal'

export default function Guarantee() {
  const { t } = useLang()
  const g = t.guarantee
  return (
    <div className="relative flex h-full flex-col items-center justify-center border border-cyan/30 bg-surface/60 p-8 pb-12 text-center md:p-12 md:pb-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(0,240,255,0.08),transparent)]" />
      <div className="relative flex flex-col items-center">
        <Reveal once distance={14} className="hud mb-8">
          {g.label}
        </Reveal>
        <div className="relative h-[190px] w-[190px] md:h-[220px] md:w-[220px]">
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
            <span className="font-display text-[30px] font-bold leading-none text-ink md:text-[34px]">{g.seal}</span>
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">{g.sealSub}</span>
          </motion.div>
        </div>
        <Reveal once delay={0.2} className="mt-10">
          <h3 className="font-display text-[30px] font-bold leading-[1.08] text-ink md:text-[38px]">{g.title}</h3>
        </Reveal>
        <Reveal once delay={0.3} className="mt-6">
          <p className="mx-auto max-w-[460px] text-[17px] leading-[1.7] text-ink-2 md:text-[18px]">{g.text}</p>
        </Reveal>
      </div>
      {g.fine && (
        <p className="absolute bottom-3 right-4 font-mono text-[10px] lowercase tracking-[0.08em] text-ink-3 md:bottom-4 md:right-5 md:text-[11px]">
          {g.fine}
        </p>
      )}
    </div>
  )
}
