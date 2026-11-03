import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { useApp, useLockScroll } from '../lib/AppContext'
import { useMediaQuery } from '../lib/hooks'
import { EASE } from '../lib/motion'
import HudCorners from './ui/HudCorners'
import { IconArrowUpRight, IconClose } from './Icons'

/** Can this page show other sites in an iframe? Not when it is itself embedded (e.g. a preview viewer). */
export const canEmbed = () => typeof window !== 'undefined' && window.self === window.top

/**
 * Full-screen "browser" with the real, live client site inside, so visitors can scroll and click
 * through everything it offers. Desktop / mobile toggle; Esc or the × closes.
 */
export default function LiveSiteModal({ project, onClose }) {
  const { t } = useLang()
  const p = t.portfolio
  const { lenis } = useApp()
  const narrow = useMediaQuery('(max-width: 767px)')
  const [device, setDevice] = useState(narrow ? 'mobile' : 'desktop')
  const [loaded, setLoaded] = useState(false)
  const closeRef = useRef(null)
  const open = !!project
  useLockScroll(open, lenis)

  useEffect(() => {
    if (!open) return
    setLoaded(false)
    setDevice(window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop')
    const prev = document.activeElement
    closeRef.current?.focus()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      prev?.focus?.()
    }
  }, [open]) // eslint-disable-line

  const host = project?.url?.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const isMobile = device === 'mobile'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${p.explore}: ${project.name}`}
          data-lenis-prevent
          className="fixed inset-0 z-[150] flex flex-col bg-bg/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* top bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-surface/80 px-4 py-3 md:px-6">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-magenta/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan/80" />
            </span>
            <span className="glass hidden min-w-0 flex-1 items-center gap-2 truncate border border-line px-3 py-1.5 font-mono text-[12px] text-ink-2 sm:flex">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_6px_#00F0FF]" />
              <span className="truncate">{host}</span>
            </span>
            <span className="font-display text-[15px] font-semibold text-ink sm:hidden">{project.name}</span>
            <div className="ml-auto flex items-center gap-2">
              <div role="group" aria-label={p.device} className="hidden border border-line md:flex">
                {['desktop', 'mobile'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={device === d}
                    onClick={() => setDevice(d)}
                    className={`min-h-10 px-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      device === d ? 'bg-cyan text-bg' : 'text-ink-2 hover:text-cyan'
                    }`}
                  >
                    {p[d]}
                  </button>
                ))}
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-10 items-center gap-2 border border-line px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:border-cyan hover:text-cyan"
              >
                <span className="hidden sm:inline">{p.openTab}</span>
                <IconArrowUpRight className="h-4 w-4" />
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={p.close}
                className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-cyan hover:text-cyan"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* viewport */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 md:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.div
              layout
              transition={{ duration: 0.45, ease: EASE }}
              className={`relative h-full overflow-hidden border border-cyan/40 bg-[#0A0D15] shadow-[0_0_60px_rgba(0,240,255,0.18)] ${
                isMobile ? 'aspect-[9/19.5] max-h-[860px] w-auto max-w-full rounded-[28px] md:border-[6px] md:border-[#1B2130]' : 'w-full max-w-[1440px]'
              }`}
            >
              {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-2 border-cyan/20 border-t-cyan" />
                  <span className="hud text-[11px]">{p.loading}</span>
                </div>
              )}
              <iframe
                key={project.id}
                src={project.url}
                title={`${project.name} — ${p.live}`}
                onLoad={() => setLoaded(true)}
                className={`h-full w-full bg-white transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="strict-origin-when-cross-origin"
              />
              {!isMobile && <HudCorners inset={6} size={14} />}
            </motion.div>
          </div>
          <p className="hud pb-3 text-center text-[10.5px] text-ink-3">{p.liveHint}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
