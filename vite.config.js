import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
  Core Web Vitals: preload what the first screen needs, using the hashed file names
  Vite generates — the hero image (LCP) and the two fonts that paint the headline and body.
*/
const FONT_PRELOAD = [/chakra-petch-latin-700-normal-[\w-]+\.woff2$/, /inter-latin-400-normal-[\w-]+\.woff2$/]
const AVATAR = /wesley-avatar-(520|780|1040)-[\w-]+\.webp$/
const AVATAR_SIZES = '(min-width: 1280px) 560px, (min-width: 1024px) 40vw, 88vw' // same as Hero.jsx

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
        // hero image (LCP): responsive preload, so each screen fetches the right width immediately
        const av = files.filter((f) => AVATAR.test(f)).sort((a, b) => +a.match(AVATAR)[1] - +b.match(AVATAR)[1])
        if (av.length) {
          const srcset = av.map((f) => `/${f} ${f.match(AVATAR)[1]}w`).join(', ')
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'image', type: 'image/webp', imagesrcset: srcset, imagesizes: AVATAR_SIZES, fetchpriority: 'high' }, injectTo: 'head-prepend' })
        }
        for (const re of FONT_PRELOAD) {
          const f = files.find((x) => re.test(x))
          if (f) tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'font', href: `/${f}`, type: 'font/woff2', crossorigin: '' }, injectTo: 'head-prepend' })
        }
        // inline the (single, ~16 KB gzip) stylesheet: removes the only render-blocking request
        let out = html
        for (const [name, chunk] of Object.entries(ctx.bundle)) {
          if (chunk.type !== 'asset' || !name.endsWith('.css')) continue
          const re = new RegExp(`<link[^>]+href="/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`)
          if (re.test(out)) out = out.replace(re, () => `<style>${String(chunk.source)}</style>`)
        }
        return { html: out, tags }
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
          : (id) => (/node_modules\/(react|react-dom|scheduler|motion|framer-motion|motion-dom|motion-utils)\//.test(id) ? 'vendor' : undefined),
      },
    },
  },
})
