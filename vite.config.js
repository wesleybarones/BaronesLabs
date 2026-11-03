import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  Core Web Vitals: preload what the first screen needs, using the hashed file names
  Vite generates — the hero image (LCP) and the two fonts that paint the headline and body.
*/
const PRELOAD = [
  { match: /wesley-avatar-[\w-]+\.webp$/, tag: (href) => ({ rel: 'preload', as: 'image', href, type: 'image/webp', fetchpriority: 'high' }) },
  { match: /chakra-petch-latin-700-normal-[\w-]+\.woff2$/, tag: (href) => ({ rel: 'preload', as: 'font', href, type: 'font/woff2', crossorigin: '' }) },
  { match: /inter-latin-400-normal-[\w-]+\.woff2$/, tag: (href) => ({ rel: 'preload', as: 'font', href, type: 'font/woff2', crossorigin: '' }) },
]

function preloadCritical() {
  return {
    name: 'preload-critical-assets',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const files = Object.keys(ctx.bundle)
        const tags = []
        for (const p of PRELOAD) {
          const file = files.find((f) => p.match.test(f))
          if (file) tags.push({ tag: 'link', attrs: p.tag(`/${file}`), injectTo: 'head-prepend' })
        }
        return tags
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCritical()],
  build: {
    // INLINE=1 embute imagens/fontes no bundle (usado para gerar o HTML único da prévia)
    assetsInlineLimit: process.env.INLINE ? 100_000_000 : 4096,
    rollupOptions: {
      output: {
        // separate, long-cached vendor chunk: returning visitors only re-download the app code
        manualChunks: process.env.INLINE
          ? undefined
          : (id) => (/node_modules\/(react|react-dom|scheduler|motion|framer-motion|motion-dom|motion-utils|lenis)\//.test(id) ? 'vendor' : undefined),
      },
    },
  },
})
