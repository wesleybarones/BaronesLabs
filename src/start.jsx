import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { LangProvider } from './i18n/LangContext'

export default function start() {
  createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </HelmetProvider>
  </StrictMode>,
  )
}
