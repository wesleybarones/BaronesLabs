import { animate } from 'motion/react'

/*
  "O site que se constrói sozinho": the hero is assembled live by four cursors.
    W.BARONES   selects a proof, copies it (Ctrl+C) and drags the copy onto the photo (magenta guides, snap)
    UI.BOT      draws the neon outline of the photo and drops the HUD chips
    COPY.BOT    types the headline letter by letter, then brings in the text, buttons and proofs
    DEPLOY.BOT  clicks the main button: status "AGUARDANDO DEPLOY_" scrambles into ONLINE, bar fills
  Desktop ≈ 6s with 4 cursors; phones ≈ 3.7s with 2 cursors and no long drag.

  It runs only on the first visit (after the LED intro) or from "↻ Rever montagem"; bots and
  reduced-motion users never see it. The final state is exactly the page's own HTML: this module only
  hides things for a moment (visibility / opacity / transform) and puts every node back when it ends
  or is skipped. Elements are found by id inside the hero; a missing id just skips that step.
*/

const CURSORS = {
  wesley: { name: 'W.BARONES', color: '#D4FF24' },
  ui: { name: 'UI.BOT', color: '#00F0FF' },
  copy: { name: 'COPY.BOT', color: '#E040D8' },
  deploy: { name: 'DEPLOY.BOT', color: '#E8F7FA' },
}
const EASE = [0.65, 0, 0.35, 1]
const OUT = [0.22, 1, 0.36, 1]
const CANCEL = { cancelled: true }
const GLYPHS = '#%&@$*+=<>/\\|01'

const defer = () => {
  let resolve
  const p = new Promise((r) => (resolve = r))
  p.resolve = resolve
  return p
}

export function createAssembly({ root, layer, mobile = false, labels = {}, video = null, sound = null }) {
  const $ = (sel) => root.querySelector(sel)
  const $$ = (sel) => [...root.querySelectorAll(sel)]
  const L = {
    waiting: 'AGUARDANDO DEPLOY_',
    deploying: 'DEPLOY',
    online: 'ONLINE ✓',
    ...labels,
  }

  const live = new Set()
  const timers = new Set()
  const hidden = []
  let cancelled = false
  let finished = false
  let typed = null // title text nodes swapped for letter spans
  let statusFinal = null
  const done = defer()

  // ── plumbing ───────────────────────────────────────────────
  const guard = () => {
    if (cancelled) throw CANCEL
  }
  const fin = (a) => {
    live.add(a)
    const p = a.finished ? a.finished : Promise.resolve(a)
    return p.then(guard, () => {
      throw CANCEL
    })
  }
  const wait = (s) =>
    new Promise((res) => {
      const id = setTimeout(() => {
        timers.delete(id)
        res()
      }, s * 1000)
      timers.add(id)
    }).then(guard)
  const later = (s, fn) => {
    const id = setTimeout(() => {
      timers.delete(id)
      if (!cancelled) fn()
    }, s * 1000)
    timers.add(id)
  }
  const mk = (cls, parent = layer) => {
    const el = document.createElement('div')
    el.className = cls
    parent.appendChild(el)
    return el
  }
  // geometry in layer coordinates (the layer covers the hero section)
  const box = (el) => {
    const r = el.getBoundingClientRect()
    const o = layer.getBoundingClientRect()
    return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height }
  }
  const pt = (el, ax = 0.5, ay = 0.5) => {
    const b = box(el)
    return [b.x + b.w * ax, b.y + b.h * ay]
  }
  const setBox = (el, b, pad = 0) =>
    Object.assign(el.style, {
      left: `${b.x - pad}px`,
      top: `${b.y - pad}px`,
      width: `${b.w + pad * 2}px`,
      height: `${b.h + pad * 2}px`,
    })

  // ── hide / reveal page elements (only visibility + opacity/translate/scale) ──
  const hide = (el) => {
    if (!el || el.style.visibility === 'hidden') return
    el.style.visibility = 'hidden'
    hidden.push(el)
  }
  const reveal = (el, { d = 0.45, dy = 12, scale = 1, delay = 0 } = {}) => {
    if (!el) return Promise.resolve()
    el.style.visibility = ''
    const a = el.animate(
      [
        { opacity: 0, translate: `0 ${dy}px`, scale: String(scale) },
        { opacity: 1, translate: '0 0', scale: '1' },
      ],
      { duration: d * 1000, delay: delay * 1000, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'backwards' },
    )
    return fin(a)
  }

  // ── cursors ────────────────────────────────────────────────
  const cursors = {}
  const cursor = (key) => {
    const c = CURSORS[key]
    const el = mk('ha-cursor')
    el.style.setProperty('--c', c.color)
    el.innerHTML = `<svg viewBox="0 0 18 22" width="18" height="22" aria-hidden="true"><path d="M2 2v15.6l4.3-4.1 2.9 6.5 2.8-1.2-2.9-6.3 6-.4z"/></svg><span class="ha-tag">${c.name}</span>`
    const cur = { el, key, color: c.color, x: 0, y: 0 }
    cursors[key] = cur
    return cur
  }
  const place = (cur, [x, y]) => {
    cur.x = x
    cur.y = y
    animate(cur.el, { x, y, opacity: 0 }, { duration: 0 })
  }
  const move = (cur, [x, y], d = 0.55, ease = EASE) => {
    // stay on screen; near the right edge the name tag flips to the left of the arrow
    const W = layer.clientWidth
    x = Math.min(x, W - 22)
    cur.el.classList.toggle('ha-flip', x > W - 120)
    cur.x = x
    cur.y = y
    return fin(animate(cur.el, { x, y, opacity: 1 }, { duration: d, ease }))
  }
  const enter = (cur, from, to, d = 0.6) => {
    place(cur, from)
    return move(cur, to, d, OUT)
  }
  const click = (cur, target) => {
    sound?.click()
    const ring = mk('ha-ring')
    ring.style.setProperty('--c', cur.color)
    animate(ring, { x: cur.x, y: cur.y }, { duration: 0 })
    fin(animate(ring, { scale: [0.2, 2.4], opacity: [0.9, 0] }, { duration: 0.55, ease: OUT })).then(
      () => ring.remove(),
      () => {},
    )
    fin(animate(cur.el.firstChild, { scale: [1, 0.78, 1] }, { duration: 0.28 })).catch(() => {})
    if (target) {
      target.classList.add('ha-pressed')
      later(0.7, () => target.classList.remove('ha-pressed'))
    }
    return wait(0.18)
  }

  // ── actions ────────────────────────────────────────────────
  // draw: neon outline traced around an element (cursor follows the stroke when given)
  async function draw(cur, el, d = 0.95) {
    if (!el) return null
    const b = box(el)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'ha-outline')
    setBox(svg, b)
    svg.innerHTML = `<rect x="0.75" y="0.75" width="${b.w - 1.5}" height="${b.h - 1.5}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`
    layer.appendChild(svg)
    const rect = svg.firstChild
    const corners = [
      [b.x, b.y],
      [b.x + b.w, b.y],
      [b.x + b.w, b.y + b.h],
      [b.x, b.y + b.h],
      [b.x, b.y],
    ]
    if (cur) await move(cur, corners[0], 0.45)
    sound?.scan(d)
    const stroke = fin(animate(rect, { strokeDashoffset: [1, 0] }, { duration: d, ease: 'linear' }))
    if (cur) {
      const per = 2 * (b.w + b.h)
      for (let i = 1; i < corners.length; i++) {
        const len = i % 2 ? b.w : b.h
        await move(cur, corners[i], (d * len) / per, 'linear')
      }
    }
    await stroke
    return svg
  }

  // type: the headline appears letter by letter behind a caret (highlight style lands at the end)
  function prepareTitle(h1) {
    const kicker = h1.querySelector('#hero-kicker')
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) {
      const n = walker.currentNode
      if (kicker?.contains(n) || !n.nodeValue.trim()) continue
      nodes.push(n)
    }
    typed = nodes.map((node) => {
      const spans = [...node.nodeValue].map((ch) => {
        const s = document.createElement('span')
        s.className = 'ha-ch'
        s.textContent = ch
        return s
      })
      node.replaceWith(...spans)
      return { node, spans }
    })
    h1.classList.add('ha-typing')
  }
  function restoreTitle() {
    if (!typed) return
    for (const { node, spans } of typed) {
      if (spans[0].parentNode) spans[0].before(node)
      spans.forEach((s) => s.remove())
    }
    typed = null
    $('#hero-title')?.classList.remove('ha-typing')
  }
  async function type(cur, h1, speed = 0.03) {
    if (!h1 || !typed) return
    const chars = typed.flatMap((t) => t.spans)
    const caret = mk('ha-caret')
    // time-based (not one timer per letter), so the pace is the same on slow and fast machines
    await new Promise((res) => {
      const t0 = performance.now()
      let i = 0
      let lastY = null
      const step = () => {
        if (cancelled) return res()
        const n = Math.min(chars.length, Math.floor((performance.now() - t0) / (speed * 1000)) + 1)
        if (n > i) {
          while (i < n) chars[i++].classList.add('on')
          sound?.key()
          const b = box(chars[i - 1])
          Object.assign(caret.style, { transform: `translate(${b.x + b.w + 2}px, ${b.y + b.h * 0.12}px)`, height: `${b.h * 0.78}px` })
          if (cur) {
            cur.x = b.x + b.w + 6
            cur.y = b.y + b.h * 0.72
            live.add(animate(cur.el, { x: cur.x, y: cur.y, opacity: 1 }, { duration: lastY !== null && lastY !== b.y ? 0.16 : 0.08, ease: 'linear' }))
          }
          lastY = b.y
        }
        if (i >= chars.length) return res()
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }).then(guard)
    await wait(0.08)
    caret.remove()
    restoreTitle()
    h1.classList.add('ha-hl-in')
    later(0.8, () => h1.classList.remove('ha-hl-in'))
  }

  // select: Figma-like selection box with handles and the real measurement
  async function select(cur, el) {
    const b = box(el)
    const pad = 6
    await move(cur, [b.x - pad, b.y - pad], 0.38)
    sound?.tick()
    const sel = mk('ha-sel')
    setBox(sel, b, pad)
    sel.innerHTML = `<i></i><i></i><i></i><i></i><span class="ha-measure">${Math.round(b.w)} × ${Math.round(b.h)}</span>`
    fin(animate(sel, { scaleX: [0, 1], scaleY: [0, 1] }, { duration: 0.32, ease: EASE })).catch(() => {})
    await move(cur, [b.x + b.w + pad, b.y + b.h + pad], 0.32)
    return sel
  }

  // copy: keyboard shortcut toast next to the cursor
  async function copy(cur, sel) {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    const kbd = mk('ha-kbd')
    kbd.textContent = mac ? '⌘C' : 'Ctrl+C'
    sound?.pop()
    animate(kbd, { x: cur.x + 16, y: cur.y - 30 }, { duration: 0 })
    await fin(animate(kbd, { opacity: [0, 1], scale: [0.6, 1] }, { type: 'spring', stiffness: 520, damping: 22 }))
    if (sel) fin(animate(sel, { opacity: [1, 0.5, 1] }, { duration: 0.3 })).catch(() => {})
    await wait(0.2)
    fin(animate(kbd, { opacity: 0, y: cur.y - 42 }, { duration: 0.25 })).then(() => kbd.remove(), () => {})
  }

  // drag: the copy follows the cursor to the slot; magenta guides appear as it lines up; spring snap + flash
  async function drag(cur, from, to, sel, d = 0.8) {
    const b = box(from)
    const s = box(to)
    const ghost = mk('ha-ghost')
    const dot = document.createElement('span')
    dot.className = 'ha-ghost-dot'
    ghost.append(dot, from.textContent.trim())
    const g = box(ghost)
    const gx = b.x + b.w / 2 - g.w / 2
    const gy = b.y + b.h / 2 - g.h / 2
    Object.assign(ghost.style, { left: `${gx}px`, top: `${gy}px` })
    // grab
    await move(cur, [b.x + b.w * 0.55, b.y + b.h * 0.6], 0.18)
    if (sel) fin(animate(sel, { opacity: 0 }, { duration: 0.2 })).then(() => sel.remove(), () => {})
    fin(animate(ghost, { opacity: [0, 1], scale: [1, 1.06] }, { duration: 0.2 })).catch(() => {})
    const offX = cur.x - gx
    const offY = cur.y - gy
    // where the ghost must land (its centre on the slot's centre)
    const tx = s.x + s.w / 2 - g.w / 2
    const ty = s.y + s.h / 2 - g.h / 2
    // guides: slot's horizontal centre line + left edge
    const gh = mk('ha-guide-h')
    gh.style.top = `${s.y + s.h / 2}px`
    const gv = mk('ha-guide-v')
    gv.style.left = `${s.x}px`
    for (const gl of [gh, gv]) gl.style.opacity = '0'
    later(d * 0.55, () => {
      for (const gl of [gh, gv]) live.add(animate(gl, { opacity: [0, 1] }, { duration: 0.15 }))
    })
    // a little overshoot on the way, then the snap
    const nearX = tx - gx + (tx > gx ? -10 : 10)
    const nearY = ty - gy + 6
    sound?.whoosh(d)
    fin(animate(ghost, { x: nearX, y: nearY, rotate: [0, -4, -2] }, { duration: d, ease: EASE })).catch(() => {})
    await move(cur, [gx + nearX + offX, gy + nearY + offY], d)
    // snap in sync with the photo's "catch" (video spark ≈ 3.4s)
    if (video && !mobile) await video.at(3.3).then(guard)
    fin(animate(ghost, { x: tx - gx, y: ty - gy, rotate: 0, scale: s.w / g.w }, { type: 'spring', stiffness: 600, damping: 20 })).catch(() => {})
    move(cur, [tx + offX, ty + offY], 0.18).catch(() => {})
    await wait(0.16)
    flash(to)
    sound?.snap()
    reveal(to, { d: 0.3, dy: 0 }).catch(() => {})
    fin(animate(ghost, { opacity: 0 }, { duration: 0.25 })).then(() => ghost.remove(), () => {})
    for (const gl of [gh, gv]) fin(animate(gl, { opacity: 0 }, { duration: 0.3 })).then(() => gl.remove(), () => {})
    await wait(0.12)
  }

  function flash(el, cls = 'ha-flash') {
    if (!el) return
    const f = mk(cls)
    setBox(f, box(el), 2)
    fin(animate(f, { opacity: [0.95, 0], scale: [1, 1.18] }, { duration: 0.55, ease: OUT })).then(() => f.remove(), () => {})
  }

  // status: "AGUARDANDO DEPLOY_" scrambles into the real text
  function scramble(node, to, d = 0.7) {
    return new Promise((res) => {
      const from = node.nodeValue
      const t0 = performance.now()
      const id = setInterval(() => {
        if (cancelled) {
          clearInterval(id)
          timers.delete(id)
          return res()
        }
        const p = Math.min(1, (performance.now() - t0) / (d * 1000))
        const len = Math.round(from.length + (to.length - from.length) * p)
        let s = ''
        for (let i = 0; i < len; i++) s += i < to.length * p ? to[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        node.nodeValue = p >= 1 ? to : s
        if (p >= 1) {
          clearInterval(id)
          timers.delete(id)
          res()
        }
      }, 40)
      timers.add(id)
    }).then(guard)
  }

  // deploy: button press → progress bar fills → status ONLINE → photo frame pulses lime
  async function deploy(cur, target = $('#btn-deploy')) {
    const btn = target
    // the click lands with the photo's tap in the air (video ripple ≈ 4.0s)
    if (video && !mobile) await video.at(3.95).then(guard)
    if (cur && btn) await click(cur, btn)
    const bar = $('#deploy-progress')
    const st = $('#deploy-status')?.firstChild
    let toast
    const work = []
    if (bar) {
      bar.style.scale = ''
      sound?.scan(0.56)
      work.push(fin(bar.animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 560, easing: 'cubic-bezier(0.65,0,0.35,1)' })))
    }
    if (st && statusFinal != null) work.push(scramble(st, statusFinal, 0.56))
    await Promise.all(work)
    $('#deploy-status-wrap')?.classList.remove('ha-pending')
    if (!mobile) sound?.chime()
    if (toast) await toast
    flash($('#hero-frame'), 'ha-pulse')
    await wait(mobile ? 0.2 : 0.3)
  }

  // phones: a small DEPLOY panel at the bottom of the hero
  async function deployToast() {
    const t = mk('ha-toast')
    t.innerHTML = `<div class="ha-toast-row"><span>▸ ${L.deploying}</span><span>baroneslabs.com.br</span></div><div class="ha-toast-bar"><i></i></div><div class="ha-toast-st">${L.waiting}</div>`
    await fin(animate(t, { opacity: [0, 1], y: [16, 0] }, { duration: 0.22, ease: OUT }))
    await fin(t.querySelector('i').animate([{ scale: '0 1' }, { scale: '1 1' }], { duration: 520, easing: 'cubic-bezier(0.65,0,0.35,1)', fill: 'forwards' }))
    const st = t.querySelector('.ha-toast-st')
    st.textContent = L.online
    sound?.chime()
    st.classList.add('ok')
    await wait(0.3)
    fin(animate(t, { opacity: 0, y: 10 }, { duration: 0.3 })).then(() => t.remove(), () => {})
  }

  const exit = () =>
    Promise.all(
      Object.values(cursors).map((c, i) => {
        const ang = (i / 4) * Math.PI * 2 + 0.6
        return fin(animate(c.el, { x: c.x + Math.cos(ang) * 180, y: c.y + Math.sin(ang) * 140, opacity: 0 }, { duration: 0.35, ease: [0.5, 0, 0.75, 0] }))
      }),
    )

  // ── prepare: hide everything the cursors will build (instant, before the hero is seen) ──
  function prepare() {
    if (mobile) layer.classList.add('ha-m')
    ;['#hero-status', '#hero-kicker', '#hero-sub', '#hero-ctas', '#hero-frame', '#slot-proof'].forEach((s) => hide($(s)))
    $$('#hero-proofs > li').forEach(hide)
    $$('[data-ha-chip]').forEach(hide)
    const h1 = $('#hero-title')
    if (h1) prepareTitle(h1)
    const bar = $('#deploy-progress')
    if (bar) bar.style.scale = '0 1'
    const st = $('#deploy-status')?.firstChild
    if (st) {
      statusFinal = st.nodeValue
      st.nodeValue = mobile && L.waitingShort ? L.waitingShort : L.waiting
      $('#deploy-status-wrap')?.classList.add('ha-pending')
    }
  }

  // ── the choreography ───────────────────────────────────────
  // ── phones: "the camera follows" ───────────────────────────
  // Act 1 (top): headline, text and buttons. Act 2: the page glides down to the photo, which comes alive
  // with the clip while the four cursors work on it (drag synced to the hand, deploy on the photo's own
  // status, synced to the tap in the air). Act 3: glides back up to the main button.
  const ease3 = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
  const glide = (y, d) =>
    new Promise((res) => {
      const y0 = window.scrollY
      const t0 = performance.now()
      const step = () => {
        if (cancelled) return res()
        const p = Math.min(1, (performance.now() - t0) / (d * 1000))
        window.scrollTo(0, y0 + (y - y0) * ease3(p))
        if (p < 1) requestAnimationFrame(step)
        else res()
      }
      requestAnimationFrame(step)
    }).then(guard)
  const vTop = () => -layer.getBoundingClientRect().top // viewport top, in layer coordinates

  async function playMobile() {
    const gate = { framed: defer(), snapped: defer() }
    const W = layer.clientWidth
    const title = $('#hero-title')
    const frame = $('#hero-frame')
    const proof = $('#proof-48h')
    const slot = $('#slot-proof')
    const lis = $$('#hero-proofs > li')
    const below = () => vTop() + window.innerHeight + 40

    // ACT 1 — the text
    reveal($('#hero-status'), { d: 0.45 }).catch(() => {})
    later(0.08, () => reveal($('#hero-kicker'), { d: 0.4, dy: 8 }).catch(() => {}))
    const c = cursor('copy')
    const t0 = title ? box(title) : { x: 20, y: 200, w: 0, h: 0 }
    await enter(c, [-40, t0.y + 40], [t0.x + 8, t0.y + t0.h * 0.45], 0.3)
    await type(c, title, 0.016)
    const sub = $('#hero-sub')
    if (sub) {
      await move(c, pt(sub, 0.05, 0.5), 0.2)
      reveal(sub, { d: 0.4 }).catch(() => {})
    }
    await wait(0.12)
    reveal($('#hero-ctas'), { d: 0.4 }).catch(() => {})
    const btn = $('#btn-deploy')
    if (btn) move(c, pt(btn, 0.8, 0.7), 0.35).catch(() => {})
    await wait(0.2)

    // ACT 2 — the camera glides down: proofs on top, photo below
    const anchor = lis[0] || frame
    const targetY = anchor ? Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - 86) : 0
    lis.forEach((li, i) => reveal(li, { d: 0.35, dy: 6, delay: 0.25 + i * 0.07 }).catch(() => {}))
    move(c, [c.x - 30, c.y + 260], 0.7).catch(() => {})
    await glide(targetY, 0.7)

    const uiTrack = async () => {
      const u = cursor('ui')
      const fb = frame ? box(frame) : { x: 20, y: below() - 300, w: 300, h: 380 }
      // phones take a moment to start a clip: it starts (hidden in the frame) while the outline is drawn
      video?.start(0.4)
      await enter(u, [W + 30, fb.y + 60], [fb.x + 16, fb.y + 16], 0.35)
      const outline = await draw(u, frame, 0.6)
      await reveal(frame, { d: 0.45, dy: 0, scale: 0.97 })
      gate.framed.resolve()
      if (outline) fin(animate(outline, { opacity: 0 }, { duration: 0.35 })).then(() => outline.remove(), () => {})
      for (const ch of $$('[data-ha-chip]')) {
        await move(u, pt(ch, 0.5, 0.6), 0.22)
        await click(u)
        reveal(ch, { d: 0.3, dy: 0, scale: 0.6 }).catch(() => {})
      }
      move(u, [u.x - 40, u.y - 60], 0.4).catch(() => {})
    }

    const wesleyTrack = async () => {
      const w = cursor('wesley')
      const from = proof ? box(proof) : null
      await enter(w, [-40, below()], from ? [from.x + from.w * 0.6, from.y + from.h + 40] : [W / 2, vTop() + 200], 0.45)
      if (proof && slot) {
        const sel = await select(w, proof)
        await copy(w, sel)
        await gate.framed
        await drag(w, proof, slot, sel, 0.6)
      } else if (slot) await reveal(slot)
      gate.snapped.resolve()
      move(w, [w.x - 60, w.y + 50], 0.4).catch(() => {})
    }

    const deployTrack = async () => {
      await wait(0.5)
      const d = cursor('deploy')
      const st = $('#deploy-status-wrap')
      await enter(d, [W * 0.6, below()], st ? pt(st, 0.3, 2.6) : [W * 0.7, vTop() + 500], 0.5)
      await gate.snapped
      if (st) await move(d, pt(st, 0.35, 0.6), 0.3)
      await deploy(d, st)
    }

    try {
      await Promise.all([uiTrack(), wesleyTrack(), deployTrack()])
      // ACT 3 — back to the main button
      await wait(0.25)
      exit().catch(() => {})
      await glide(0, 0.7)
    } catch (e) {
      if (e !== CANCEL) console.error(e)
    }
    finish()
    return done
  }

  async function play() {
    if (mobile) return playMobile()
    const gate = { ctas: defer(), proofs: defer(), snapped: defer() }
    const W = layer.clientWidth
    const H = layer.clientHeight
    const title = $('#hero-title')
    const frame = $('#hero-frame')
    const proof = $('#proof-48h')
    const slot = $('#slot-proof')

    const intro = async () => {
      reveal($('#hero-status'), { d: 0.5 }).catch(() => {})
      await wait(0.08)
      await reveal($('#hero-kicker'), { d: 0.45, dy: 8 })
    }

    // COPY.BOT — headline, then text, buttons and proofs
    const copyTrack = async () => {
      const c = cursor('copy')
      const t0 = title ? box(title) : { x: 40, y: H * 0.4, w: 0, h: 0 }
      await enter(c, [-40, t0.y + 40], [t0.x + 8, t0.y + t0.h * 0.45], mobile ? 0.3 : 0.35)
      await type(c, title, mobile ? 0.014 : 0.022)
      const sub = $('#hero-sub')
      if (sub) {
        await move(c, pt(sub, 0.04, 0.55), mobile ? 0.2 : 0.3)
        reveal(sub, { d: 0.45 }).catch(() => {})
        move(c, pt(sub, 0.9, 0.9), 0.4).catch(() => {})
      }
      await wait(mobile ? 0.12 : 0.14)
      reveal($('#hero-ctas'), { d: 0.45 }).catch(() => {})
      gate.ctas.resolve()
      await wait(mobile ? 0.1 : 0.18)
      const lis = $$('#hero-proofs > li')
      lis.forEach((li, i) => reveal(li, { d: 0.35, dy: 6, delay: i * 0.07 }).catch(() => {}))
      await wait(0.12)
      gate.proofs.resolve() // the first proof (the one W.BARONES copies) is already in
      await wait(lis.length * 0.07)
      if (!mobile) move(c, [c.x + 40, c.y + 90], 0.6).catch(() => {})
    }

    // UI.BOT — photo outline, then the HUD chips (desktop); on phones the outline draws by itself
    const uiTrack = async () => {
      let outline
      if (mobile) {
        await wait(0.2)
        outline = await draw(null, frame, 0.7)
      } else {
        const u = cursor('ui')
        const fb = frame ? box(frame) : { x: W * 0.7, y: H * 0.3 }
        await enter(u, [W + 40, fb.y + 120], [fb.x + 30, fb.y + 30], 0.45)
        outline = await draw(u, frame, 0.95)
      }
      // desktop: the photo comes alive as the frame appears (clip starts at 0.7s so its beats meet the cursors')
      if (!mobile) video?.start(0.7)
      await reveal(frame, { d: 0.5, dy: 0, scale: 0.97 })
      if (outline) fin(animate(outline, { opacity: 0 }, { duration: 0.4 })).then(() => outline.remove(), () => {})
      const chips = $$('[data-ha-chip]')
      if (mobile) {
        chips.forEach((ch, i) => {
          reveal(ch, { d: 0.3, dy: 0, scale: 0.7, delay: i * 0.08 }).catch(() => {})
          later(i * 0.08, () => sound?.pop())
        })
        if (slot) reveal(slot, { d: 0.3, dy: 0, scale: 0.7, delay: chips.length * 0.08 }).catch(() => {})
        return
      }
      const u = cursors.ui
      for (const ch of chips) {
        await move(u, pt(ch, 0.5, 0.6), 0.32)
        await click(u)
        reveal(ch, { d: 0.35, dy: 0, scale: 0.6 }).catch(() => {})
      }
      await move(u, [u.x + 60, u.y - 70], 0.5)
    }

    // W.BARONES — select, copy and drag a proof onto the photo
    const wesleyTrack = async () => {
      if (mobile) return
      const w = cursor('wesley')
      const tb = title ? box(title) : { x: 60, y: H * 0.5, w: 300, h: 100 }
      await wait(0.5)
      await enter(w, [tb.x + tb.w * 0.4, H + 40], [tb.x + tb.w * 0.75, tb.y + tb.h + 30], 0.6)
      await gate.proofs
      if (proof && slot) {
        const sel = await select(w, proof)
        await copy(w, sel)
        await drag(w, proof, slot, sel, 0.66)
      } else if (slot) await reveal(slot)
      gate.snapped.resolve()
      move(w, [w.x - 50, w.y + 60], 0.5).catch(() => {})
    }

    // DEPLOY.BOT — waits by the button, then ships it
    const deployTrack = async () => {
      await wait(mobile ? 0.6 : 2.2)
      const d = cursor('deploy')
      const btn = $('#btn-deploy')
      const bb = btn ? box(btn) : { x: W / 2, y: H * 0.7, w: 0, h: 0 }
      await enter(d, [W * 0.5, H + 40], [bb.x + bb.w + 40, bb.y + bb.h + 50], 0.5)
      await gate.ctas
      // waits on the button while W.BARONES finishes, then ships
      if (btn) await move(d, pt(btn, 0.62, 0.62), mobile ? 0.3 : 0.45)
      if (!mobile) await gate.snapped
      await deploy(d)
    }

    try {
      await Promise.all([intro(), copyTrack(), uiTrack(), wesleyTrack(), deployTrack()])
      await exit()
    } catch (e) {
      if (e !== CANCEL) console.error(e)
    }
    finish()
    return done
  }

  // ── end / skip: everything back to the page's own HTML ─────
  let skipped = false
  function finish() {
    if (finished) return
    finished = true
    cancelled = true
    timers.forEach((id) => {
      clearTimeout(id)
      clearInterval(id)
    })
    timers.clear()
    live.forEach((a) => {
      try {
        a.cancel ? a.cancel() : a.stop?.()
      } catch {}
    })
    live.clear()
    restoreTitle()
    hidden.forEach((el) => (el.style.visibility = ''))
    const bar = $('#deploy-progress')
    if (bar) bar.style.scale = ''
    const st = $('#deploy-status')?.firstChild
    if (st && statusFinal != null) st.nodeValue = statusFinal
    $('#deploy-status-wrap')?.classList.remove('ha-pending')
    $('#btn-deploy')?.classList.remove('ha-pressed')
    layer.replaceChildren()
    // skipped: the clip stops too; phones play it when the photo scrolls into view
    if (skipped) video?.stop()
    if (skipped && mobile && window.scrollY > 0) window.scrollTo(0, 0)
    layer.classList.remove('ha-m')
    done.resolve()
  }

  return {
    prepare,
    play,
    skip: () => {
      skipped = true
      cancelled = true
      finish()
    },
    done,
  }
}
export { createHeroVideo } from './video.js'
export { createSound, soundPref } from './sound.js'
