# Animação do herói — Barones Labs

Pacote isolado da montagem do herói ("o site que se constrói sozinho"):

- **Boot**: logo, "INICIALIZANDO_", barra de progresso e "pular →", com saída em glitch.
- **4 cursores**: W.BARONES, UI.BOT, COPY.BOT e DEPLOY.BOT.
- **Ações**: desenhar, digitar, selecionar, copiar, arrastar com guias magenta, encaixar e DEPLOY → ONLINE ✓.
- **Botões**: "Pular animação" e "↻ Rever montagem".

Duração: ~6s no desktop e ~3,7s no celular (2 cursores, metade do tempo, sem arraste
longo). Com `prefers-reduced-motion`, não há animação.

## Instalação

Requisitos: **React 18+** e **GSAP 3**. Não depende de Tailwind nem de Lenis.

```bash
npm install gsap
```

Copie a pasta `src/` deste pacote para o seu projeto, por exemplo em `src/hero-animation/`.

## Uso

```jsx
import { HeroAnimation } from './hero-animation/index.js'; // já importa o CSS

export default function Hero() {
  return (
    <section id="top">
      {/* …seu herói, com os IDs da tabela abaixo… */}
      <HeroAnimation logo="/brand/logo-720.webp" logoAlt="Barones Labs" />
    </section>
  );
}
```

`example/HeroExample.jsx` mostra um herói completo com todos os IDs.

### IDs que a coreografia procura

Os IDs que faltarem na página são **ignorados sem erro**: a animação só pula aquele passo.

| ID | O que acontece |
|---|---|
| `#hero-frame` | UI.BOT desenha o contorno neon. No fim, recebe um pulso verde |
| `#hero-title` | COPY.BOT digita o texto letra por letra (spans `.hl` ganham o contorno só no fim) |
| `#hero-status`, `#hero-kicker` | aparecem no início |
| `#hero-proofs > li` | aparecem em cascata |
| `#proof-48h` | W.BARONES seleciona (alças + medida), copia (Ctrl+C) e arrasta a cópia |
| `#slot-proof` | destino do arraste: encaixa com mola e flash ciano |
| `#hero-sub`, `#hero-ctas`, `#hero-chips` | aparecem depois do título |
| `#btn-deploy` | DEPLOY.BOT clica (o botão acende, classe `ha-pressed`) |
| `#deploy-status` | texto final do status. Durante a montagem mostra "AGUARDANDO DEPLOY_" e embaralha até o texto original |
| `#deploy-progress` | barra que se completa (scaleX 0 → 1) |
| `#replay-slot` | onde aparece o botão "↻ Rever montagem" (opcional) |

O estado final da animação é igual ao HTML original. Por isso a página continua
correta para SEO e para quem não tem JavaScript.

### Props do `<HeroAnimation />`

| Prop | Padrão | Descrição |
|---|---|---|
| `logo`, `logoAlt` | — | imagem do boot |
| `bootText`, `bootSkip` | `'INICIALIZANDO'`, `'pular →'` | textos do boot |
| `showBoot` | `true` | `false` = começa a montagem direto, sem a tela de boot |
| `script` | `heroScript` | passos da coreografia |
| `skipLabel`, `replayLabel` | `'Pular animação →'`, `'↻ Rever montagem'` | textos dos botões |
| `replaySlot` | `'#replay-slot'` | seletor de onde renderizar o botão "Rever" |
| `lockScroll` | `true` | trava a rolagem durante boot + montagem |
| `onDone` | — | chamado quando a página fica 100% utilizável |

**Lenis:** se o site usa Lenis, chame `lenis.stop()` e `lenis.start()` junto da
trava (`lockScroll={false}` + `onDone`). Também dá para manter `lockScroll` ligado.

## Editar a coreografia: `src/choreography.js`

```js
{ cursor: 'ui', action: 'draw', target: '#hero-frame', duration: 0.95, at: 0 },
{ cursor: 'copy', action: 'type', target: '#hero-title', at: 0.1 },
{ cursor: 'wesley', action: 'drag', from: '#proof-48h', to: '#slot-proof', mobile: false },
```

- `cursor`: `wesley` | `ui` | `copy` | `deploy`. Nomes, cores e quais aparecem no celular ficam em `src/swarm/registry.js`.
- `at`: posição na timeline do GSAP.
  - Número = segundos desde o início.
  - `"<"` = junto com o passo anterior.
  - `"<0.2"` = 0,2s depois do início do anterior.
  - `"+=0.1"` = 0,1s depois do fim.
  - Sem `at`, o passo começa quando o anterior termina.
  - É assim que os cursores trabalham em paralelo.
- `mobile: false` deixa o passo só no desktop. `mobileOnly: true` deixa só no celular.

### Ações (`src/actions/`)

| Ação | Opções |
|---|---|
| `move` | `ax`, `ay` (0–1), `dx`, `dy`, `duration` |
| `click` | `trigger: true` clica de verdade, `pressClass` |
| `draw` | `color`, `hide: false` (só contorno), `duration` |
| `type` | `speed`, `travel` |
| `select` | `label` (padrão: medida real "L × A") |
| `copy` | `shortcut` (padrão "Ctrl+C") |
| `drag` | `from`, `to`, `duration` |
| `snap`, `reveal`, `fill`, `flash` | `duration`, `color`, `stagger` |
| `status` | `text`, `pending` |
| `deployToast` | painel DEPLOY no rodapé da tela (usado no celular) |
| `exit` | os cursores se dispersam |

**Criar uma ação nova:**
1. Crie `src/actions/minhaAcao.js` exportando
   `function (step, ctx) { return gsap.timeline() }`.
   Opcionalmente, adicione `minhaAcao.prepare = (step, ctx) => …` para esconder o estado inicial.
2. Registre a ação em `src/actions/index.js`.

Regras que mantêm tudo robusto:
- Leia posições na execução, com `point()`, `rectDoc()` e `travel()` de `_utils.js`.
- Registre em `ctx.relayout` o que precisa se reposicionar no resize.
- Anime só `transform` e `opacity`.

## Cores

As cores ficam em variáveis no topo de `src/hero-animation.css` (`--ha-cyan`,
`--ha-magenta`, `--ha-lime`…). Todas as classes têm o prefixo `ha-`, para não
colidir com o CSS do site.

## Estrutura

```
src/
  index.js              ← exporta HeroAnimation, heroScript, createChoreography
  HeroAnimation.jsx     ← componente (boot + cursores + motor + botões)
  Boot.jsx              ← tela de inicialização
  choreography.js       ← passos da montagem
  engine.js             ← motor (master timeline, resize, pular, desfazer)
  motion.js             ← GSAP + MotionPathPlugin
  actions/*.js          ← uma ação por arquivo
  swarm/                ← Cursor.jsx, Swarm.jsx, registry.js
  hero-animation.css    ← estilos
example/HeroExample.jsx ← herói de exemplo com todos os IDs
```
