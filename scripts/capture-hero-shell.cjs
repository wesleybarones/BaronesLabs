// Captures the static HTML the build puts in index.html (so the page is readable before / without JavaScript):
//   1. src/hero-shell.html      first screen (header + hero) inside <div id="root">: paints before JS runs
//                               (React replaces it on mount with the identical markup);
//   2. src/sections-static.html every section below the hero, in <div id="bl-static">: search engines and
//                               AI crawlers that don't run JavaScript read the whole page; when React starts,
//                               each section's copy is taken into place and swapped for the live one on demand
//                               (see src/components/Deferred.jsx).
// Re-run after changing any text, price, section or the header/hero:
//   npx vite build && node scripts/capture-hero-shell.cjs && npx vite build   (serves ./dist on a free port)
const { chromium } = require('playwright')
const http = require('http')
const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, '..', 'dist')
const server = http
  .createServer((q, r) => {
    let p = path.join(dist, decodeURIComponent(q.url.split('?')[0]))
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html')
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm' }
    r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' })
    fs.createReadStream(p).pipe(r)
  })
  .listen(0, async () => {
    const port = server.address().port
    const b = await chromium.launch()

    // ── 1. first screen ──
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
    await p.addInitScript(() => {
      try {
        sessionStorage.setItem('bl-booted', '1')
        localStorage.setItem('bl-lang', 'pt')
      } catch (e) {}
    })
    await p.goto(`http://localhost:${port}/`)
    await p.waitForTimeout(2500)
    const html = await p.evaluate(() => {
      const root = document.getElementById('root').cloneNode(true)
      const main = root.querySelector('main')
      // keep only the hero inside <main>
      ;[...main.children].slice(1).forEach((n) => n.remove())
      // drop things that only make sense once React runs
      root.querySelectorAll('canvas, video, [data-shell-skip]').forEach((n) => n.remove())
      // the live portrait layers mount later anyway
      root.querySelectorAll('figure img').forEach((img, i) => i > 0 && img.remove())
      return root.innerHTML
    })
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'hero-shell.html'), html)
    console.log('hero shell', Math.round(html.length / 1024), 'KB')
    await p.close()

    // ── 2. every section below the hero ──
    // as a robot: no intro, all sections live at once; then scroll to the end so counters reach their values
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (compatible; BaronesLabsPrerender/1.0; bot)' })
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('bl-lang', 'pt')
      } catch (e) {}
    })
    const s = await ctx.newPage()
    await s.goto(`http://localhost:${port}/`)
    await s.waitForFunction(() => document.querySelectorAll('main [data-sec]').length >= 16 && !!document.querySelector('[data-sec="footer"] footer'), null, { timeout: 30000 })
    await s.waitForTimeout(1500)
    const H = await s.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < H; y += 500) {
      await s.evaluate((y) => window.scrollTo(0, y), y)
      await s.waitForTimeout(220)
    }
    await s.waitForTimeout(2500)
    const sections = await s.evaluate(() => {
      const out = []
      for (const w of document.querySelectorAll('main [data-sec]')) {
        const c = w.cloneNode(true)
        // live-only pieces: canvases (globe, tunnel, rain), videos, embedded sites
        c.querySelectorAll('canvas, video, iframe, script, [data-shell-skip]').forEach((n) => n.remove())
        // animation states that hide content (entrances, masks, collapsed FAQ answers) → final, visible state
        for (const el of [c, ...c.querySelectorAll('[style]')]) {
          const st = el.style
          if (!st) continue
          const hiddenByMotion = st.opacity !== '' && parseFloat(st.opacity) < 0.05
          if (hiddenByMotion) st.removeProperty('opacity')
          if (hiddenByMotion || el.classList.contains('will-change-transform')) {
            st.removeProperty('transform')
            if (/blur/.test(st.filter)) st.removeProperty('filter')
          }
          if (st.visibility === 'hidden') st.removeProperty('visibility')
          if (el.hasAttribute('data-faq-answer')) {
            st.removeProperty('height')
            st.removeProperty('opacity')
            el.removeAttribute('aria-hidden')
          }
          if (!el.getAttribute('style')) el.removeAttribute('style')
        }
        // scroll-driven positions (e.g. the projects carousel) back to the start
        for (const el of c.querySelectorAll('[style*="translate"]')) {
          if (/translate(?:X|Y|3d)?\(\s*-?\d+(?:\.\d+)?px/.test(el.style.transform)) el.style.removeProperty('transform')
          if (!el.getAttribute('style')) el.removeAttribute('style')
        }
        // headings as one run of text: word-by-word masks unwrapped, so "Quem já tem um site…" reads as a sentence
        for (const mask of c.querySelectorAll('h1 span.inline-block.overflow-hidden, h2 span.inline-block.overflow-hidden, h3 span.inline-block.overflow-hidden')) {
          const inner = mask.querySelector(':scope > .will-change-transform')
          if (inner) mask.replaceWith(...inner.childNodes)
        }
        // images load lazily (they are below the first screen)
        c.querySelectorAll('img').forEach((img) => {
          img.setAttribute('loading', 'lazy')
          img.setAttribute('decoding', 'async')
        })
        out.push(c.outerHTML)
      }
      return out.join('\n')
    })
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'sections-static.html'), sections)
    console.log('sections', (sections.match(/data-sec="/g) || []).length, Math.round(sections.length / 1024), 'KB')
    await b.close()
    server.close()
  })
