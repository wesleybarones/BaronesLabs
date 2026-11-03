import { useLang } from '../i18n/LangContext'
import RevealHeading from '../components/ui/RevealHeading'
import SectionLabel from '../components/ui/SectionLabel'
import Guarantee from './Guarantee'
import Bonus from './Bonus'

/** Guarantee + Bonus together: everything that reduces the client's risk, side by side. */
export default function GuaranteeBonus() {
  const { t } = useLang()
  const gb = t.guaranteeBonus
  return (
    <section id="guarantee" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="mb-12 text-center md:mb-16">
          <SectionLabel once className="justify-center">
            {gb.label}
          </SectionLabel>
          <RevealHeading text={gb.title} className="h2 mx-auto max-w-[18ch] text-ink" once />
        </div>
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Guarantee />
          </div>
          <div className="lg:col-span-7">
            <Bonus />
          </div>
        </div>
      </div>
    </section>
  )
}
