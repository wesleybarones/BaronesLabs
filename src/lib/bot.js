// search engine / social preview robots: they get the full page straight away (no intro, no deferred sections)
export const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|linkedin|embedly|preview/i
export const isBot = () => typeof navigator !== 'undefined' && BOT.test(navigator.userAgent)
