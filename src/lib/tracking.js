/* ═══════════════════════════════════════════
   BARONES LABS · RASTREAMENTO (pacote Signature)
   GTM é a central: este arquivo só carrega o container e manda eventos para o dataLayer.
   GA4, Pixel da Meta e Google Ads são configurados DENTRO do GTM (ver docs/rastreamento.md).

   Liga/desliga: variável de ambiente VITE_GTM_ID (ex.: GTM-ABC1234) no Vercel.
   Sem ela, nada é carregado e o banner de cookies não aparece.
   ═══════════════════════════════════════════ */

export const GTM_ID = (import.meta.env.VITE_GTM_ID || '').trim()
export const TRACKING_ON = /^GTM-[A-Z0-9]+$/.test(GTM_ID)

const CONSENT_KEY = 'bl-consent' // 'granted' | 'denied'

const w = typeof window !== 'undefined' ? window : null
if (w) w.dataLayer = w.dataLayer || []
function gtag() {
  // Consent Mode precisa do objeto `arguments`, não de um array
  // eslint-disable-next-line prefer-rest-params
  w?.dataLayer.push(arguments)
}

export function getConsent() {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

const consentState = (v) => ({
  ad_storage: v,
  ad_user_data: v,
  ad_personalization: v,
  analytics_storage: v,
})

/** Grava a escolha do visitante e avisa o GTM (Consent Mode v2). */
export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {}
  if (!TRACKING_ON) return
  gtag('consent', 'update', consentState(value))
  w.dataLayer.push({ event: value === 'granted' ? 'consent_granted' : 'consent_denied' })
}

const uid = () =>
  (w?.crypto?.randomUUID && w.crypto.randomUUID()) ||
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

const language = () => {
  try {
    const l = localStorage.getItem('bl-lang')
    if (l) return l
  } catch {}
  return (document.documentElement.lang || 'pt').slice(0, 2)
}

/** Envia um evento para o dataLayer, com event_id para deduplicar Pixel ↔ API de Conversões. */
export function track(event, params = {}) {
  if (!TRACKING_ON) return
  w.dataLayer.push({
    event,
    event_id: uid(),
    page_location: w.location.href,
    language: language(),
    ...params,
  })
}

// ───────── cliques nos CTAs (um ouvinte só, para todos os links do site) ─────────

const RULES = [
  { test: (h) => /(^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/)|^whatsapp:/i.test(h), event: 'click_whatsapp' },
  { test: (h) => /^tel:/i.test(h), event: 'click_phone' },
  { test: (h) => /^https?:\/\/(www\.)?(instagram\.com|facebook\.com|tiktok\.com|linkedin\.com|youtube\.com)\//i.test(h), event: 'click_social' },
]

function sectionOf(el) {
  const marked = el.closest('[data-track-section]')
  if (marked) return marked.getAttribute('data-track-section')
  const sec = el.closest('section[id]')
  if (sec) return sec.id === 'top' ? 'hero' : sec.id
  if (el.closest('footer')) return 'footer'
  if (el.closest('header')) return 'header'
  return 'other'
}

const textOf = (a) =>
  (a.getAttribute('aria-label') || a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100)

function onClick(e) {
  const a = e.target instanceof Element && e.target.closest('a[href]')
  if (!a) return
  const href = a.getAttribute('href') || ''
  const rule = RULES.find((r) => r.test(href))
  if (!rule) return
  let network
  if (rule.event === 'click_social') network = new URL(href).hostname.replace(/^www\./, '').split('.')[0]
  track(rule.event, {
    button_text: textOf(a),
    section: sectionOf(a),
    link_url: href.split('?')[0],
    ...(network ? { social_network: network } : {}),
  })
}

// ───────── rolagem de 75% (uma vez por página) ─────────

function watchScroll() {
  let sent = false
  let ticking = false
  const check = () => {
    ticking = false
    if (sent) return
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    if (max <= 0) return
    if (window.scrollY / max >= 0.75) {
      sent = true
      track('scroll_75', { percent_scrolled: 75 })
      window.removeEventListener('scroll', onScroll)
    }
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(check)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

// ───────── carregamento do GTM ─────────

function loadGtm() {
  if (document.getElementById('gtm-js')) return
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.id = 'gtm-js'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
  document.head.appendChild(s)
}

let started = false
/** Chamado uma vez no início do app. */
export function initTracking() {
  if (!w || started || !TRACKING_ON) return
  started = true

  // Consent Mode v2: tudo negado até o visitante aceitar (LGPD).
  const saved = getConsent()
  gtag('consent', 'default', { ...consentState('denied'), wait_for_update: 500 })
  gtag('set', 'ads_data_redaction', true)
  gtag('set', 'url_passthrough', true)
  if (saved) gtag('consent', 'update', consentState(saved))

  document.addEventListener('click', onClick, true)
  watchScroll()

  // o GTM entra depois da primeira pintura, para não pesar no carregamento do site
  const go = () => loadGtm()
  if (document.readyState === 'complete') {
    window.requestIdleCallback ? requestIdleCallback(go, { timeout: 3000 }) : setTimeout(go, 1500)
  } else {
    window.addEventListener(
      'load',
      () => (window.requestIdleCallback ? requestIdleCallback(go, { timeout: 3000 }) : setTimeout(go, 1500)),
      { once: true },
    )
  }
}
