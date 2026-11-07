// =====================================================================
//  COREOGRAFIA DO HERÓI — script declarativo dos cursores.
//  Cada passo: { cursor?, action, target?, at?, ...opções da ação }
//   - cursor: 'wesley' | 'ui' | 'copy' | 'deploy'  (definidos em swarm/registry.js)
//   - at: posição na timeline (GSAP): número (s), "<", ">", "+=0.2", "<0.2"…
//         sem `at` → começa quando o passo anterior termina.
//   - mobile:false → só desktop · mobileOnly:true → só mobile (< 768px).
//  No mobile a timeline roda 2× mais rápido (metade da duração) e só com 2 cursores.
//  Seletores ausentes na página são ignorados sem erro.
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
  { cursor: 'deploy', action: 'click', target: '#btn-deploy', duration: 0.3, pressClass: 'ha-pressed', at: '<0.15', mobile: false },
  { action: 'status', target: '#deploy-status', pending: 'AGUARDANDO DEPLOY_', duration: 0.45, at: '<0.15', mobile: false },
  { action: 'fill', target: '#deploy-progress', duration: 0.45, at: '<', mobile: false },
  { action: 'flash', target: '#hero-frame', color: '#D4FF24', at: '>-0.05', mobile: false },

  // mobile: a barra do herói fica abaixo da dobra → painel compacto no rodapé da tela
  { cursor: 'deploy', action: 'deployToast', text: 'ONLINE ✓ · 0.8s', mobileOnly: true, at: 1.6 },

  { action: 'exit', at: '<0.15', mobile: false },
  { action: 'exit', mobileOnly: true },
];
