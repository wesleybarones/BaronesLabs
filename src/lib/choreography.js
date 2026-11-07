// =====================================================================
//  COREOGRAFIA — script declarativo dos cursores.
//  Cada passo: { cursor?, action, target?, at?, ...opções da ação }
//   - cursor: 'wesley' | 'ui' | 'copy' | 'deploy'
//   - action: move | click | draw | type | select | copy | drag | snap |
//             reveal | status | fill | flash | deployToast | exit
//   - at: posição na timeline (GSAP): número (segundos), "<", ">", "+=0.2", "<0.2"…
//         sem `at` → começa quando o passo anterior termina.
//   - mobile:false → só desktop · mobileOnly:true → só mobile (< 768px).
//  No mobile a timeline toda roda 2× mais rápido (metade da duração).
//  Os textos vêm do HTML/site.js; aqui só há seletores e tempos.
// =====================================================================

export const heroScript = [
  // t=0 — UI.BOT desenha a moldura enquanto COPY.BOT digita o título
  { action: 'reveal', target: '#hero-status, #hero-kicker', at: 0 },
  { cursor: 'ui', action: 'draw', target: '#hero-frame', duration: 0.95, travel: 0.55, at: 0 },
  { cursor: 'copy', action: 'type', target: '#hero-title', travel: 0.5, speed: 0.03, at: 0.1 },
  { action: 'reveal', target: '#hero-proofs > li', at: 0.2 },
  { cursor: 'deploy', action: 'move', target: '#btn-deploy', ax: 0.75, ay: 1.1, at: 1.2, mobile: false },
  { action: 'reveal', target: '#hero-sub, #hero-ctas, #hero-chips', at: 2.0 },

  // W.BARONES seleciona, copia (Ctrl+C) e arrasta a prova até o encaixe
  { cursor: 'wesley', action: 'select', target: '#proof-48h', duration: 0.6, at: 0.25 },
  { cursor: 'wesley', action: 'copy', target: '#proof-48h', mobile: false },
  { cursor: 'wesley', action: 'drag', from: '#proof-48h', to: '#slot-proof', mobile: false },
  { action: 'snap', target: '#slot-proof', mobile: false, at: '-=0.3' },

  // DEPLOY.BOT publica → barra completa → ONLINE ✓ → pulso verde no bloco
  { cursor: 'deploy', action: 'click', target: '#btn-deploy', duration: 0.3, pressClass: 'is-pressed', at: '<0.15', mobile: false },
  { action: 'status', target: '#deploy-status', pending: 'AGUARDANDO DEPLOY_', duration: 0.45, at: '<0.15', mobile: false },
  { action: 'fill', target: '#deploy-progress', duration: 0.45, at: '<', mobile: false },
  { action: 'flash', target: '#hero-frame', color: '#D4FF24', at: '>-0.05', mobile: false },

  // mobile: a barra do herói fica abaixo da dobra → painel compacto no rodapé da tela
  { cursor: 'deploy', action: 'deployToast', text: 'ONLINE ✓ · 0.8s', mobileOnly: true, at: 1.6 },

  { action: 'exit', at: '<0.15', mobile: false },
  { action: 'exit', mobileOnly: true },
];

// =====================================================================
//  MINI-COREOGRAFIAS DAS SEÇÕES (1,5–2,5s cada, disparam uma vez ao entrar na tela)
//  { trigger: seção, start?: posição do ScrollTrigger, mobile?: false, steps: [...] }
// =====================================================================
export const sectionScripts = [
  {
    // Diagnóstico: W.BARONES marca cada erro e o scanner corrige → "Sistema OK"
    trigger: '#diagnostico',
    start: 'top 55%',
    steps: [
      { cursor: 'wesley', action: 'mark', target: '#diagnostico .diag-code', enter: 0.45, travel: 0.22, pause: 0.08, at: 0 },
      { action: 'fill', target: '#diag-bar', duration: 0.8, at: '+=0.05' },
      { action: 'scan', target: '#diag-panel', scanner: '#diag-scanner', rows: '#diagnostico .diag-item', fix: '.diag-code', fixClass: 'is-fixed', tag: '.diag-fix', duration: 0.8, at: '<' },
      { action: 'reveal', target: '#diag-ok', duration: 0.3 },
      { action: 'exit', at: '<' },
    ],
  },
  {
    // Solução: DEPLOY.BOT vai ticando o checklist enquanto a barra de build completa
    trigger: '#sol-widget',
    start: 'top 65%',
    steps: [
      { cursor: 'deploy', action: 'mark', target: '#sol-checklist .sol-tick', enter: 0.45, travel: 0.16, pause: 0.06, from: 2, at: 0 },
      { action: 'fill', target: '#sol-build-bar', duration: 1.6, ease: 'power1.inOut', at: 0.3 },
      { action: 'exit', at: '+=0.05' },
    ],
  },
  {
    // Projetos: W.BARONES arrasta o primeiro card do carrossel
    trigger: '#portfolio',
    start: 'top 45%',
    steps: [
      { cursor: 'wesley', action: 'swipe', target: '#proj-track', item: '#proj-track .proj-card', distance: 0.55, at: 0 },
      { action: 'exit', at: '+=0.05' },
    ],
  },
  {
    // Pacotes: COPY.BOT "digita" os preços; UI.BOT desenha a borda magenta do Premium
    trigger: '#pricing',
    start: 'top 45%',
    steps: [
      { cursor: 'ui', action: 'draw', target: '#plan-premium > .hud', color: '#E040D8', hide: false, travel: 0.45, duration: 1.2, at: 0, mobile: false },
      { cursor: 'copy', action: 'type', target: '#plan-fast .plan-price', travel: 0.4, speed: 0.04, at: 0.05 },
      { cursor: 'copy', action: 'type', target: '#plan-pro .plan-price', travel: 0.3, speed: 0.04, mobile: false },
      { cursor: 'copy', action: 'type', target: '#plan-premium .plan-price', travel: 0.3, speed: 0.04, mobile: false },
      { action: 'exit', at: '+=0.05' },
    ],
  },
  {
    // Depoimentos: W.BARONES clica na seta → e o carrossel desliza (setas só no desktop)
    trigger: '#depoimentos',
    start: 'top 50%',
    mobile: false,
    steps: [
      { cursor: 'wesley', action: 'click', target: '#dep-next', trigger: true, duration: 0.6, at: 0 },
      { action: 'exit', at: '+=0.5' },
    ],
  },
  {
    // FAQ: um cursor abre a primeira pergunta
    trigger: '#faq',
    start: 'top 55%',
    steps: [
      { cursor: 'wesley', action: 'click', target: '#faq-q-0', ax: 0.25, ay: 0.55, trigger: 'expand', duration: 0.6, at: 0 },
      { action: 'exit', at: '+=0.6' },
    ],
  },
];
