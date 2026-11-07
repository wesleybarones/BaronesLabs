import { useMemo } from 'react'
import { useLang } from '../i18n/LangContext'
import { waLink } from '../config'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { IconArrow } from '../components/Icons'
import DotGlobe from '../components/DotGlobe'

/*
  "Do Rio de Janeiro para o mundo": interactive dotted globe. The arcs mark the regions served in each
  language (PT / EN / ES) — not client locations.
*/
const TARGETS = [
  { lat: -23.55, lon: -46.63, label: 'PT · BR', below: true }, // São Paulo (label below the home marker)
  { lat: 38.72, lon: -9.14, label: 'PT · PT' }, // Lisboa
  { lat: 40.71, lon: -74.0, label: 'EN · US', magenta: true }, // Nova York
  { lat: 40.42, lon: -3.7, label: 'ES · ES', below: true }, // Madri (label below Lisbon's)
  { lat: -34.6, lon: -58.38, label: 'ES · AR', magenta: true }, // Buenos Aires
  { lat: 19.43, lon: -99.13, label: 'ES · MX' }, // Cidade do México
]

export default function Reach() {
  const { t } = useLang()
  const r = t.reach
  const targets = useMemo(() => TARGETS, [])
  return (
    <section id="reach" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionLabel>{r.label}</SectionLabel>
          <RevealHeading text={r.title} className="h2 max-w-[16ch] text-ink" />
          <Reveal delay={0.15} className="lead mt-6 max-w-[460px]">
            {r.text}
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <ul className="flex flex-wrap gap-2.5">
              {r.points.map((pt) => (
                <li key={pt} className="glass flex items-center gap-2 border border-line px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink">
                  <span aria-hidden className="h-1.5 w-1.5 bg-cyan shadow-[0_0_6px_#00F0FF]" />
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.35} className="mt-10">
            <Button href={waLink(t.wa.default)} size="lg" magnetic icon={<IconArrow className="h-5 w-5" />}>
              {r.cta}
            </Button>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <DotGlobe targets={targets} hint={r.hint} className="mx-auto aspect-square w-full max-w-[640px]" />
        </Reveal>
      </div>
    </section>
  )
}
