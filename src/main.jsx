// fonts + styles stay in the entry so the stylesheet is inlined in index.html (no render-blocking request)
import './fonts'
import './index.css'

// Entry: let the browser paint the static first screen (src/hero-shell.html, injected in #root)
// before the app's JavaScript is evaluated, then start React, which replaces it with identical markup.
const go = () => import('./start.jsx').then((m) => m.default())
if (document.getElementById('root')?.childElementCount) requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(go, 0)))
else go()
