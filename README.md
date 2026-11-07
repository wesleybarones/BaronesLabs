# Barones Labs — "o site que se constrói sozinho"

Landing page da Barones Labs (Niterói-RJ). Ao abrir, um enxame de 4 cursores
(W.BARONES, UI.BOT, COPY.BOT e DEPLOY.BOT) monta o herói na frente do visitante:
desenha, digita, seleciona, copia, arrasta, encaixa e faz o **DEPLOY → ONLINE ✓**.

Stack: Vite + React + Tailwind CSS · GSAP 3 (Timeline, ScrollTrigger, MotionPathPlugin) · Lenis.

## Rodar

```bash
npm install
npm run dev       # desenvolvimento (http://localhost:5173)
npm run build     # build de produção + pré-renderização do HTML (pasta dist/)
npm run preview   # serve o build (http://localhost:4173)
```

**Deploy na Vercel:** importe o repositório. A Vercel detecta o Vite e usa
`npm run build` e a pasta `dist`. Os cabeçalhos de cache ficam em `vercel.json`.

---

## Editar conteúdo: `src/content/site.js`

**Todos os textos** da página estão neste arquivo: herói, seções, projetos,
pacotes, FAQ, depoimentos e rodapé. Trocar conteúdo **nunca** exige mexer nas animações.

- **Destaque nos títulos:** coloque a palavra entre asteriscos. Ela fica ciano
  com duplo contorno magenta. Ex.: `'Construindo *Negócios.*'`.
- **Projetos** (`projetos.items`):
  - `url: null` mostra "Link em breve" com o botão desativado.
  - `shots: { desktop: '/brand/x-desktop.webp', mobile: '/brand/x-mobile.webp' }`
    usa prints reais (desktop 16:10, celular 9:19.5).
  - Sem `shots`, a página gera um mockup no estilo da marca a partir de `mock`
    (cores, fontes, logo, headline e layout `jewel | pattern | barber | naval | serene`).
- **Pacotes** (`pacotes.plans`): `price` é numérico (usado no JSON-LD).
  `priceLabel` é o texto exibido. `waName` é o nome usado na mensagem do WhatsApp.
- **Depoimentos:** cole o texto do Google **sem editar**. Use `business` (opcional)
  para mostrar "{Negócio} · Avaliação no Google". Textos com mais de 160
  caracteres ficam automaticamente com fonte menor.
- **SEO:** o JSON-LD (ProfessionalService, FAQPage e Offers) é **gerado no build** a
  partir deste arquivo (`src/seo/schema.js`). Ao mudar FAQ, preços ou avaliações,
  o JSON-LD acompanha.

## Editar configurações: `src/config.js`

- **WhatsApp:** número e as 3 mensagens (padrão, por pacote com `{NOME}`, e manutenção).
  Todos os CTAs usam `waLink(msg)`, `waPackage(nome)` ou `waMaintenance()`.
- **Instagram**, **URL do site** e **link das avaliações no Google**.
- **Imagens** (`assets`): logo, símbolo, foto e imagem OG.

### Imagens da marca

As imagens vêm do site atual (baroneslabs.com.br). Para trocar, substitua o arquivo
mantendo o nome, ou ajuste o caminho em `config.js`.

| Arquivo | Onde aparece |
|---|---|
| `public/brand/logo-720.webp` / `logo-360.webp` | cabeçalho, rodapé e boot (srcset) |
| `public/brand/symbol-480.webp` | símbolo (JSON-LD) |
| `public/brand/wesley-avatar-{520,780,1040}.webp` | foto do herói, com óculos futurista (srcset) |
| `public/brand/wesley.webp` | foto da seção "Quem está por trás" |
| `public/brand/portfolio/*.webp` | prints reais de Lizano e Papel de Parede RJ |
| `public/favicon*`, `apple-touch-icon.png`, `icon-512.png`, `site.webmanifest` | ícones |
| `public/og-baroneslabs-v3-1200x630.jpg` | imagem de compartilhamento |

---|---|
| `public/brand/logo-baroneslabs.svg` | logo horizontal (cabeçalho, rodapé e boot) |
| `public/brand/simbolo-baroneslabs.svg` | símbolo (favicon) |
| `public/brand/wesley-barones.svg` | **foto provisória**. Salve a real como `wesley-barones.webp` e ajuste `assets.avatar` em `config.js` |
| `public/og-baroneslabs-v3-1200x630.jpg` | imagem de compartilhamento (gerada com as cores e fontes da marca) |

---

## Coreografia: `src/lib/choreography.js`

A animação é um **script declarativo** de passos:

```js
{ cursor: 'ui', action: 'draw', target: '#hero-frame', duration: 1.0, at: 0 },
{ cursor: 'copy', action: 'type', target: '#hero-title', at: 0.1 },
{ cursor: 'wesley', action: 'select', target: '#proof-48h', at: 0.25 },
{ cursor: 'wesley', action: 'copy', target: '#proof-48h', mobile: false },
{ cursor: 'wesley', action: 'drag', from: '#proof-48h', to: '#slot-proof', mobile: false },
{ action: 'snap', target: '#slot-proof', at: '-=0.3' },
```

- `cursor`: `wesley` | `ui` | `copy` | `deploy`. Os cursores ficam definidos em `src/lib/swarm/registry.js`.
- `at`: posição na timeline do GSAP.
  - Número = segundos desde o início.
  - `"<"` = junto com o passo anterior.
  - `"<0.2"` = 0,2s depois do início do anterior.
  - `"+=0.1"` = 0,1s depois do fim.
  - Sem `at`, o passo começa quando o anterior termina.
  - É assim que os cursores trabalham **em paralelo**.
- `mobile: false` deixa o passo só no desktop. `mobileOnly: true` deixa só no celular.
  No celular (< 768px) ficam só **2 cursores**, a timeline toda roda **2× mais rápido** e não há arraste longo.
- `heroScript` é a montagem do herói (≤ 7s com o boot). `sectionScripts` são as
  mini-coreografias das seções: cada uma dispara **uma vez** quando a seção entra
  na tela (`trigger`, `start` do ScrollTrigger).

### Ações disponíveis (`src/lib/actions/`)

| Ação | O que faz | Opções principais |
|---|---|---|
| `move` | leva o cursor até o alvo (curva bezier "humana") | `ax`, `ay` (0–1), `dx`, `dy`, `duration` |
| `click` | move, micro-pausa de 80–200ms, clique com ripple | `trigger: true` clica de verdade (`'expand'` não fecha o que já está aberto), `pressClass` |
| `draw` | traça o contorno neon do bloco | `color`, `hide: false` (só o contorno, sem esconder o bloco) |
| `type` | digita o texto letra por letra com caret "_" | `speed`, `travel` |
| `select` | caixa de seleção com alças e medida "L × A" | `label` |
| `copy` | tooltip "Ctrl+C" e um clone do elemento | `shortcut` |
| `drag` | arrasta o clone até `to`, com guias magenta e medidas em px | `duration` |
| `snap` | encaixe com mola e flash ciano | — |
| `reveal` | revela elementos em cascata | `stagger` |
| `status` | texto com efeito "scramble" | `text`, `pending` |
| `fill` | barra de progresso (scaleX 0 → 1) | `duration` |
| `flash` | pulso de luz sobre um bloco | `color` |
| `mark` | o cursor visita vários alvos e cada um "salta" | `enter`, `travel`, `pause` |
| `scan` | faixa que varre um painel e "corrige" cada linha | `rows`, `fix`, `fixClass`, `tag` |
| `swipe` | arrasta um carrossel para o lado e solta | `item`, `distance` |
| `deployToast` | painel DEPLOY → ONLINE no rodapé da tela (mobile) | `text` |
| `exit` | cursores se dispersam | `cursors` |

**Criar uma ação nova:**
1. Crie `src/lib/actions/minhaAcao.js` exportando
   `function (step, ctx) { return gsap.timeline() }`.
   Opcionalmente, adicione `minhaAcao.prepare = (step, ctx) => …` para esconder o estado inicial.
2. Registre a ação em `src/lib/actions/index.js`.

Regras que mantêm tudo robusto:
- **Leia posições na execução**, nunca no build da timeline. Use `point()`, `rectDoc()` e `travel()` de `_utils.js`.
- Registre em `ctx.relayout` qualquer função que reposicione algo. Ela roda no resize (com debounce).
- **Anime só `transform` e `opacity`.**
- O estado final da animação deve ser igual ao estado natural da página. O motor
  (`src/lib/engine.js`) desfaz tudo ao terminar ou ao clicar em "Pular animação".

## Como a página funciona

- **SEO:** `npm run build` pré-renderiza o React. **Todo o texto já vem no HTML**, e a
  animação só esconde e revela. O build também injeta o JSON-LD e o preload das
  fontes Chakra Petch e Inter. Sem JavaScript, a página aparece completa.
- **Fontes:** hospedadas no próprio site (`@fontsource`, `font-display: swap`). As
  fontes das marcas dos mockups só carregam quando a seção de projetos monta.
- **Carregamento sob demanda:** o globo e os dados dos continentes carregam por
  `import()` + IntersectionObserver perto da seção. As mini-coreografias e os
  efeitos de rolagem (túnel, linha do tempo, chuva de moedas) carregam quando o herói termina.
- **Acessibilidade:**
  - Com `prefers-reduced-motion`, não há boot nem cursores, e a página aparece no estado final.
  - Os cursores usam `aria-hidden` e `pointer-events: none`.
  - Há o link "Pular para o conteúdo", foco visível, e o FAQ usa `button` + `aria-expanded`.
- **Controles:** "Pular animação →" aparece durante a montagem. "↻ Rever montagem" aparece no herói depois dela.

## Estrutura

```
src/
  content/site.js        ← textos
  config.js              ← WhatsApp, Instagram, URLs, imagens
  lib/choreography.js    ← scripts da coreografia (herói + seções)
  lib/engine.js          ← motor (master timeline, resize, pular, desfazer)
  lib/actions/*.js       ← uma ação por arquivo
  lib/sections.js        ← dispara as mini-coreografias (ScrollTrigger once)
  lib/effects.js         ← túnel, linha do tempo e chuva de moedas
  components/swarm/      ← Cursor.jsx e Swarm.jsx
  components/            ← seções da página
  seo/schema.js          ← JSON-LD
scripts/prerender.mjs    ← injeta HTML, JSON-LD e preloads no build
```
