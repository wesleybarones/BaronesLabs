import { useLang } from '../i18n/LangContext'
import { LANGS } from '../i18n/translations'

function FlagBR() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" fill="#1E9A4B" />
      <path d="M16 5 29 16 16 27 3 16Z" fill="#FEDF00" />
      <circle cx="16" cy="16" r="6.2" fill="#1E3F95" />
      <path d="M10 15.2c4-1.3 8.4-.9 12 1.2" stroke="#fff" strokeWidth="1.1" fill="none" />
    </svg>
  )
}
function FlagUS() {
  const stripes = []
  for (let i = 0; i < 7; i++) stripes.push(<rect key={i} y={i * 4.57} width="32" height="2.29" fill="#C8102E" />)
  const stars = []
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) stars.push(<circle key={`${r}${c}`} cx={2.4 + c * 3.4 + (r % 2) * 1.7} cy={2.3 + r * 3.6} r="0.75" fill="#fff" />)
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" fill="#fff" />
      {stripes}
      <rect width="15" height="16" fill="#0A3161" />
      {stars}
    </svg>
  )
}
function FlagES() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" fill="#C60B1E" />
      <rect y="8" width="32" height="16" fill="#FFC400" />
      <rect x="8" y="13" width="4" height="6" rx="0.6" fill="#AD1519" opacity="0.85" />
    </svg>
  )
}

const FLAGS = { pt: FlagBR, en: FlagUS, es: FlagES }
const CODES = { pt: 'PT-BR', en: 'EN', es: 'ES' }
const NAMES = { pt: 'Português (Brasil)', en: 'English', es: 'Español' }

export default function Flags({ size = 'md', showCode = false, className = '' }) {
  const { lang, setLang, t } = useLang()
  const dim = size === 'lg' ? 'h-12 w-12' : 'h-7 w-7'
  return (
    <div role="group" aria-label={t.a11y.langSwitch} className={`flex items-center ${size === 'lg' ? 'gap-4' : 'gap-1'} ${className}`}>
      {LANGS.map((l) => {
        const F = FLAGS[l]
        const active = l === lang
        return (
          <button
            key={l}
            type="button"
            lang={l === 'pt' ? 'pt-BR' : l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            aria-label={NAMES[l]}
            data-cursor
            className={`group flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full ${size === 'lg' ? '' : '-mx-1.5'}`}
          >
            <span
              className={`${dim} relative block overflow-hidden rounded-full transition-all duration-300 ${
                active
                  ? 'ring-2 ring-cyan ring-offset-2 ring-offset-bg shadow-[0_0_14px_rgba(0,240,255,0.55)]'
                  : 'opacity-55 grayscale-[40%] ring-1 ring-white/15 group-hover:opacity-100 group-hover:grayscale-0'
              }`}
            >
              <F />
            </span>
            {showCode && (
              <span className={`font-mono text-xs tracking-[0.18em] ${active ? 'text-cyan' : 'text-ink-3'}`}>{CODES[l]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
