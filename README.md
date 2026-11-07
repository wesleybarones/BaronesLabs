# Barones Labs — landing page oficial

React 18 + Vite + Tailwind CSS v4 + Motion (Framer Motion) + Lenis. Somente front-end; todos os CTAs abrem o WhatsApp.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera /dist para publicar (Vercel, Netlify, Hostinger etc.)
```

## O que trocar antes de publicar

| O quê | Onde |
|---|---|
| Número do WhatsApp | `src/config.js` → `WHATSAPP_NUMBER` |
| Links e prints dos projetos (Lizano, papeldeparederj) | `src/config.js` → `PROJECTS` (prints em `/public`, 16:10 e 9:19.5) |
| Adicionar projeto novo | copie um objeto em `PROJECTS` + segmento em `portfolio.segments` nas traduções |
| Foto do Wesley | coloque em `/public` e informe em `ABOUT_PHOTO` |
| Depoimentos reais | `src/sections/Testimonials.jsx` → `TESTIMONIALS` |
| Logos oficiais | PNGs originais na raiz; versões do site em `src/assets/brand/`, usadas por `src/components/Logo.jsx` |
| Textos PT / EN / ES | `src/i18n/translations.js` (`*palavra*` = destaque ciano com duplo magenta) |

## Estrutura
- `src/index.css` — tokens de cor/tipografia, chanfros, glitch, HUD, fundo global
- `src/components/` — Boot, Header, Cursor, barra de progresso, WhatsApp flutuante, mockups, UI (Button magnético, Reveal direcional, TiltCard, Counter…)
- `src/sections/` — uma seção por arquivo, na ordem da página

## SEO técnico
- Domínio definitivo: `https://baroneslabs.com.br` — definido em `src/config.js` (`SITE_URL`), `index.html`, `public/sitemap.xml` e `public/robots.txt`. Se mudar, troque nos quatro.
- Head por idioma: `src/components/Seo.jsx` (react-helmet-async). O `index.html` traz a versão PT estática (`data-rh="true"`) para robôs sem JavaScript.
- Dados estruturados (LocalBusiness/ProfessionalService, WebSite, WebPage, BreadcrumbList, Person, FAQPage): JSON-LD no `index.html`. Se mudar o FAQ, atualize também o FAQPage.
- Search Console: arquivo `public/google9d5192b7753c9d3d.html` (verificação por arquivo) e espaço para a meta tag no `<head>`.
- Prévias de link: robôs de redes sociais (WhatsApp, Facebook…) recebem `public/og.html` (só as tags), pela regra em `vercel.json`. Se mudar título/descrição/imagem, atualize também esse arquivo.
- Imagem de compartilhamento: `public/og-baroneslabs-v3-1200x630.jpg` (1200×630), gerada de `design-refs/og/og-image.html`. Ao trocar, use um nome de arquivo novo (os apps guardam a prévia em cache) e atualize `src/config.js` e `index.html`.
- Fontes self-hosted via `@fontsource` (`src/fonts.js`), com preload da imagem do hero e das fontes principais (plugin em `vite.config.js`).

## Globo ("Do Rio de Janeiro para o mundo")

- Componente: `src/components/DotGlobe.jsx` (Canvas 2D, sem biblioteca 3D); sessão: `src/sections/Reach.jsx`.
- Pontos dos continentes: `src/assets/globe-land.json` (lat×10, lon×10), gerados a partir do
  Natural Earth 110m (pacote `world-atlas`, domínio público) amostrando uma esfera de Fibonacci com
  30 000 pontos e mantendo os que caem em terra (sem a Antártida).
- Os arcos marcam regiões atendidas em cada idioma (PT/EN/ES), não clientes. Edite `TARGETS` em `Reach.jsx`.

## Hero "viva" (sem vídeo)

- `src/components/LivePortrait.jsx`: a foto vira camadas (`src/assets/live/plate-780.webp` = fundo,
  `person-780.webp` = recorte, `visor-mask.png` = máscara das lentes). Cursor/giroscópio movem as camadas,
  uma luz ciano segue o ponteiro e as lentes têm reflexos animados.
- O reflexo do notebook nas lentes mostra os pacotes atuais (Fast R$ 497, Profissional R$ 1.397,
  Premium R$ 1.497 em destaque). Se os preços mudarem, refaça o reflexo e regere as camadas.
- Cursor: seta SVG nativa (`src/assets/cursor-arrow*.svg`), sem atraso.
