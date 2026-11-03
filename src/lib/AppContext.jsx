import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

const AppContext = createContext({ ready: true, dir: 1, lenis: null })

/**
 * Global app state:
 * - ready: boot sequence finished (hero entrance waits for it)
 * - dir: scroll direction (1 = down, -1 = up), drives directional reveals
 * - lenis: smooth scroll instance (for programmatic scrolling)
 */
export function AppProvider({ ready, lenis, children }) {
  const { scrollY } = useScroll()
  const [dir, setDir] = useState(1)
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    const d = v > prev ? 1 : v < prev ? -1 : 0
    if (d !== 0 && d !== dir) setDir(d)
  })
  const value = useMemo(() => ({ ready, dir, lenis }), [ready, dir, lenis])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

export function scrollToId(id, lenis) {
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
