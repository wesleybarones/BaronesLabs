import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

const AppContext = createContext({ ready: true, dir: 1, lenis: null, assembly: false, setHeroBusy: () => {} })

/**
 * Global app state:
 * - ready: boot sequence finished (hero entrance waits for it)
 * - dir: scroll direction (1 = down, -1 = up), drives directional reveals
 * - lenis: smooth scroll instance (for programmatic scrolling)
 * - assembly: first visit → the hero is built live by cursors after the intro
 */
export function AppProvider({ ready, lenis, assembly = false, setHeroBusy, children }) {
  const { scrollY } = useScroll()
  const [dir, setDir] = useState(1)
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    const d = v > prev ? 1 : v < prev ? -1 : 0
    if (d !== 0 && d !== dir) setDir(d)
  })
  const value = useMemo(() => ({ ready, dir, lenis, assembly, setHeroBusy }), [ready, dir, lenis, assembly, setHeroBusy])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

export async function scrollToId(id, lenis) {
  // sections below the fold mount on demand (Deferred): build them all before measuring the target
  if (id !== 'top' && window.__blLoadAll) {
    await window.__blLoadAll()
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 60))))
  }
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useLockScroll(locked, lenis) {
  useEffect(() => {
    if (!locked) return
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = prev
    }
  }, [locked, lenis])
}
