// Pós-build: injeta o HTML pré-renderizado, o JSON-LD e o preload das fontes principais.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const entry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
const { render, buildSchema } = await import(pathToFileURL(path.join(ssrDir, entry)).href);

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Preload das fontes da dobra (Chakra Petch 700 e Inter 400).
const assets = fs.readdirSync(path.join(dist, 'assets'));
const pick = (re) => assets.find((f) => re.test(f));
const preloads = [pick(/^chakra-petch-latin-700-normal.*\.woff2$/), pick(/^inter-latin-400-normal.*\.woff2$/)]
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');

const jsonld = `<script type="application/ld+json">${JSON.stringify(buildSchema()).replace(/</g, '\\u003c')}</script>`;
const noscript = '<noscript><style>#boot{display:none!important}</style></noscript>';

html = html
  .replace('</head>', `    ${preloads}\n    ${jsonld}\n    ${noscript}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

fs.writeFileSync(indexPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender ok · ${Math.round(html.length / 1024)} KB · fontes: ${preloads ? 'preload' : 'sem preload'}`);
