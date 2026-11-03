import { useLang } from '../i18n/LangContext'
import { scrollToId, useApp } from '../lib/AppContext'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, waLink } from '../config'
import { LogoHorizontal } from '../components/Logo'
import Flags from '../components/Flags'
import { IconInstagram, IconWhatsApp } from '../components/Icons'

export default function Footer() {
  const { t } = useLang()
  const { lenis } = useApp()
  const links = [
    ['portfolio', t.nav.projects],
    ['process', t.nav.how],
    ['pricing', t.nav.packages],
    ['faq', t.nav.faq],
  ]
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToId(id, lenis)
  }
  return (
    <footer className="relative border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 px-4 py-16 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-5">
          <LogoHorizontal className="!h-16 md:!h-20" />
          <p className="mt-5 max-w-[340px] text-[15px] leading-relaxed text-ink-2">{t.footer.tagline}</p>
        </div>
        <nav className="md:col-span-2" aria-label={t.footer.links}>
          <h2 className="hud mb-5 text-[11px] text-ink-3">{t.footer.links}</h2>
          <ul className="space-y-3">
            {links.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={go(id)} className="link-u text-[15px] text-ink-2 transition-colors hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="hud mb-5 text-[11px] text-ink-3">{t.footer.contact}</h2>
          <ul className="space-y-3">
            <li>
              <a href={waLink(t.wa.default)} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2.5 text-[15px] text-ink-2 hover:text-ink">
                <IconWhatsApp className="h-4 w-4 text-cyan" />
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2.5 text-[15px] text-ink-2 hover:text-ink">
                <IconInstagram className="h-4 w-4 text-cyan" />@{INSTAGRAM_HANDLE}
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="hud mb-5 text-[11px] text-ink-3">{t.footer.language}</h2>
          <Flags />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-3 px-4 py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 md:flex-row md:items-center md:justify-between md:px-8">
          <span>{t.footer.rights}</span>
          <span className="flex items-center gap-6">
            <a href="#top" onClick={go('top')} className="link-u hover:text-cyan">
              ↑ {t.footer.back}
            </a>
            <span className="flex items-center gap-2 text-cyan/80">
              {t.footer.status}
              <span className="live-dot scale-75" aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}
