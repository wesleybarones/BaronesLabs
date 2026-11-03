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
- Imagem de compartilhamento: `public/og-image.jpg` (1200×630), gerada de `design-refs/og/og-image.html`. Ao trocar, aumente o `?v=` em `src/config.js` e no `index.html`.
- Fontes self-hosted via `@fontsource` (`src/fonts.js`), com preload da imagem do hero e das fontes principais (plugin em `vite.config.js`).
