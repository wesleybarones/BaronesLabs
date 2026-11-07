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
  "Do Rio de Janeiro para o mundo": interactive dotted globe. The arcs show the reach of a 100% online
  service (every continent) — they are not client locations.
*/
const TARGETS = [
  // South America
  { lat: -23.55, lon: -46.63, label: 'SÃO PAULO', below: true },
  { lat: -34.6, lon: -58.38, label: 'BUENOS AIRES', magenta: true, below: true },
  { lat: -33.45, lon: -70.67, label: 'SANTIAGO' },
  { lat: 4.71, lon: -74.07, label: 'BOGOTÁ' },
  // North America
  { lat: 40.71, lon: -74.0, label: 'NEW YORK', magenta: true },
  { lat: 25.76, lon: -80.19, label: 'MIAMI', below: true },
  { lat: 43.65, lon: -79.38, label: 'TORONTO' },
  { lat: 19.43, lon: -99.13, label: 'CDMX' },
  // Europe
  { lat: 38.72, lon: -9.14, label: 'LISBOA' },
  { lat: 40.42, lon: -3.7, label: 'MADRID', below: true },
  { lat: 51.51, lon: -0.13, label: 'LONDON', magenta: true },
  { lat: 48.86, lon: 2.35, label: 'PARIS', below: true },
  // Africa
  { lat: -8.84, lon: 13.23, label: 'LUANDA' },
  { lat: -25.97, lon: 32.57, label: 'MAPUTO', magenta: true },
  { lat: 6.52, lon: 3.38, label: 'LAGOS' },
  // Asia
  { lat: 35.68, lon: 139.69, label: 'TOKYO', magenta: true },
  { lat: 25.2, lon: 55.27, label: 'DUBAI' },
  { lat: 1.35, lon: 103.82, label: 'SINGAPORE' },
  { lat: 19.08, lon: 72.88, label: 'MUMBAI', below: true },
  // Oceania
  { lat: -33.87, lon: 151.21, label: 'SYDNEY' },
  { lat: -36.85, lon: 174.76, label: 'AUCKLAND', magenta: true },
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
