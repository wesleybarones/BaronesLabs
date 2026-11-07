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
  `person-780.webp` = recorte). Cursor/giroscópio movem as camadas,
  e uma luz ciano segue o ponteiro (lentes sem animação extra, só a linha de varredura original).
- O reflexo do notebook nas lentes mostra os pacotes atuais (Fast R$ 497, Profissional R$ 1.397,
  Premium R$ 1.497 em destaque). Se os preços mudarem, refaça o reflexo e regere as camadas.
- Cursor: seta SVG nativa (`src/assets/cursor-arrow*.svg`), sem atraso.

## Montagem do hero ("o site que se constrói sozinho")

- `src/hero-assembly/assembly.js` (chunk separado, carregado só quando vai rodar) + estilos `ha-*` em `src/index.css`.
- Roda na **primeira visita**, logo depois da explosão de LEDs, e no botão **↻ Rever montagem** (abaixo das provas).
  Robôs, PageSpeed/Lighthouse e quem usa "reduzir movimento" veem o hero normal.
- Quatro cursores: **W.BARONES** (seleciona "Entrega 48h–7 dias", Ctrl+C e arrasta a cópia para a foto, com guias
  magenta e encaixe), **UI.BOT** (desenha o contorno neon da foto e solta os chips), **COPY.BOT** (digita o título
  letra por letra, traz texto, botões e provas) e **DEPLOY.BOT** (clica em "Quero meu site": "AGUARDANDO DEPLOY_"
  vira ONLINE e a barra enche). Desktop ≈ 6s. Celular ≈ 7,5s em três atos ("câmera que acompanha"): 1) no topo, título, texto e botões;
  2) a página desce sozinha até a foto, que ganha vida com o vídeo enquanto os 4 cursores (menores) trabalham nela:
  arraste sincronizado com a mão e DEPLOY no status da própria foto, junto com o toque no ar; 3) volta ao topo.
- "Pular animação →" ou Esc encerram; mudar o tamanho da janela ou o idioma também.
- O estado final é o próprio HTML da página: a montagem só esconde/revela (visibility, opacity, transform) e devolve
  tudo no fim. Ela procura os IDs `hero-status`, `hero-kicker`, `hero-title`, `hero-sub`, `hero-ctas`, `hero-proofs`,
  `proof-48h`, `slot-proof`, `hero-frame`, `btn-deploy`, `deploy-status`, `deploy-progress` e os chips `data-ha-chip`;
  se algum faltar, aquele passo é pulado.
- **Foto viva:** durante a montagem a foto vira vídeo (clipe do Google Flow/Veo, recortado em 4:5, sem som):
  `src/assets/hero-video/` (WebM VP9 + MP4 H.264, 720×900 no desktop e 480×600 no celular) e `src/hero-assembly/video.js`.
  No desktop o encaixe do card espera o "agarrar" do vídeo (3,4s) e o clique do DEPLOY espera o toque no ar (4,0s);
  no celular ele começa (escondido na moldura) enquanto o contorno é desenhado, com os mesmos encontros. No fim ele se dissolve de volta na foto.
  Para trocar o clipe: recorte 864×1080 do centro do 1920×1080 e gere os 4 arquivos com os mesmos nomes.
- **Sons** (`src/hero-assembly/sound.js`): efeitos sci-fi sintetizados por código (Web Audio, sem arquivos): teclado no título,
  "tic" na seleção, arraste, encaixe, cliques e acorde no ONLINE. Navegadores só tocam som depois de um clique, então
  a primeira montagem começa muda com o botão **Ativar som** (a escolha fica salva em `localStorage` `bl-sound`);
  o **↻ Rever montagem** já toca com som, a menos que a pessoa tenha desligado.
- Ritmo e ordem: funções `copyTrack`, `uiTrack`, `wesleyTrack` e `deployTrack` dentro de `play()`.
  Nomes e cores dos cursores: `CURSORS` no topo do arquivo. Textos (PT/EN/ES): `hero.assembly` em `translations.js`.

## Primeira tela estática (desempenho no celular)

- `src/hero-shell.html` é o HTML do cabeçalho + hero já renderizado, colocado dentro de `#root` no build
  (plugin em `vite.config.js`). Ele aparece antes do JavaScript; o React substitui pelo mesmo conteúdo.
- Na primeira visita uma capa escura (o fundo da intro) cobre a tela até a intro começar.
- **Depois de mudar o cabeçalho ou a hero, regenere:** `npx vite build && node scripts/capture-hero-shell.cjs`
  e faça o build de novo.
