import { gsap } from '../motion.js';
import { fxNode, microPause, travel } from './_utils.js';
import { scrambleFrame } from './status.js';

/**
 * Versão mobile do "DEPLOY → ONLINE": no celular a barra de deploy do herói
 * fica abaixo da dobra, então um painel HUD compacto aparece no rodapé da tela,
 * DEPLOY.BOT clica e o status vira ONLINE.
 */
export default function deployToast(step, ctx) {
  const c = step.cursorApi;
  const final = step.text ?? 'ONLINE ✓ · 0.8s';
  const node = fxNode(
    'ha-fx-toast',
    `<span class="ha-fx-toast-btn">DEPLOY</span><span class="ha-fx-toast-status">${step.pending ?? 'AGUARDANDO DEPLOY_'}</span><i class="ha-fx-toast-bar"></i>`,
    ctx
  );
  const statusEl = node.querySelector('.ha-fx-toast-status');
  const btn = node.querySelector('.ha-fx-toast-btn');
  const bar = node.querySelector('.ha-fx-toast-bar');
  const place = () => {
    node.style.width = `${window.innerWidth - 32}px`;
    gsap.set(node, { x: 16, y: window.scrollY + window.innerHeight - 76 });
  };
  ctx.relayout.add(place);

  const p = { v: 0 };
  const tl = gsap.timeline();
  tl.call(place).fromTo(node, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: 'power2.out', immediateRender: false });
  if (c) tl.add(travel(c, { target: btn, ax: 0.45, ay: 0.7 }, ctx, { duration: 0.6 }), '<');
  tl.add(microPause());
  if (c) tl.add(c.click());
  tl.call(() => btn.classList.add('ha-pressed'), null, '<')
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.inOut', immediateRender: false })
    .fromTo(p, { v: 0 }, {
      v: 1, duration: 0.45, ease: 'none', immediateRender: false,
      onUpdate: () => { statusEl.textContent = scrambleFrame(final, p.v); },
      onComplete: () => { statusEl.textContent = final; statusEl.classList.add('ha-online'); },
    }, '<0.15')
    .to(node, { autoAlpha: 0, yPercent: 30, duration: 0.3, ease: 'power2.in' }, '+=0.55');
  return tl;
}
