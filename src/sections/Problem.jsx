import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import { IconError } from '../components/Icons'

/** One pain point: brightens when centred in the viewport, fades before/after (scroll-linked, reversible). */
function Pain({ text, index, code }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.38, 0.5, 0.62, 1], [0.15, 0.4, 1, 0.4, 0.22])
  const x = useTransform(scrollYProgress, [0, 0.45, 1], reduce ? [0, 0, 0] : [40, 0, 0])
  const glow = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0])
  return (
    <motion.li ref={ref} style={{ opacity, x }} className="relative flex items-start gap-5 py-10 md:gap-7 md:py-14">
      <motion.span
        aria-hidden
        style={{ opacity: glow }}
        className="absolute -left-[10%] top-0 -z-10 h-full w-[70%] bg-[radial-gradient(closest-side,rgba(224,64,216,0.10),transparent)]"
      />
      <span className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
        <span className="chamfer chamfer-sm absolute inset-0 border border-magenta/50 bg-magenta/[0.06]" />
        <IconError className="relative h-6 w-6 text-magenta" />
      </span>
      <div>
        <span className="mb-2 block font-mono text-[11px] tracking-[0.2em] text-magenta/80">
          {code}_0{index + 1}
        </span>
        <p className="font-display text-[24px] font-semibold leading-[1.2] text-ink md:text-[32px]">{text}</p>
      </div>
    </motion.li>
  )
}

export default function Problem() {
  const { t } = useLang()
  const p = t.problem
  return (
    <section id="problem" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[22vh]">
            <SectionLabel>{p.label}</SectionLabel>
            <RevealHeading text={p.title} className="h2 text-ink" />
            <Reveal delay={0.2} className="lead mt-6 max-w-[420px]">
              {p.sub}
            </Reveal>
          </div>
        </div>
        <ol className="divide-y divide-line lg:col-span-7 lg:pt-[8vh]">
          {p.items.map((it, i) => (
            <Pain key={i} text={it} index={i} code={p.code} />
          ))}
        </ol>
      </div>
    </section>
  )
}
