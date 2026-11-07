import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'
import LAND from '../assets/globe-land.json' // [lat*10, lon*10, …] land dots (Natural Earth 110m, see README)

/*
  Dotted globe (Canvas 2D, orthographic projection, no 3D library).
  - auto-rotates slowly; drag (mouse or finger) to spin it, with inertia;
  - "touch" effect: the land dots near the cursor are pushed away like sand and spring back
    (each dot has its own offset + velocity); displaced dots light up and grow;
  - a pulsing "you are here" marker in Rio de Janeiro and light arcs travelling to cities on every
    continent (reach of an online service — not client locations); labels only on the facing side;
  - runs only while visible and the tab is active; reduced motion = still frame.
*/

const RAD = Math.PI / 180
const HOME = { lat: -22.9, lon: -43.1 } // Rio de Janeiro (Niterói)
const CYAN = '0,240,255'
const MAGENTA = '224,64,216'

const toVec = (lat, lon) => {
  const la = lat * RAD
  const lo = lon * RAD
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
}

// great-circle points between two lat/lon pairs, lifted above the surface in the middle
function arcPoints(a, b, steps = 48) {
  const A = toVec(a.lat, a.lon)
  const B = toVec(b.lat, b.lon)
  const dot = Math.min(1, Math.max(-1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))
  const om = Math.acos(dot)
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const s1 = Math.sin((1 - t) * om) / Math.sin(om)
    const s2 = Math.sin(t * om) / Math.sin(om)
    const lift = 1 + Math.sin(Math.PI * t) * (0.12 + om * 0.1)
    pts.push([(A[0] * s1 + B[0] * s2) * lift, (A[1] * s1 + B[1] * s2) * lift, (A[2] * s1 + B[2] * s2) * lift])
  }
  return pts
}

export default function DotGlobe({ targets = [], className = '', hint }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const c = canvasRef.current
    if (!wrap || !c) return
    const ctx = c.getContext('2d')

    const dots = []
    for (let i = 0; i < LAND.length; i += 2) dots.push(toVec(LAND[i] / 10, LAND[i + 1] / 10))
    // per-dot spring state for the cursor "touch" (screen-space offset + velocity)
    const N = dots.length
    const ox = new Float32Array(N)
    const oy = new Float32Array(N)
    const vx = new Float32Array(N)
    const vy = new Float32Array(N)
    const TOUCH_R = 90 // px
    const TOUCH_F = 38
    const home = toVec(HOME.lat, HOME.lon)
    const arcs = targets.map((t, i) => ({ ...t, pts: arcPoints(HOME, t), end: toVec(t.lat, t.lon), phase: i / Math.max(1, targets.length) }))

    const S = { w: 0, h: 0, dpr: 1, r: 0, cx: 0, cy: 0 }
    // start facing Brazil
    const st = { lon: HOME.lon * RAD, lat: -12 * RAD, vLon: 0, vLat: 0, drag: null, t: 0, auto: 1, ptr: null }

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      S.dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      S.w = r.width
      S.h = r.height
      c.width = Math.round(r.width * S.dpr)
      c.height = Math.round(r.height * S.dpr)
      S.r = Math.min(S.w, S.h) * 0.44
      S.cx = S.w / 2
      S.cy = S.h / 2
    }

    // rotate a unit vector by the current view (yaw = -lon, pitch = lat) and project
    const project = (v) => {
      const lon = st.lon
      const lat = st.lat
      const cl = Math.cos(-lon)
      const sl = Math.sin(-lon)
      const x1 = v[0] * cl + v[2] * sl
      const z1 = -v[0] * sl + v[2] * cl
      const cp = Math.cos(lat)
      const sp = Math.sin(lat)
      const y2 = v[1] * cp - z1 * sp
      const z2 = v[1] * sp + z1 * cp
      return [S.cx + x1 * S.r, S.cy - y2 * S.r, z2]
    }

    const draw = () => {
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0)
      ctx.clearRect(0, 0, S.w, S.h)
      const { cx, cy, r } = S

      // atmosphere + body
      const atm = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.25)
      atm.addColorStop(0, `rgba(${CYAN},0.16)`)
      atm.addColorStop(1, `rgba(${CYAN},0)`)
      ctx.fillStyle = atm
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2)
      ctx.fill()
      const body = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r)
      body.addColorStop(0, 'rgba(14,40,58,0.95)')
      body.addColorStop(1, 'rgba(7,10,18,0.98)')
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = `rgba(${CYAN},0.35)`
      ctx.lineWidth = 1
      ctx.stroke()

      // land dots (front hemisphere bright, back faint) + cursor touch physics
      const size = Math.max(0.9, r / 190)
      const P = st.ptr
      const R2 = TOUCH_R * TOUCH_R
      for (let i = 0; i < N; i++) {
        const [x, y, z] = project(dots[i])
        // spring back towards rest, damped
        vx[i] = (vx[i] - ox[i] * 0.08) * 0.78
        vy[i] = (vy[i] - oy[i] * 0.08) * 0.78
        if (P && z > 0) {
          const dx = x + ox[i] - P.x
          const dy = y + oy[i] - P.y
          const d2 = dx * dx + dy * dy
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / TOUCH_R) * TOUCH_F * 0.18
            vx[i] += (dx / d) * f
            vy[i] += (dy / d) * f
          }
        }
        ox[i] += vx[i]
        oy[i] += vy[i]
        if (z < -0.15) continue
        const k = Math.min(1, Math.hypot(ox[i], oy[i]) / 30)
        const a = z > 0 ? 0.25 + z * 0.75 : 0.06
        const s = size * (z > 0 ? 0.7 + z * 0.5 : 0.6) * (1 + k * 0.9)
        ctx.fillStyle = k > 0.15 ? `rgba(200,255,255,${Math.min(1, a + 0.2).toFixed(3)})` : `rgba(${CYAN},${a.toFixed(3)})`
        ctx.fillRect(x + ox[i] - s / 2, y + oy[i] - s / 2, s, s)
      }

      // arcs with a travelling pulse
      ctx.lineCap = 'round'
      for (const A of arcs) {
        const P = A.pts.map(project)
        ctx.strokeStyle = `rgba(${A.magenta ? MAGENTA : CYAN},0.35)`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        let started = false
        for (const [x, y, z] of P) {
          if (z < -0.05) {
            started = false
            continue
          }
          started ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
          started = true
        }
        ctx.stroke()
        const k = ((st.t * 0.32 + A.phase) % 1) * (P.length - 1)
        const [px, py, pz] = P[Math.floor(k)]
        if (pz > -0.05) {
          ctx.fillStyle = `rgba(${A.magenta ? MAGENTA : CYAN},0.25)`
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#EFFFFF'
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fill()
        }
        // end point + label
        const [ex, ey, ez] = project(A.end)
        if (ez > 0.05) {
          ctx.fillStyle = `rgba(${A.magenta ? MAGENTA : CYAN},0.95)`
          ctx.beginPath()
          ctx.arc(ex, ey, 3, 0, Math.PI * 2)
          ctx.fill()
          if (A.label && ez > 0.3) {
            ctx.font = '600 10px "JetBrains Mono", monospace'
            ctx.fillStyle = `rgba(232,247,250,${Math.min(1, (ez - 0.3) * 2.2).toFixed(2)})`
            ctx.fillText(A.label, ex + 7, A.below ? ey + 14 : ey - 6)
          }
        }
      }

      // home marker (live)
      const [hx, hy, hz] = project(home)
      if (hz > 0) {
        const pulse = (st.t * 0.9) % 1
        ctx.strokeStyle = `rgba(255,230,0,${(1 - pulse) * 0.8})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(hx, hy, 4 + pulse * 18, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#FFE600'
        ctx.shadowColor = '#FFE600'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(hx, hy, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.font = '600 11px "JetBrains Mono", monospace'
        ctx.fillStyle = 'rgba(255,230,0,0.95)'
        ctx.fillText('RIO DE JANEIRO', hx + 10, hy - 6)
      }
    }

    const step = (dt) => {
      st.t += dt
      if (!st.drag) {
        // inertia, then ease back to a slow auto-rotation
        st.vLon *= Math.pow(0.05, dt)
        st.vLat *= Math.pow(0.05, dt)
        st.lon += (st.vLon + 0.12 * st.auto) * dt
        st.lat += st.vLat * dt
        st.lat += (-12 * RAD - st.lat) * Math.min(1, dt * 0.6) // drift back to a pleasant tilt
      }
      st.lat = Math.max(-1.2, Math.min(1.2, st.lat))
    }

    let raf = 0
    let last = 0
    let visible = false
    const tick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      step(dt)
      draw()
      raf = requestAnimationFrame(tick)
    }
    const run = () => {
      if (raf || reduce || document.hidden || !visible) return
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!raf) draw()
    })
    ro.observe(wrap)
    resize()
    draw()
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? run() : stop()
    })
    io.observe(wrap)
    const onVis = () => (document.hidden ? stop() : run())
    document.addEventListener('visibilitychange', onVis)

    // cursor / finger position inside the globe (drives the touch effect)
    const local = (e) => {
      const r = wrap.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const hover = (e) => {
      st.ptr = local(e)
    }
    const leave = () => {
      st.ptr = null
    }
    wrap.addEventListener('pointermove', hover, { passive: true })
    wrap.addEventListener('pointerleave', leave)

    // drag to spin
    const down = (e) => {
      st.drag = { x: e.clientX, y: e.clientY, t: performance.now() }
      st.vLon = st.vLat = 0
      wrap.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!st.drag) return
      const now = performance.now()
      const dx = e.clientX - st.drag.x
      const dy = e.clientY - st.drag.y
      const k = 1 / S.r
      st.lon -= dx * k
      st.lat += dy * k
      const dts = Math.max(0.008, (now - st.drag.t) / 1000)
      st.vLon = (-dx * k) / dts
      st.vLat = (dy * k) / dts
      st.drag = { x: e.clientX, y: e.clientY, t: now }
      if (reduce || !raf) draw()
    }
    const up = () => {
      st.drag = null
    }
    wrap.addEventListener('pointerdown', down)
    wrap.addEventListener('pointermove', move)
    wrap.addEventListener('pointerup', up)
    wrap.addEventListener('pointercancel', up)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      wrap.removeEventListener('pointermove', hover)
      wrap.removeEventListener('pointerleave', leave)
      wrap.removeEventListener('pointerdown', down)
      wrap.removeEventListener('pointermove', move)
      wrap.removeEventListener('pointerup', up)
      wrap.removeEventListener('pointercancel', up)
    }
  }, [reduce, targets])

  return (
    <div ref={wrapRef} className={`relative cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`} data-cursor>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {hint && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[10.5px] uppercase tracking-[0.24em] text-cyan/55">
          {hint}
        </span>
      )}
    </div>
  )
}
