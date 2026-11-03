import { Suspense, useEffect, useRef, useState } from 'react'
import { isBot } from '../lib/bot'

/*
  Performance (TBT/INP): sections below the first screen are only mounted when the visitor is
  about to reach them. Nothing below the fold is built during the initial load:
  - observing starts on the first real interaction (scroll, wheel, touch, key);
  - a section mounts when it gets within ~1 screen of the viewport;
  - menu/anchor navigation mounts everything first (see scrollToId);
  - robots get everything immediately (SEO).
*/
let started = false
let all = false
const START_EVENTS = ['scroll', 'wheel', 'touchstart', 'keydown', 'pointerdown']

function onStart(cb) {
  if (started) return cb(), () => {}
  const go = () => {
    started = true
    START_EVENTS.forEach((e) => window.removeEventListener(e, go))
    window.dispatchEvent(new Event('bl:start'))
  }
  START_EVENTS.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }))
  window.addEventListener('bl:start', cb, { once: true })
  return () => window.removeEventListener('bl:start', cb)
}

export function mountAllSections() {
  all = true
  window.dispatchEvent(new Event('bl:mount-all'))
}

function Mounted() {
  // tells listeners (header active link, floating button…) that new sections exist in the DOM
  useEffect(() => {
    window.dispatchEvent(new Event('bl:section-mounted'))
  }, [])
  return null
}

export default function Deferred({ children, placeholder = '100vh' }) {
  const [on, setOn] = useState(() => all || isBot() || (typeof location !== 'undefined' && location.hash.length > 1))
  const ref = useRef(null)

  useEffect(() => {
    if (on) return
    const show = () => setOn(true)
    window.addEventListener('bl:mount-all', show)
    let io
    const stop = onStart(() => {
      io = new IntersectionObserver(([e]) => e.isIntersecting && show(), { rootMargin: '100% 0px' })
      if (ref.current) io.observe(ref.current)
    })
    return () => {
      window.removeEventListener('bl:mount-all', show)
      stop()
      io?.disconnect()
    }
  }, [on])

  const ph = <div ref={ref} aria-hidden="true" style={{ minHeight: placeholder }} />
  if (!on) return ph
  return (
    <Suspense fallback={<div aria-hidden="true" style={{ minHeight: placeholder }} />}>
      {children}
      <Mounted />
    </Suspense>
  )
}
