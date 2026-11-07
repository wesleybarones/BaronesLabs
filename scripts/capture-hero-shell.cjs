// Captures the rendered first screen (header + hero) as static HTML -> src/hero-shell.html.
// The vite plugin in vite.config.js puts it inside <div id="root"> so the headline, text and photo
// paint before any JavaScript runs (React replaces it on mount with the identical markup).
// Re-run after changing the header or hero:
//   npx vite build && node scripts/capture-hero-shell.cjs   (serves ./dist on a free port)
const { chromium } = require('playwright')
const http = require('http')
const fs = require('fs')
const path = require('path')

const dist = path.join(__dirname, '..', 'dist')
const server = http
  .createServer((q, r) => {
    let p = path.join(dist, decodeURIComponent(q.url.split('?')[0]))
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html')
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' }
    r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' })
    fs.createReadStream(p).pipe(r)
  })
  .listen(0, async () => {
    const port = server.address().port
    const b = await chromium.launch()
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
      root.querySelectorAll('canvas, [data-shell-skip]').forEach((n) => n.remove())
      // the live portrait layers mount later anyway
      root.querySelectorAll('figure img').forEach((img, i) => i > 0 && img.remove())
      return root.innerHTML
    })
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'hero-shell.html'), html)
    console.log('hero shell', Math.round(html.length / 1024), 'KB')
    await b.close()
    server.close()
  })
