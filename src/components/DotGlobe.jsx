import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'
import LAND from '../assets/globe-land.json' // [lat*10, lon*10, …] land dots (Natural Earth 110m, see README)

/*
  Dotted globe (Canvas 2D, orthographic projection, no 3D library).
  - auto-rotates slowly and turns/tilts towards the cursor wherever it moves on the page;
  - drag (mouse or finger) to spin it, with inertia;
  - a pulsing "you are here" marker in Rio de Janeiro and light arcs travelling to the regions served
    in each language (PT / EN / ES) — these mark languages, not clients;
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
    const home = toVec(HOME.lat, HOME.lon)
    const arcs = targets.map((t, i) => ({ ...t, pts: arcPoints(HOME, t), end: toVec(t.lat, t.lon), phase: i / Math.max(1, targets.length) }))

    const S = { w: 0, h: 0, dpr: 1, r: 0, cx: 0, cy: 0 }
    // start facing Brazil
    const st = { lon: HOME.lon * RAD, lat: -12 * RAD, vLon: 0, vLat: 0, drag: null, t: 0, auto: 1, offLon: 0, offLat: 0, tgtLon: 0, tgtLat: 0 }

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
      const lon = st.lon + st.offLon
      const lat = st.lat + st.offLat
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

      // land dots (front hemisphere bright, back faint)
      const size = Math.max(0.9, r / 190)
      for (const v of dots) {
        const [x, y, z] = project(v)
        if (z < -0.15) continue
        const a = z > 0 ? 0.25 + z * 0.75 : 0.06
        ctx.fillStyle = `rgba(${CYAN},${a.toFixed(3)})`
        const s = size * (z > 0 ? 0.7 + z * 0.5 : 0.6)
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
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
          if (A.label) {
            ctx.font = '600 11px "JetBrains Mono", monospace'
            ctx.fillStyle = `rgba(232,247,250,${(0.45 + ez * 0.55).toFixed(2)})`
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
      // follow the cursor (eased)
      st.offLon += (st.tgtLon - st.offLon) * Math.min(1, dt * 3)
      st.offLat += (st.tgtLat - st.offLat) * Math.min(1, dt * 3)
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

    // follow the cursor anywhere on the page: the globe turns towards it
    const follow = (e) => {
      if (e.pointerType === 'touch' || st.drag) return
      const r = wrap.getBoundingClientRect()
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)))
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5)))
      st.tgtLon = -nx * 0.9
      st.tgtLat = ny * 0.45
    }
    window.addEventListener('pointermove', follow, { passive: true })

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
      window.removeEventListener('pointermove', follow)
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
