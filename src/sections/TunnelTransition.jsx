import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { useReducedMotion } from '../lib/hooks'

/*
  Solution → Audience: a gentle, continuous flight through a 3D tunnel of hexagonal circuit rings.
  Time-driven (not scroll-driven); the loop runs only while the tunnel is on screen and the tab is
  visible. Canvas 2D with a manual perspective projection — no 3D library.
*/

const RINGS = 28 // rings along the tunnel
const SPACING = 1 // world distance between rings
const FOCAL = 1.15
const SPEED = 0.9 // world units per second

const CYAN = [0, 240, 255]
const MAGENTA = [224, 64, 216]

export default function TunnelTransition() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const state = useRef({ time: 0, w: 0, h: 0, dpr: 1, raf: 0 })

  const draw = () => {
    const st = state.current
    st.raf = 0
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const { w, h, dpr } = st
    const time = st.time
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const cx = w / 2
    const cy = h / 2
    const unit = Math.min(w, h) * 0.55
    const cam = time * SPEED
    const twist = time * 0.07

    // project the 6 vertices of every ring in front of the camera
    const rings = []
    for (let i = 0; i < RINGS; i++) {
      const z = i * SPACING - (cam % SPACING) // rings recycle so the tunnel never ends
      const idx = i + Math.floor(cam / SPACING)
      if (z <= 0.05) continue
      const s = (FOCAL / z) * unit
      const rot = ((z + cam) / SPACING) * 0.09 + twist
      const pts = []
      for (let k = 0; k < 6; k++) {
        const a = rot + (k * Math.PI) / 3 + Math.PI / 6
        pts.push([cx + Math.cos(a) * s, cy + Math.sin(a) * s * 0.92])
      }
      rings.push({ z, idx, pts })
    }

    const fog = (z) => Math.max(0, Math.min(1, 1 - z / (RINGS * SPACING * 0.85)))
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

    ctx.lineCap = 'round'
    // longitudinal rails (vertex k of ring i → vertex k of ring i+1)
    for (let r = 0; r < rings.length - 1; r++) {
      const A = rings[r]
      const B = rings[r + 1]
      const a = fog(A.z) * 0.35
      ctx.strokeStyle = rgba(CYAN, a)
      ctx.lineWidth = Math.max(0.6, 1.6 * fog(A.z))
      ctx.beginPath()
      for (let k = 0; k < 6; k++) {
        ctx.moveTo(A.pts[k][0], A.pts[k][1])
        ctx.lineTo(B.pts[k][0], B.pts[k][1])
      }
      ctx.stroke()
    }
    // rings (every 6th one magenta, like the logo's shadow)
    for (const R of rings) {
      const f = fog(R.z)
      const col = R.idx % 6 === 0 ? MAGENTA : CYAN
      for (const [lw, al] of [
        [6, 0.06],
        [2.2, 0.5],
      ]) {
        ctx.strokeStyle = rgba(col, al * f)
        ctx.lineWidth = lw * Math.max(0.35, f)
        ctx.beginPath()
        R.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
        ctx.closePath()
        ctx.stroke()
      }
    }
    // data packets running along the rails
    for (let k = 0; k < 6; k++) {
      for (let n = 0; n < 2; n++) {
        const zz = ((k * 3.7 + n * 9.1 - cam * (1.6 + k * 0.15)) % (RINGS * SPACING) + RINGS * SPACING) % (RINGS * SPACING)
        if (zz < 0.3) continue
        const s = (FOCAL / zz) * unit
        const a = ((zz + cam) / SPACING) * 0.09 + twist + (k * Math.PI) / 3 + Math.PI / 6
        const x = cx + Math.cos(a) * s
        const y = cy + Math.sin(a) * s * 0.92
        const f = fog(zz)
        const col = (k + n) % 3 === 0 ? MAGENTA : CYAN
        const rad = Math.max(1, 5 * (FOCAL / zz)) * Math.max(0.4, f)
        ctx.fillStyle = rgba(col, 0.18 * f)
        ctx.beginPath()
        ctx.arc(x, y, rad * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = rgba([235, 255, 255], 0.9 * f)
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // light at the end of the tunnel
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.5)
    g.addColorStop(0, `rgba(0,240,255,${0.26 + Math.sin(time * 0.8) * 0.06})`)
    g.addColorStop(1, 'rgba(0,240,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

  }

  const schedule = () => {
    if (!state.current.raf) state.current.raf = requestAnimationFrame(draw)
  }

  // continuous flight while visible (one static frame for reduced motion)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let visible = false
    let loop = 0
    let last = 0
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      state.current.time += dt
      draw()
      loop = requestAnimationFrame(tick)
    }
    const start = () => {
      if (loop || reduce || document.hidden || !visible) return
      last = 0
      loop = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(loop)
      loop = 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    if (reduce) {
      state.current.time = 4
      schedule()
    }
    return () => {
      io.disconnect()
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduce]) // eslint-disable-line

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => {
      const r = c.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      Object.assign(state.current, { w: r.width, h: r.height, dpr })
      c.width = Math.round(r.width * dpr)
      c.height = Math.round(r.height * dpr)
      schedule()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    resize()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(state.current.raf)
    }
  }, []) // eslint-disable-line

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative -my-[6vh] h-[72vh] overflow-hidden md:h-[86vh]"
      // edges dissolve into the page background, so the sections above and below blend into the tunnel
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%)',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="glass border border-cyan/40 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.24em] text-cyan">
          {t.tunnel.label}
        </span>
      </div>
    </div>
  )
}
