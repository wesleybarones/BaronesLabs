import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { useLang } from '../i18n/LangContext'
import { waLink } from '../config'
import { EASE } from '../lib/motion'
import Counter from '../components/ui/Counter'
import Button from '../components/ui/Button'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import HudCorners from '../components/ui/HudCorners'
import { IconArrow, IconCheck } from '../components/Icons'

const brl = (n) => Math.round(n).toLocaleString('pt-BR')

function PlanCard({ plan, i, showPrices }) {
  const { t } = useLang()
  const p = t.pricing
  const featured = !!plan.featured
  const order = featured ? 'order-first md:order-none' : ''

  // 3D holographic card: tilts towards the cursor, a light sheen follows it
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const tilt = fine && !reduce
  const cardRef = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const max = featured ? 7 : 9
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 150, damping: 18 })
  const onMove = (e) => {
    if (!tilt) return
    const r = cardRef.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    px.set(nx)
    py.set(ny)
    cardRef.current.style.setProperty('--hx', `${nx * 100}%`)
    cardRef.current.style.setProperty('--hy', `${ny * 100}%`)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }
  const holo = (
    <>
      {tilt && <span aria-hidden className="holo-sheen pointer-events-none absolute inset-0 z-20" />}
      {featured && !reduce && <span aria-hidden className="holo-sweep pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2" />}
    </>
  )

  const body = (
    <div className={`relative flex h-full flex-col ${featured ? 'bg-surface-2 p-7 md:p-9' : 'bg-surface p-7 md:p-8'}`}>
      <HudCorners inset={8} size={12} />
      {featured && (
        <span className="chamfer chamfer-sm mb-4 inline-flex w-fit items-center gap-2 whitespace-nowrap bg-yellow px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-bg shadow-[0_0_18px_rgba(255,230,0,0.35)]">
          ★ {p.popular}
        </span>
      )}
      <h3 className="font-display text-[22px] font-bold uppercase tracking-[0.06em] text-ink">{plan.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{plan.tagline}</p>

      {showPrices && (
        <div className="mt-7 border-y border-line py-6">
          <div className="flex items-baseline gap-2 text-ink">
            <span className="font-display text-[20px] font-semibold text-ink-2">R$</span>
            <Counter
              value={plan.price}
              format={brl}
              className={`font-display font-bold leading-none tabular-nums tracking-[-0.02em] ${featured ? 'text-[60px] text-cyan [text-shadow:0_0_24px_rgba(0,240,255,0.35)]' : 'text-[52px]'}`}
            />
          </div>
          <p className="mt-2 text-[15px] text-ink-2">
            {p.or} <strong className="font-semibold text-ink">R$ {brl(plan.cashPrice)}</strong> {p.cash}
          </p>
          {plan.nudge && (
            <p className="mt-3 inline-flex items-center gap-2 border border-yellow/40 bg-yellow/[0.06] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-yellow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-yellow shadow-[0_0_8px_#FFE600]" />
              {plan.nudge}
            </p>
          )}
        </div>
      )}
      {!showPrices && <div className="mt-6 border-t border-line" />}

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15.5px] leading-snug text-ink">
            <IconCheck className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${featured ? 'text-cyan' : 'text-cyan/75'}`} />
            {f}
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[12px] uppercase tracking-[0.16em]">
        <span className="text-ink-3">{p.deliveryLabel}</span>
        <span className="text-cyan">{plan.delivery}</span>
      </p>

      <div className="mt-6">
        <Button
          href={waLink(t.wa.plan(plan.name))}
          variant={featured ? 'primary' : 'ghost'}
          full
          icon={<IconArrow className="h-4 w-4" />}
          magnetic={featured}
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  )

  return (
    <motion.div
      className={`group relative ${order} ${featured ? 'md:-my-6 md:z-10' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className={`h-full transition-[filter] duration-500 ${
          featured
            ? '[filter:drop-shadow(0_0_24px_rgba(0,240,255,0.25))] hover:[filter:drop-shadow(0_0_40px_rgba(0,240,255,0.45))]'
            : 'hover:[filter:drop-shadow(0_0_24px_rgba(0,240,255,0.2))]'
        }`}
      >
        {featured ? (
          <div className="chamfer chamfer-lg border-spin h-full p-[1.5px]">
            <div className="chamfer chamfer-lg relative h-full overflow-hidden" style={{ '--chamfer': '21px' }}>
              {body}
              {holo}
            </div>
          </div>
        ) : (
          <div className="chamfer h-full bg-line p-px transition-colors duration-500 group-hover:bg-cyan/40">
            <div className="chamfer relative h-full overflow-hidden" style={{ '--chamfer': '13.5px' }}>
              {body}
              {holo}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Pricing() {
  const { t } = useLang()
  const p = t.pricing
  return (
    <section id="pricing" className="relative py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-[60%] bg-[radial-gradient(45%_50%_at_50%_40%,rgba(0,240,255,0.06),transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="mx-auto mb-14 max-w-[720px] text-center md:mb-20">
          <SectionLabel once className="justify-center">
            {p.label}
          </SectionLabel>
          <RevealHeading text={p.title} className="h2 text-ink" once />
          <Reveal once className="lead mx-auto mt-5 max-w-[540px]">
            {p.sub}
          </Reveal>
        </div>

        {p.intl && (
          <Reveal once className="mb-10">
            <div className="chamfer chamfer-lg bg-cyan/35 p-px">
              <div
                className="chamfer chamfer-lg flex flex-col items-start gap-6 bg-[linear-gradient(110deg,#0F1622,#0D1018_60%)] p-7 md:flex-row md:items-center md:justify-between md:p-9"
                style={{ '--chamfer': '21px' }}
              >
                <div>
                  <p className="hud text-[12px]">{p.intl.lead}</p>
                  <p className="mt-1 font-display text-[44px] font-bold leading-none text-ink md:text-[56px]">
                    <span className="hl">{p.intl.price}</span>
                  </p>
                  <p className="mt-3 max-w-[520px] text-[16px] leading-relaxed text-ink-2">{p.intl.text}</p>
                </div>
                <Button href={waLink(t.wa.default)} size="lg" magnetic icon={<IconArrow className="h-5 w-5" />}>
                  {p.intl.cta}
                </Button>
              </div>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-5 lg:gap-7">
          {p.plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} i={i} showPrices={p.showPrices} />
          ))}
        </div>

        {p.payments.length > 0 && (
          <Reveal once className="mt-14">
            <ul className="flex flex-col items-center justify-center gap-3 border-y border-line py-5 text-center font-mono text-[12.5px] uppercase tracking-[0.14em] text-ink md:flex-row md:gap-6">
              {p.payments.map((pay, i) => (
                <li key={pay} className="flex items-center gap-6">
                  {i > 0 && <span aria-hidden className="hidden text-cyan md:inline">·</span>}
                  {pay}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal once className={p.payments.length ? 'mt-8' : 'mt-14'}>
          <div className="flex flex-col gap-5 border border-line bg-surface/70 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
              <span className="hud text-[12px]">{p.maintenance.tag}</span>
              {p.maintenance.price && <span className="font-display text-[24px] font-bold text-ink">{p.maintenance.price}</span>}
              <span className="text-[15.5px] text-ink-2">{p.maintenance.text}</span>
            </div>
            <a
              href={waLink(t.wa.maintenance)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u inline-flex min-h-12 shrink-0 items-center gap-2 self-start font-display text-[14px] font-semibold uppercase tracking-[0.08em] text-cyan md:self-auto"
            >
              {p.maintenance.cta} <IconArrow className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
