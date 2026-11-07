/*
  Hero assembly sound: premium and minimal. Only four moments make a sound, everything else is silent:
    shimmer — the photo appears (airy swell + a barely-there fifth)
    snap    — the copied card snaps onto the photo (glassy "tink")
    press   — DEPLOY is clicked (soft, low, rounded tap)
    chime   — ONLINE ✓ (bell-like chord, FM synthesis)
  All synthesised with the Web Audio API (no files) and sent through a small generated room reverb,
  so nothing sounds dry or "computer-like".

  Browsers only allow sound after a click/tap, so it starts muted on the first visit:
    • the "som" button during the assembly turns it on (remembered: localStorage bl-sound);
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
  let dry = null
  let wet = null
  let on = false
  let noiseBuf = null

  const init = () => {
    if (ctx) return true
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return false
    ctx = window.__blAC || new AC() // may already exist: unlocked synchronously in the click (iPhone)
    window.__blAC = ctx
    const out = ctx.createGain()
    out.gain.value = 1.25
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -9
    comp.ratio.value = 4
    out.connect(comp).connect(ctx.destination)
    // soft room: stereo noise decaying over ~1.6s, darkened
    const len = Math.floor(ctx.sampleRate * 1.6)
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
    }
    const verb = ctx.createConvolver()
    verb.buffer = ir
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 4200
    const wetGain = ctx.createGain()
    wetGain.gain.value = 0.32
    wet = ctx.createGain()
    wet.connect(verb).connect(tone).connect(wetGain).connect(out)
    dry = ctx.createGain()
    dry.connect(out)
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const n = noiseBuf.getChannelData(0)
    for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1
    return true
  }

  const ready = () => on && ctx && ctx.state === 'running'
  // route a node to the dry bus and (a little) to the reverb
  const send = (node, wetAmt = 0.6) => {
    node.connect(dry)
    const g = ctx.createGain()
    g.gain.value = wetAmt
    node.connect(g).connect(wet)
  }
  const adsr = (param, t, a, peak, d, sustain = 0.0001) => {
    param.setValueAtTime(0.0001, t)
    param.exponentialRampToValueAtTime(peak, t + a)
    param.exponentialRampToValueAtTime(Math.max(sustain, 0.0001), t + a + d)
  }

  // FM bell voice: carrier + modulator whose brightness fades as the note rings
  const bell = (f, { t = ctx.currentTime, gain = 0.12, decay = 1.6, ratio = 2, index = 1.4, wetAmt = 0.7 } = {}) => {
    const car = ctx.createOscillator()
    const mod = ctx.createOscillator()
    const modGain = ctx.createGain()
    const amp = ctx.createGain()
    const lp = ctx.createBiquadFilter()
    car.frequency.value = f
    mod.frequency.value = f * ratio
    modGain.gain.setValueAtTime(f * index, t)
    modGain.gain.exponentialRampToValueAtTime(f * 0.02, t + decay * 0.6)
    lp.type = 'lowpass'
    lp.frequency.value = 7000
    adsr(amp.gain, t, 0.006, gain, decay)
    mod.connect(modGain).connect(car.frequency)
    car.connect(lp).connect(amp)
    send(amp, wetAmt)
    car.start(t)
    mod.start(t)
    car.stop(t + decay + 0.1)
    mod.stop(t + decay + 0.1)
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

    // the photo appears: a soft airy swell with a quiet open fifth underneath
    shimmer() {
      if (!ready()) return
      const t = ctx.currentTime
      const src = ctx.createBufferSource()
      src.buffer = noiseBuf
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.Q.value = 0.9
      bp.frequency.setValueAtTime(1800, t)
      bp.frequency.exponentialRampToValueAtTime(6500, t + 0.9)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.075, t + 0.35)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
      src.connect(bp).connect(g)
      send(g, 0.9)
      src.start(t)
      src.stop(t + 1.3)
      for (const f of [440, 659.3]) {
        const o = ctx.createOscillator()
        const a = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = f
        a.gain.setValueAtTime(0.0001, t)
        a.gain.exponentialRampToValueAtTime(0.036, t + 0.4)
        a.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
        o.connect(a)
        send(a, 0.9)
        o.start(t)
        o.stop(t + 1.5)
      }
    },

    // the card snaps onto the photo: glassy "tink"
    snap() {
      if (!ready()) return
      bell(2093, { gain: 0.1, decay: 0.45, ratio: 3.01, index: 0.9, wetAmt: 0.5 })
      bell(3136, { gain: 0.045, decay: 0.3, ratio: 2, index: 0.5, wetAmt: 0.5 })
    },

    // DEPLOY is clicked: soft, low, rounded tap
    press() {
      if (!ready()) return
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      const a = ctx.createGain()
      const lp = ctx.createBiquadFilter()
      o.type = 'sine'
      o.frequency.setValueAtTime(190, t)
      o.frequency.exponentialRampToValueAtTime(95, t + 0.12)
      lp.type = 'lowpass'
      lp.frequency.value = 900
      adsr(a.gain, t, 0.004, 0.16, 0.16)
      o.connect(lp).connect(a)
      send(a, 0.25)
      o.start(t)
      o.stop(t + 0.25)
    },

    // ONLINE ✓: a warm, bell-like Dmaj9 chord, gently rolled
    chime() {
      if (!ready()) return
      const t = ctx.currentTime + 0.02
      ;[587.3, 740, 880, 1318.5].forEach((f, i) => bell(f, { t: t + i * 0.055, gain: 0.1 - i * 0.012, decay: 1.9, ratio: 2, index: 1.1 }))
      bell(293.7, { t, gain: 0.065, decay: 1.6, ratio: 1, index: 0.6 })
    },
  }
}
