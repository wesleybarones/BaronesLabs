// search engine / social preview robots: they get the full page straight away (no intro, no deferred sections)
// crawler names only: in-app browsers (LinkedIn, Telegram, WhatsApp) are people and get the full site
export const BOT = /(bot|crawl|spider|slurp|facebookexternalhit|embedly|preview)|^whatsapp\//i
export const isBot = () => typeof navigator !== 'undefined' && BOT.test(navigator.userAgent)
