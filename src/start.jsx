import { StrictMode, startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { LangProvider } from './i18n/LangContext'
import { initTracking } from './lib/tracking'

export default function start() {
  initTracking() // GTM + Consent Mode v2 (só liga com VITE_GTM_ID)
  // concurrent first render: React yields to the browser instead of one long blocking task
  const root = createRoot(document.getElementById('root'))
  startTransition(() => root.render(
  <StrictMode>
    <HelmetProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </HelmetProvider>
  </StrictMode>,
  ))
}
