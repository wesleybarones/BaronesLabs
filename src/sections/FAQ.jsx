import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import { IconPlus } from '../components/Icons'

function Item({ q, a, open, onToggle, idx }) {
  const uid = useId()
  return (
    <div className={`border transition-colors duration-300 ${open ? 'border-cyan/50 bg-surface shadow-[0_0_24px_rgba(0,240,255,0.08)]' : 'border-line bg-surface/40 hover:border-cyan/25'}`}>
      <h3>
        <button
          type="button"
          id={`${uid}-q`}
          aria-expanded={open}
          aria-controls={`${uid}-a`}
          onClick={onToggle}
          className="focus-ring-inset flex min-h-[64px] w-full items-center gap-5 px-5 py-5 text-left md:px-7"
        >
          <span className="font-mono text-[11px] tracking-[0.18em] text-cyan/60">{String(idx + 1).padStart(2, '0')}</span>
          <span className="flex-1 font-display text-[18px] font-semibold leading-snug text-ink md:text-[20px]">{q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={`flex h-9 w-9 shrink-0 items-center justify-center border ${open ? 'border-cyan text-cyan' : 'border-line text-ink-2'}`}
          >
            <IconPlus className="h-5 w-5" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${uid}-a`}
            role="region"
            aria-labelledby={`${uid}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-6 pl-[3.6rem] pr-6 text-[16.5px] leading-[1.7] text-ink md:px-7 md:pb-7 md:pl-[4.6rem] md:text-[17px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { t } = useLang()
  const f = t.faq
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="relative z-10 pb-16 pt-24 md:pb-20 md:pt-36">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel once>{f.label}</SectionLabel>
            <RevealHeading text={f.title} className="h2 text-ink" once />
          </div>
        </div>
        <Reveal once className="flex flex-col gap-3 lg:col-span-8">
          {f.items.map((it, i) => (
            <Item key={i} idx={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
