import { AnimatePresence, MotionConfig } from 'motion/react'
import { lazy } from 'react'
import Deferred, { mountAllSections } from './components/Deferred'
import { BOT } from './lib/bot'
import { useCallback, useEffect, useState } from 'react'
import { AppProvider, useLockScroll } from './lib/AppContext'
import { useLang } from './i18n/LangContext'
import Seo from './components/Seo'
import Background from './components/Background'
import Boot from './components/Boot'
import Header from './components/Header'
import ScrollProgress from './components/ScrollProgress'
import WhatsAppFloat from './components/WhatsAppFloat'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'


// below-the-fold sections: separate chunks, mounted on demand (see components/Deferred.jsx)
const LOADERS = {
  Problem: () => import('./sections/Problem'),
  ScanTransition: () => import('./sections/ScanTransition'),
  Solution: () => import('./sections/Solution'),
  TunnelTransition: () => import('./sections/TunnelTransition'),
  Audience: () => import('./sections/Audience'),
  Portfolio: () => import('./sections/Portfolio'),
  Process: () => import('./sections/Process'),
  MoneyRain: () => import('./sections/MoneyRain'),
  Pricing: () => import('./sections/Pricing'),
  GuaranteeBonus: () => import('./sections/GuaranteeBonus'),
  Testimonials: () => import('./sections/Testimonials'),
  About: () => import('./sections/About'),
  Reach: () => import('./sections/Reach'),
  FAQ: () => import('./sections/FAQ'),
  FinalCTA: () => import('./sections/FinalCTA'),
  Footer: () => import('./sections/Footer'),
}
const S = Object.fromEntries(Object.entries(LOADERS).map(([k, f]) => [k, lazy(f)]))
if (typeof window !== 'undefined') {
  window.__blLoadAll = () => {
    mountAllSections()
    return Promise.all(Object.values(LOADERS).map((f) => f()))
  }
}

const BOOT_KEY = 'bl-booted'

// direct link to a section (baroneslabs.com.br/portfolio or /#portfolio): skip the intro and land on it
const DEEP_LINKS = { '/portfolio': 'portfolio' }
const deepTarget = () =>
  typeof window === 'undefined'
    ? null
    : DEEP_LINKS[window.location.pathname.replace(/\/+$/, '')] ||
      (window.location.hash === '#portfolio' ? 'portfolio' : null)

function shouldBoot() {
  if (BOT.test(navigator.userAgent)) return false
  if (deepTarget()) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem(BOOT_KEY)
  } catch {
    return true
  }
}

export default function App() {
  const { t } = useLang()
  const [booting, setBooting] = useState(shouldBoot)
  // while the intro plays, the heavy site mounts only after the LED explosion (see Boot)
  const [siteMounted, setSiteMounted] = useState(() => !booting)
  const [ready, setReady] = useState(() => !booting)
  const [lenis, setLenis] = useState(null)

  // smooth scroll (Lenis) — drives native window scroll, so Motion's useScroll stays in sync
  // (loaded right after the first paint, so it doesn't compete with the hero for the main thread)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let l
    let raf
    let cancelled = false
    const start = () =>
      import('lenis').then(({ default: Lenis }) => {
        if (cancelled) return
        l = new Lenis({ duration: 1.1, easing: (x) => 1 - Math.pow(1 - x, 4), smoothWheel: true })
        const loop = (time) => {
          l.raf(time)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        setLenis(l)
      })
    const idle = window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200)
    return () => {
      cancelled = true
      window.cancelIdleCallback ? cancelIdleCallback(idle) : clearTimeout(idle)
      cancelAnimationFrame(raf)
      l?.destroy()
    }
  }, [])


  useLockScroll(booting, lenis)

  // deep link: mount every section, then scroll to the target (re-aligned while late content settles)
  useEffect(() => {
    const id = deepTarget()
    if (!id) return
    let userMoved = false
    const stop = () => (userMoved = true)
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('touchstart', stop, { passive: true, once: true })
    const go = () => {
      const el = document.getElementById(id)
      if (el && !userMoved) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
    }
    const timers = []
    window.__blLoadAll().then(() => [60, 400, 1000, 1800].forEach((ms) => timers.push(setTimeout(go, ms))))
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [])

  const endBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {}
    setSiteMounted(true)
    setReady(true)
    setBooting(false)
  }, [])
  const mountSite = useCallback(() => setSiteMounted(true), [])
  const reveal = useCallback(() => setReady(true), [])

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider ready={ready} lenis={lenis}>
        <Seo />
        <a
          href="#content"
          className="fixed left-4 top-4 z-[300] -translate-y-24 bg-cyan px-4 py-3 font-display font-semibold text-bg transition-transform focus:translate-y-0"
        >
          {t.a11y.skip}
        </a>
        {siteMounted && (
          <>
        <Background />
        <ScrollProgress />
        <Header />
        <main id="content" tabIndex={-1} className="relative outline-none">
          <Hero />
          <Marquee />
          <Deferred>
            <S.Problem />
          </Deferred>
          <Deferred>
            <S.ScanTransition />
          </Deferred>
          <Deferred>
            <S.Solution />
          </Deferred>
          <Deferred>
            <S.TunnelTransition />
          </Deferred>
          <Deferred>
            <S.Portfolio />
          </Deferred>
          <Deferred>
            <S.Reach />
          </Deferred>
          <Deferred>
            <S.Audience />
          </Deferred>
          <Deferred>
            <S.MoneyRain />
          </Deferred>
          <Deferred>
            <S.Process />
          </Deferred>
          <Deferred>
            <S.Pricing />
          </Deferred>
          <Deferred>
            <S.GuaranteeBonus />
          </Deferred>
          <Deferred>
            <S.About />
          </Deferred>
          <Deferred>
            <S.Testimonials />
          </Deferred>
          <Deferred>
            <S.FAQ />
          </Deferred>
          <Deferred>
            <S.FinalCTA />
          </Deferred>
          <Deferred>
            <S.Footer />
          </Deferred>
        </main>
        <WhatsAppFloat />
          </>
        )}
        <AnimatePresence>{booting && <Boot onDone={endBoot} onMountSite={mountSite} onReveal={reveal} />}</AnimatePresence>
      </AppProvider>
    </MotionConfig>
  )
}
