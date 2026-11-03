import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { translations, LANGS } from './translations'

const LangContext = createContext(null)
const STORAGE_KEY = 'bl-lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGS.includes(saved)) return saved
  } catch {}
  return 'pt'
}

/**
 * Provides `lang`, `t` (translation tree) and `setLang`.
 * Switching fades + blurs the page content (#content) for ~300ms, without reload.
 */
export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const busy = useRef(false)
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang
    document.title = t.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', t.meta.description)
  }, [t])

  const setLang = useCallback(
    (next) => {
      if (next === lang || busy.current) return
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
      const el = document.getElementById('content')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!el || reduce) {
        setLangState(next)
        return
      }
      busy.current = true
      const out = el.animate(
        [
          { opacity: 1, filter: 'blur(0px)' },
          { opacity: 0, filter: 'blur(6px)' },
        ],
        { duration: 150, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' },
      )
      out.onfinish = () => {
        setLangState(next)
        requestAnimationFrame(() => {
          const inn = el.animate(
            [
              { opacity: 0, filter: 'blur(6px)' },
              { opacity: 1, filter: 'blur(0px)' },
            ],
            { duration: 150, easing: 'cubic-bezier(0.22,1,0.36,1)' },
          )
          inn.onfinish = () => {
            out.cancel()
            busy.current = false
          }
        })
      }
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
