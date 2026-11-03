import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { scrollToId, useApp, useLockScroll } from '../lib/AppContext'
import { waLink } from '../config'
import { EASE } from '../lib/motion'
import { LogoHorizontal } from './Logo'
import Flags from './Flags'
import { IconClose, IconMenu, IconWhatsApp } from './Icons'

const LINKS = [
  ['portfolio', 'projects'],
  ['process', 'how'],
  ['pricing', 'packages'],
  ['faq', 'faq'],
]

export default function Header() {
  const { t } = useLang()
  const { lenis, ready } = useApp()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useLockScroll(open, lenis)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(v > 80)
    if (v > prev && v > 220) setHidden(true)
    else if (v < prev - 2 || v < 220) setHidden(false)
  })

  useEffect(() => {
    const ids = LINKS.map(([id]) => id)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollToId(id, lenis), open ? 250 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: !ready ? -100 : hidden && !open ? -100 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 24 }}
        className="fixed inset-x-0 top-0 z-[60]"
      >
        <div
          className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
            solid || open ? 'glass border-b border-line' : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between gap-6 px-4 md:px-8">
            <a href="#top" onClick={go('top')} aria-label={t.a11y.home} className="shrink-0" data-cursor>
              <LogoHorizontal />
            </a>

            <ul className="hidden items-center gap-9 lg:flex">
              {LINKS.map(([id, key]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    aria-current={active === id ? 'true' : undefined}
                    className={`link-u font-display text-[15px] font-medium tracking-[0.04em] transition-colors hover:text-ink ${
                      active === id ? 'text-ink' : 'text-ink-2'
                    }`}
                  >
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Flags className="hidden md:flex" />
              <a
                href={waLink(t.wa.default)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="group relative hidden sm:inline-flex"
              >
                <span className="chamfer chamfer-sm absolute inset-0 bg-magenta opacity-0 transition-all duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:opacity-100" />
                <span className="chamfer chamfer-sm btn-sweep relative inline-flex min-h-10 items-center gap-2 bg-cyan px-5 font-display text-[14px] font-semibold uppercase tracking-[0.08em] text-bg shadow-[0_0_18px_rgba(0,240,255,0.35)]">
                  <IconWhatsApp className="h-4 w-4" />
                  {t.nav.quote}
                </span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
                className="relative flex h-12 w-12 items-center justify-center text-ink lg:hidden"
              >
                <span className="chamfer chamfer-sm absolute inset-0 border border-line bg-surface/60" />
                {open ? <IconClose className="relative h-6 w-6" /> : <IconMenu className="relative h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[55] flex flex-col bg-bg/96 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="bg-grid-global pointer-events-none absolute inset-0" />
            <motion.ul
              className="relative flex flex-col gap-2"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            >
              {LINKS.map(([id, key], i) => (
                <motion.li
                  key={id}
                  variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { ease: EASE, duration: 0.5 } } }}
                >
                  <a
                    href={`#${id}`}
                    onClick={go(id)}
                    className="flex items-baseline gap-4 border-b border-line py-4 font-display text-[34px] font-semibold text-ink"
                  >
                    <span className="hud text-[11px]">0{i + 1}</span>
                    {t.nav[key]}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="relative mt-auto flex flex-col gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45, ease: EASE } }}
            >
              <Flags size="lg" showCode />
              <a
                href={waLink(t.wa.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="chamfer flex min-h-14 items-center justify-center gap-3 bg-cyan font-display font-semibold uppercase tracking-[0.08em] text-bg"
              >
                <IconWhatsApp className="h-5 w-5" />
                {t.nav.quote}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
