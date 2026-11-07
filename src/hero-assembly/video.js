import hero720 from '../assets/hero-video/hero-720.mp4'
import hero480 from '../assets/hero-video/hero-480.mp4'
import hero720webm from '../assets/hero-video/hero-720.webm'
import hero480webm from '../assets/hero-video/hero-480.webm'

/*
  The hero photo coming alive during the assembly (Google Flow / Veo clip, cropped to the photo's 4:5):
    ~2.0s raises a hand   ~3.4s "catches" the copied card (spark)   ~4.0s taps the air (ripple)
    ~4.8s visor LED turns lime   then settles back into the photo's pose.
  It plays over the photo inside the frame and dissolves back into the live photo when it ends.
  Silent, muted, inline; if the browser refuses to play it, the photo simply stays.
*/
export function createHeroVideo(el, { mobile = false } = {}) {
  if (!el) return null
  let stopped = false
  let io = null
  el.muted = true
  el.playsInline = true
  // VP9 WebM where supported (Chrome, Edge, Firefox, Android), H.264 MP4 elsewhere (Safari / iPhone)
  const webm = !!el.canPlayType?.('video/webm; codecs="vp9"')
  el.src = mobile ? (webm ? hero480webm : hero480) : webm ? hero720webm : hero720
  el.preload = 'auto'
  el.load()

  const fade = (to, ms) => el.animate([{ opacity: el.style.opacity || '0' }, { opacity: String(to) }], { duration: ms, easing: 'ease', fill: 'forwards' })

  el.addEventListener('ended', () => {
    if (stopped) return
    const a = fade(0, 800)
    a.finished.then(() => {
      el.style.opacity = '0'
      a.cancel()
    }, () => {})
  })

  const api = {
    // show + play from `offset` seconds (the frame reveal hides the cut)
    start(offset = 0) {
      if (stopped) return
      try {
        el.currentTime = offset
      } catch {}
      el.getAnimations().forEach((a) => a.cancel())
      el.style.opacity = '1'
      const p = el.play()
      if (p) p.catch(() => (el.style.opacity = '0'))
    },
    // resolves once the clip reaches `t` seconds (or after `max` seconds, or if it isn't playing)
    at(t, max = 1.2) {
      return new Promise((res) => {
        if (stopped || el.paused || el.currentTime >= t) return res()
        const t0 = performance.now()
        const check = () => {
          if (stopped || el.paused || el.currentTime >= t || performance.now() - t0 > max * 1000) return res()
          requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
      })
    },
    // phones: the photo is below the fold during the assembly, so it comes alive when scrolled into view
    playWhenVisible(target, offset = 0.3) {
      if (stopped || !target || typeof IntersectionObserver === 'undefined') return
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return
          io.disconnect()
          io = null
          api.start(offset)
        },
        { threshold: 0.6 },
      )
      io.observe(target)
    },
    stop() {
      stopped = true
      io?.disconnect()
      el.pause()
      el.getAnimations().forEach((a) => a.cancel())
      el.style.opacity = '0'
    },
  }
  return api
}
