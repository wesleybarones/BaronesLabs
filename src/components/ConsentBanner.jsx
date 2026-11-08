import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { TRACKING_ON, getConsent, setConsent } from '../lib/tracking'

// textos do banner de cookies (LGPD) nos três idiomas do site
const COPY = {
  pt: {
    label: 'Aviso de cookies',
    text: 'Usamos cookies para medir as visitas e melhorar nossos anúncios. Você escolhe se aceita.',
    accept: 'Aceitar',
    reject: 'Recusar',
  },
  en: {
    label: 'Cookie notice',
    text: 'We use cookies to measure visits and improve our ads. It is your choice.',
    accept: 'Accept',
    reject: 'Decline',
  },
  es: {
    label: 'Aviso de cookies',
    text: 'Usamos cookies para medir las visitas y mejorar nuestros anuncios. Tú eliges si aceptas.',
    accept: 'Aceptar',
    reject: 'Rechazar',
  },
}

/** Banner de consentimento (Consent Mode v2). Só aparece quando o GTM está ligado e o visitante ainda não escolheu. */
export default function ConsentBanner() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const c = COPY[lang] || COPY.pt

  useEffect(() => {
    if (!TRACKING_ON || getConsent()) return
    const id = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(id)
  }, [])

  const choose = (v) => {
    setConsent(v)
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="region"
          aria-label={c.label}
          className="fixed inset-x-4 bg-surface/95 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md bottom-4 z-[70] border border-line p-4 md:inset-x-auto md:bottom-8 md:left-8 md:max-w-[420px] md:p-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[14px] leading-relaxed text-ink-2">{c.text}</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="min-h-11 flex-1 bg-cyan px-4 font-display text-[14px] font-semibold text-bg transition-colors hover:bg-cyan-hi"
            >
              {c.accept}
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="min-h-11 flex-1 border border-line px-4 font-display text-[14px] font-semibold text-ink transition-colors hover:border-cyan/60"
            >
              {c.reject}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
