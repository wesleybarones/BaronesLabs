import { useLang } from '../i18n/LangContext'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import { Stagger, StaggerItem } from '../components/ui/Reveal'
import TiltCard from '../components/ui/TiltCard'
import HudCorners from '../components/ui/HudCorners'
import { motion } from 'motion/react'
import { IconBriefcase, IconDish, IconRocket, IconScissors } from '../components/Icons'
import { useReducedMotion } from '../lib/hooks'

const ICONS = [IconScissors, IconBriefcase, IconRocket, IconDish]
const LAYOUT = [
  'sm:col-span-2 lg:col-span-3 lg:row-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
  'sm:col-span-2 lg:col-span-3',
]

export default function Audience() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const a = t.audience
  return (
    <section id="audience" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1360px] px-4 md:px-8">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel>{a.label}</SectionLabel>
            <RevealHeading text={a.title} className="h2 max-w-[16ch] text-ink" />
          </div>
        </div>

        <Stagger className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5" stagger={0.08}>
          {a.tiles.map((tile, i) => {
            const Icon = ICONS[i]
            const big = i === 0
            return (
              <StaggerItem key={tile.name} className={LAYOUT[i]}>
                <TiltCard className="h-full border border-line bg-surface/60 backdrop-blur-[8px] transition-colors duration-500 hover:border-cyan/40">
                  <HudCorners inset={-1} />
                  <div className={`relative flex h-full flex-col p-6 md:p-8 ${big ? 'justify-between' : 'justify-between'}`}>
                    <div className="flex items-start justify-between">
                      <span className="relative">
                        <Icon
                          className={`flicker-on-hover text-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] ${big ? 'h-20 w-20 md:h-24 md:w-24' : 'h-11 w-11'}`}
                          strokeWidth={big ? 1.1 : 1.4}
                        />
                        <Icon
                          aria-hidden
                          className={`absolute left-0 top-0 -translate-x-[2px] translate-y-[1px] text-magenta/50 ${big ? 'h-20 w-20 md:h-24 md:w-24' : 'h-11 w-11'}`}
                          strokeWidth={big ? 1.1 : 1.4}
                          style={{ zIndex: -1 }}
                        />
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.2em] text-ink-3">0{i + 1}</span>
                    </div>
                    <div className={big ? 'mt-16' : 'mt-8'}>
                      <h3 className={`font-display font-semibold leading-tight text-ink ${big ? 'text-[30px] md:text-[40px]' : 'text-[22px] md:text-[24px]'}`}>
                        {tile.name}
                      </h3>
                      <p className={`mt-2 text-ink-2 ${big ? 'max-w-[380px] text-[17px]' : 'text-[15px] leading-relaxed'}`}>{tile.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            )
          })}
          <StaggerItem className="sm:col-span-2 lg:col-span-3">
            {/* highlight tile with a breathing neon glow (Motion) */}
            <motion.div
              className="relative flex h-full flex-col justify-end overflow-hidden border bg-[linear-gradient(160deg,rgba(0,240,255,0.10),rgba(224,64,216,0.05)_70%)] p-6 md:p-8"
              initial={{ borderColor: 'rgba(0,240,255,0.3)', boxShadow: '0 0 0px rgba(0,240,255,0)' }}
              animate={
                reduce
                  ? { borderColor: 'rgba(0,240,255,0.7)', boxShadow: '0 0 24px rgba(0,240,255,0.3)' }
                  : {
                      borderColor: ['rgba(0,240,255,0.45)', 'rgba(0,240,255,1)', 'rgba(0,240,255,0.45)'],
                      boxShadow: [
                        '0 0 10px rgba(0,240,255,0.15), inset 0 0 10px rgba(0,240,255,0.05)',
                        '0 0 34px rgba(0,240,255,0.55), 0 0 2px #00F0FF, inset 0 0 22px rgba(0,240,255,0.18)',
                        '0 0 10px rgba(0,240,255,0.15), inset 0 0 10px rgba(0,240,255,0.05)',
                      ],
                    }
              }
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* light sweeping along the top edge */}
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute top-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_12px_#00F0FF]"
                  animate={{ left: ['-35%', '105%'] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                />
              )}
              <span aria-hidden className="absolute -right-6 -top-6 font-display text-[140px] font-bold leading-none text-cyan/[0.08]">
                +
              </span>
              <span aria-hidden className="mb-4 block h-px w-10 bg-cyan shadow-[0_0_8px_#00F0FF]" />
              <motion.p
                className="relative font-display text-[22px] font-semibold leading-snug text-ink md:text-[26px]"
                animate={reduce ? {} : { textShadow: ['0 0 0px rgba(0,240,255,0)', '0 0 14px rgba(0,240,255,0.6)', '0 0 0px rgba(0,240,255,0)'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {a.sub}
              </motion.p>
            </motion.div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
