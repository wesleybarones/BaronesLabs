import { AnimatePresence, MotionConfig } from 'motion/react'
import Lenis from 'lenis'
import { useCallback, useEffect, useState } from 'react'
import { AppProvider, useLockScroll } from './lib/AppContext'
import { useLang } from './i18n/LangContext'
import Background from './components/Background'
import Boot from './components/Boot'
import Header from './components/Header'
import ScrollProgress from './components/ScrollProgress'
import Cursor from './components/Cursor'
import WhatsAppFloat from './components/WhatsAppFloat'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Problem from './sections/Problem'
import ScanTransition from './sections/ScanTransition'
import Solution from './sections/Solution'
import Audience from './sections/Audience'
import Portfolio from './sections/Portfolio'
import Process from './sections/Process'
import Pricing from './sections/Pricing'
import Bonus from './sections/Bonus'
import Guarantee from './sections/Guarantee'
import Testimonials from './sections/Testimonials'
import About from './sections/About'
import FAQ from './sections/FAQ'
import FinalCTA from './sections/FinalCTA'
import Footer from './sections/Footer'

const BOOT_KEY = 'bl-booted'

function shouldBoot() {
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
  const [lenis, setLenis] = useState(null)

  // smooth scroll (Lenis) — drives native window scroll, so Motion's useScroll stays in sync
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ duration: 1.1, easing: (x) => 1 - Math.pow(1 - x, 4), smoothWheel: true })
    let raf
    const loop = (time) => {
      l.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    setLenis(l)
    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
    }
  }, [])

  useLockScroll(booting, lenis)

  const endBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {}
    setBooting(false)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider ready={!booting} lenis={lenis}>
        <a
          href="#content"
          className="fixed left-4 top-4 z-[300] -translate-y-24 bg-cyan px-4 py-3 font-display font-semibold text-bg transition-transform focus:translate-y-0"
        >
          {t.a11y.skip}
        </a>
        <Background />
        <ScrollProgress />
        <Header />
        <main id="content" tabIndex={-1} className="relative outline-none">
          <Hero />
          <Marquee />
          <Problem />
          <ScanTransition />
          <Solution />
          <Audience />
          <Portfolio />
          <Process />
          <Pricing />
          <Bonus />
          <Guarantee />
          <Testimonials />
          <About />
          <FAQ />
          <FinalCTA />
          <Footer />
        </main>
        <WhatsAppFloat />
        <Cursor />
        <AnimatePresence>{booting && <Boot onDone={endBoot} />}</AnimatePresence>
      </AppProvider>
    </MotionConfig>
  )
}
