const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconWhatsApp = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.15.17-.29.19-.54.06a6.8 6.8 0 0 1-3.37-2.94c-.25-.44.25-.41.72-1.36.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.24 3.74 1.57.68 2.19.74 2.98.62.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
  </svg>
)
export const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const IconArrowUpRight = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)
export const IconArrowDown = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
)
export const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
export const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconInstagram = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)
export const IconError = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3 22 20H2Z" />
    <path d="M12 10v4M12 17v.01" />
  </svg>
)
export const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 7h16M4 12h10M4 17h16" />
  </svg>
)
export const IconClose = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const IconShield = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
)

/* segment icons (neon line) */
export const IconScissors = (p) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <circle cx="8" cy="9" r="4" />
    <circle cx="8" cy="23" r="4" />
    <path d="M11.2 11.4 27 24M11.2 20.6 27 8" />
  </svg>
)
export const IconBag = (p) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M6 10h20l-1.5 17h-17Z" />
    <path d="M11.5 13V8.5a4.5 4.5 0 0 1 9 0V13" />
  </svg>
)
export const IconBriefcase = (p) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <rect x="4" y="9" width="24" height="17" rx="1.5" />
    <path d="M12 9V6h8v3M4 16h24M15 16v3h2v-3" />
  </svg>
)
export const IconRocket = (p) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M18.5 4.5c5 0 9 4 9 9-3 4-7 7.5-11 9.5l-6.5-6.5c2-4 5.5-8 8.5-12Z" />
    <circle cx="20" cy="12" r="2.2" />
    <path d="M10 16.5 5 17l-1 4 5-1M15.5 22l-.5 5 4-1 .5-5M6 26l3-3" />
  </svg>
)
export const IconDish = (p) => (
  <svg viewBox="0 0 32 32" {...base} {...p}>
    <path d="M4 22h24M6 22a10 10 0 0 1 20 0M16 9V7M13.5 7h5M3 26h26" />
  </svg>
)
