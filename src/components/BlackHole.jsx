import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'

/*
  Interactive black hole (Canvas 2D, no library).
  - accretion disk of particles orbiting a black event horizon, with a photon ring and the
    "lensed" arc of the far side bent over the top;
  - hover: the disk tilts with the pointer, spins faster and the pointer sheds dust that spirals in;
  - click / tap: the hole swallows everything (pulse + shockwave), then the disk rebuilds.
  The loop runs only while it is on screen and the tab is visible; reduced motion = one still frame.
*/

const CYAN = [0, 240, 255]
const MAGENTA = [224, 64, 216]
const WHITE = [235, 255, 255]

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

export default function BlackHole({ className = '', label, start = true }) {
  const reduce = useReducedMotion()
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const c = canvasRef.current
    if (!wrap || !c || !start) return
    const ctx = c.getContext('2d')
    const small = window.matchMedia('(max-width: 767px)').matches
    const COUNT = small ? 260 : 520

    const S = { w: 0, h: 0, dpr: 1, R: 0, outer: 0, cx: 0, cy: 0 }
    const st = {
      t: 0,
      hover: 0, // 0..1 eased
      hoverTarget: 0,
      tilt: 0.3, // disk inclination (y scale)
      tiltTarget: 0.3,
      px: 0,
      py: 0,
      pulse: 0, // 1 → 0 after a click
      shock: -1, // shockwave radius progress (−1 = none)
      collapse: 0, // 1 → 0: disk swallowed, then rebuilds
    }

    const parts = []
    const spawn = (p, outerOnly) => {
      const rMin = S.R * 1.35
      const rr = outerOnly ? S.outer * (0.75 + Math.random() * 0.25) : rMin + Math.pow(Math.random(), 0.7) * (S.outer - rMin)
      p.r = rr
      p.a = Math.random() * Math.PI * 2
      p.size = 0.6 + Math.random() * 1.4
      p.hue = Math.random()
      p.dust = false
      p.life = 1
      return p
    }
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      S.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      S.w = r.width
      S.h = r.height
      c.width = Math.round(r.width * S.dpr)
      c.height = Math.round(r.height * S.dpr)
      S.cx = S.w / 2
      S.cy = S.h / 2
      S.R = Math.min(S.w, S.h) * 0.12
      S.outer = Math.min(S.w * 0.47, S.h * 1.2)
      if (!parts.length) for (let i = 0; i < COUNT; i++) parts.push(spawn({}, false))
      else parts.forEach((p) => spawn(p, false))
    }

    const project = (p, tilt) => [S.cx + Math.cos(p.a) * p.r, S.cy + Math.sin(p.a) * p.r * tilt]
    const colorOf = (p) => {
      const k = Math.min(1, Math.max(0, (p.r - S.R) / (S.outer - S.R)))
      // hot white near the horizon → cyan → magenta at the edge
      const base = k < 0.25 ? mix(WHITE, CYAN, k / 0.25) : mix(CYAN, MAGENTA, Math.min(1, (k - 0.25) / 0.75) * (0.4 + p.hue * 0.6))
      return [base, 1 - k * 0.55]
    }

    const step = (dt) => {
      st.t += dt
      st.hover += (st.hoverTarget - st.hover) * Math.min(1, dt * 4)
      st.tilt += (st.tiltTarget - st.tilt) * Math.min(1, dt * 3)
      st.pulse = Math.max(0, st.pulse - dt * 1.4)
      st.collapse = Math.max(0, st.collapse - dt * 0.55)
      if (st.shock >= 0) st.shock = st.shock + dt * 1.6 > 1 ? -1 : st.shock + dt * 1.6
      const spin = 1 + st.hover * 0.9 + st.pulse * 2.5
      for (const p of parts) {
        const omega = (2.2 * Math.pow(S.R * 2.2, 1.5)) / Math.pow(p.r, 1.5)
        p.a += omega * dt * spin
        const inflow = (p.dust ? 38 : 4) + st.collapse * st.collapse * 1400 + st.pulse * 30
        p.r -= inflow * dt * (S.R * 2.2) / p.r
        if (p.r < S.R * 1.04) spawn(p, st.collapse > 0.15) // while swallowing, matter re-enters from the edge
      }
      // pointer sheds dust that spirals in
      if (st.hover > 0.2 && Math.random() < 0.6) {
        const p = parts[(Math.random() * parts.length) | 0]
        const dx = st.px - S.cx
        const dy = (st.py - S.cy) / Math.max(0.15, st.tilt)
        p.r = Math.max(S.R * 1.6, Math.min(S.outer, Math.hypot(dx, dy)))
        p.a = Math.atan2(dy, dx)
        p.dust = true
        p.size = 1.2 + Math.random()
      }
    }

    const draw = () => {
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0)
      ctx.clearRect(0, 0, S.w, S.h)
      const R = S.R * (1 + st.pulse * 0.18)
      const tilt = st.tilt

      // faint glow of the disk plane
      const halo = ctx.createRadialGradient(S.cx, S.cy, R, S.cx, S.cy, S.outer)
      halo.addColorStop(0, `rgba(0,240,255,${0.10 + st.hover * 0.08})`)
      halo.addColorStop(1, 'rgba(0,240,255,0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.ellipse(S.cx, S.cy, S.outer, S.outer * Math.max(0.2, tilt) * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = 'lighter'
      const drawParts = (back) => {
        for (const p of parts) {
          const far = Math.sin(p.a) < 0
          if (far !== back) continue
          const [x, y] = project(p, tilt)
          const [col, a] = colorOf(p)
          const tailA = p.a - 0.12 * (1 + st.hover)
          const tx = S.cx + Math.cos(tailA) * p.r
          const ty = S.cy + Math.sin(tailA) * p.r * tilt
          ctx.strokeStyle = rgba(col, a * (back ? 0.55 : 0.9) * (p.dust ? 1 : 0.8))
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
      }
      drawParts(true)

      // lensed far side of the disk, bent over the top of the horizon
      ctx.lineWidth = 2
      for (let i = 0; i < 3; i++) {
        const k = 1.25 + i * 0.12
        ctx.strokeStyle = rgba(i === 1 ? MAGENTA : CYAN, (0.32 - i * 0.08) * (1 + st.hover * 0.6))
        ctx.beginPath()
        ctx.ellipse(S.cx, S.cy, R * (k + 0.25), R * k, 0, Math.PI, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'

      // event horizon + photon ring
      const core = ctx.createRadialGradient(S.cx, S.cy, R * 0.2, S.cx, S.cy, R * 1.35)
      core.addColorStop(0, '#000')
      core.addColorStop(0.72, '#000')
      core.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(S.cx, S.cy, R * 1.35, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'lighter'
      for (const [w, a] of [
        [7, 0.08],
        [3, 0.25],
        [1.2, 0.85],
      ]) {
        ctx.strokeStyle = rgba(CYAN, a * (0.8 + st.hover * 0.4 + st.pulse))
        ctx.lineWidth = w
        ctx.beginPath()
        ctx.arc(S.cx, S.cy, R * 1.02, 0, Math.PI * 2)
        ctx.stroke()
      }
      drawParts(false)

      // shockwave after a click
      if (st.shock >= 0) {
        const sr = R + st.shock * S.outer * 1.1
        ctx.strokeStyle = rgba(st.shock < 0.5 ? CYAN : MAGENTA, (1 - st.shock) * 0.7)
        ctx.lineWidth = 2.5 * (1 - st.shock) + 0.5
        ctx.beginPath()
        ctx.ellipse(S.cx, S.cy, sr, sr * Math.max(0.35, tilt * 1.4), 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    // loop only while visible
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
    if (reduce) {
      for (let i = 0; i < 60; i++) step(1 / 30)
      draw()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? run() : stop()
    })
    io.observe(wrap)
    const onVis = () => (document.hidden ? stop() : run())
    document.addEventListener('visibilitychange', onVis)

    // interaction
    const local = (e) => {
      const r = wrap.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const onMove = (e) => {
      const [x, y] = local(e)
      st.px = x
      st.py = y
      st.hoverTarget = 1
      // pointer above the hole → see the disk more face-on; below → more edge-on
      st.tiltTarget = 0.18 + Math.min(1, Math.max(0, y / S.h)) * 0.42
    }
    const onLeave = () => {
      st.hoverTarget = 0
      st.tiltTarget = 0.3
    }
    const onDown = (e) => {
      onMove(e)
      st.pulse = 1
      st.shock = 0
      st.collapse = 1
      if (reduce) draw()
    }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerenter', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('pointerdown', onDown)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerenter', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onDown)
    }
  }, [reduce, start])

  return (
    <div ref={wrapRef} className={`relative cursor-pointer touch-manipulation select-none ${className}`} role="img" aria-label={label}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {label && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-cyan/55">
          {label}
        </span>
      )}
    </div>
  )
}
