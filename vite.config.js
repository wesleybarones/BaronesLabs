import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, readFileSync } from 'node:fs'

/*
  Core Web Vitals: preload what the first screen needs, using the hashed file names
  Vite generates — the hero image (LCP) and the two fonts that paint the headline and body.
*/
const FONT_PRELOAD = [/chakra-petch-latin-700-normal-[\w-]+\.woff2$/, /inter-latin-400-normal-[\w-]+\.woff2$/]
const AVATAR = /wesley-avatar-(520|780|1040)-[\w-]+\.webp$/
const AVATAR_SIZES = '(min-width: 1280px) 560px, (min-width: 1024px) 40vw, 88vw' // same as Hero.jsx
// hex watermark behind the photo: the largest image of the first screen (LCP on desktop)
const SYMBOL = /symbol-(480|900)-[\w-]+\.webp$/
const SYMBOL_SIZES = '(min-width: 1024px) 46vw, 100vw' // same as Hero.jsx

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
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'image', type: 'image/webp', imagesrcset: srcset, imagesizes: AVATAR_SIZES, fetchpriority: 'high', media: '(min-width: 1024px)' }, injectTo: 'head-prepend' })
        }
        const sy = files.filter((f) => SYMBOL.test(f)).sort((a, b) => +a.match(SYMBOL)[1] - +b.match(SYMBOL)[1])
        if (sy.length) {
          const srcset = sy.map((f) => `/${f} ${f.match(SYMBOL)[1]}w`).join(', ')
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'image', type: 'image/webp', imagesrcset: srcset, imagesizes: SYMBOL_SIZES, media: '(min-width: 1024px)' }, injectTo: 'head-prepend' })
        }
        // the app starts after the first paint (src/main.jsx): fetch its code right away, run it later
        for (const f of files.filter((x) => /^assets\/(start|vendor)-[\w-]+\.js$/.test(x)))
          tags.push({ tag: 'link', attrs: { rel: 'modulepreload', href: `/${f}`, crossorigin: '' }, injectTo: 'head' })
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
        // static first screen (header + hero) inside #root: paints before any JavaScript; React replaces
        // it with identical markup. Asset URLs are re-pointed to this build's hashed files.
        if (!process.env.INLINE && existsSync('src/hero-shell.html')) {
          let shell = readFileSync('src/hero-shell.html', 'utf8').replace(/\/assets\/([\w-]+?)-[\w-]{8}\.(webp|png|jpg|svg)/g, (m, base, ext) => {
            const f = files.find((x) => new RegExp(`^assets/${base}-[\\w-]{8}\\.${ext}$`).test(x))
            return f ? `/${f}` : m
          })
          // images come with React (keeps the first paint light on phones, where the LCP is the text)
          shell = shell.replace(/<img\b([^>]*?)\s(?:src|srcset)="[^"]*"/g, '<img$1').replace(/<img\b([^>]*?)\s(?:src|srcset)="[^"]*"/g, '<img$1')
          shell = shell.replace(/<img\b([^>]*?)\salt="[^"]*"/g, '<img$1 alt=""')
          // first visit: a dark cover (the intro's own background) hides the shell until the intro starts
          const cover =
            '<div id="bl-cover" style="position:fixed;inset:0;z-index:250;background:#07080D"></div>' +
            '<script>try{var s=sessionStorage.getItem("bl-booted"),b=/(bot|crawl|spider|slurp|facebookexternalhit|embedly|preview)|^whatsapp\\//i.test(navigator.userAgent),r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(s||b||r)document.getElementById("bl-cover").remove()}catch(e){}</script>'
          out = out.replace('<div id="root"></div>', () => `<div id="root">${shell}${cover}</div>`)
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
        // the single-file preview (INLINE=1) needs everything in one script
        inlineDynamicImports: !!process.env.INLINE,
        // separate, long-cached vendor chunk: returning visitors only re-download the app code
        manualChunks: process.env.INLINE
          ? undefined
          : (id) => (/node_modules\/(react|react-dom|scheduler|motion|framer-motion|motion-dom|motion-utils)\//.test(id) ? 'vendor' : undefined),
      },
    },
  },
})
