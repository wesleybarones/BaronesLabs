/*
  Sci-fi interface sounds for the hero assembly, synthesised with the Web Audio API (no audio files).
  Browsers only allow sound after a click/tap, so it starts muted on the first visit:
    • the "som" button during the assembly turns it on (the choice is remembered: localStorage bl-sound);
    • "↻ Rever montagem" is a click, so the replay plays with sound unless the visitor turned it off.
*/
const KEY = 'bl-sound'

export const soundPref = () => {
  try {
    return localStorage.getItem(KEY) // '1' on, '0' off, null never chosen
  } catch {
    return null
  }
}

export function createSound() {
  let ctx = null
  let master = null
  let on = false
  let noiseBuf = null
  let lastKey = 0

  const init = () => {
    if (ctx) return true
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    ctx = window.__blAC || new AC() // may already exist: unlocked synchronously in the click (iPhone)
    window.__blAC = ctx
    master = ctx.createGain()
    master.gain.value = 0.32
    // gentle limiter so overlapping cues never clip
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 6
    master.connect(comp).connect(ctx.destination)
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    return true
  }

  const ready = () => on && ctx && ctx.state === 'running'

  // ── building blocks ──
  const env = (g, t, a, peak, dec) => {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + a)
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec)
  }
  const tone = (type, f0, f1, dur, peak = 0.3, delay = 0, a = 0.004) => {
    const t = ctx.currentTime + delay
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(f0, t)
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur)
    env(g, t, a, peak, dur)
    o.connect(g).connect(master)
    o.start(t)
    o.stop(t + a + dur + 0.05)
  }
  const noise = (dur, peak, fType, f0, f1 = f0, q = 1, delay = 0, a = 0.003) => {
    const t = ctx.currentTime + delay
    const src = ctx.createBufferSource()
    src.buffer = noiseBuf
    const f = ctx.createBiquadFilter()
    f.type = fType
    f.Q.value = q
    f.frequency.setValueAtTime(f0, t)
    if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur)
    const g = ctx.createGain()
    env(g, t, a, peak, dur)
    src.connect(f).connect(g).connect(master)
    src.start(t, Math.random() * 0.3)
    src.stop(t + a + dur + 0.05)
  }

  return {
    get on() {
      return on
    },
    /** call from a click/tap; `remember` stores the choice */
    enable(remember = true) {
      if (!init()) return false
      on = true
      ctx.resume?.()
      if (remember)
        try {
          localStorage.setItem(KEY, '1')
        } catch {}
      return true
    },
    disable(remember = true) {
      on = false
      if (remember)
        try {
          localStorage.setItem(KEY, '0')
        } catch {}
    },

    // ── cues ──
    key() {
      // soft mechanical key, slightly different each time (throttled: one per 30ms)
      if (!ready()) return
      const now = performance.now()
      if (now - lastKey < 30) return
      lastKey = now
      noise(0.03, 0.22, 'bandpass', 2600 + Math.random() * 1800, undefined, 2.5)
      tone('square', 180 + Math.random() * 60, 120, 0.02, 0.04)
    },
    tick() {
      if (!ready()) return
      tone('sine', 1900, 1500, 0.05, 0.16)
    },
    pop() {
      if (!ready()) return
      tone('sine', 520, 980, 0.08, 0.22)
      noise(0.02, 0.06, 'highpass', 4000)
    },
    click() {
      if (!ready()) return
      tone('sine', 160, 70, 0.09, 0.35)
      noise(0.015, 0.18, 'highpass', 3000)
    },
    scan(dur = 0.9) {
      // electric trace along the outline / progress bar
      if (!ready()) return
      tone('sawtooth', 220, 660, dur, 0.035, 0, 0.05)
      noise(dur, 0.05, 'bandpass', 800, 3200, 4, 0, 0.05)
    },
    whoosh(dur = 0.7) {
      if (!ready()) return
      noise(dur, 0.22, 'bandpass', 300, 2600, 1.4, 0, dur * 0.45)
    },
    snap() {
      if (!ready()) return
      tone('square', 240, 110, 0.05, 0.12)
      noise(0.025, 0.25, 'highpass', 2500)
      tone('sine', 1400, 1400, 0.12, 0.12, 0.03)
    },
    chime() {
      // ONLINE ✓: bright rising triad
      if (!ready()) return
      ;[1046.5, 1318.5, 1568, 2093].forEach((f, i) => {
        tone('triangle', f, f, 0.7, 0.16, i * 0.07, 0.01)
        tone('sine', f * 2, f * 2, 0.4, 0.03, i * 0.07, 0.01)
      })
    },
  }
}
