// Efeitos ligados à rolagem (sem cursores): túnel, linha do tempo e chuva de moedas.
// Só transform/opacity no DOM; a chuva é um canvas leve que pausa fora da tela.
import { gsap } from './motion.js';

export function initScrollEffects({ mobile }) {
  const cleanups = [];
  const ctx = gsap.context(() => {
    // Túnel "Conectando você ao seu cliente"
    const rings = gsap.utils.toArray('#sol-tunnel .tunnel-ring');
    if (rings.length) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#sol-tunnel', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
      rings.forEach((r, i) => {
        tl.fromTo(r, { scale: 0.1, opacity: 0 }, { scale: 1.3, opacity: 0.85, duration: 0.5, ease: 'none' }, i * 0.1)
          .to(r, { scale: 4.2, opacity: 0, duration: 0.5, ease: 'none' }, i * 0.1 + 0.5);
      });
      tl.fromTo('#sol-tunnel .tunnel-text', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power1.out' }, 0.25)
        .to('#sol-tunnel .tunnel-text', { opacity: 0.35, duration: 0.3 }, '>+0.4');
    }

    // Linha do tempo do processo que se desenha com a rolagem
    const line = document.getElementById('proc-line');
    const steps = gsap.utils.toArray('#proc-timeline .proc-step');
    if (line && steps.length) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#proc-timeline', start: 'top 78%', end: 'bottom 60%', scrub: 0.6 } });
      tl.fromTo(line, mobile ? { scaleY: 0 } : { scaleX: 0 }, { ...(mobile ? { scaleY: 1 } : { scaleX: 1 }), duration: 1, ease: 'none' }, 0);
      steps.forEach((s, i) => {
        tl.fromTo(s, { opacity: 0.25, y: 10 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power1.out' }, (i / steps.length) * 0.85);
      });
    }
  });
  cleanups.push(() => ctx.revert());

  const rain = document.getElementById('missao-rain');
  if (rain) cleanups.push(initCoinRain(rain, { count: mobile ? 14 : 28 }));

  return () => cleanups.forEach((fn) => fn());
}

/** Chuva sutil de moedas e notas em partículas leves (canvas 2D). */
function initCoinRain(canvas, { count }) {
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf = 0, last = 0, visible = false;
  const parts = [];
  const spawn = (p = {}, top = false) => Object.assign(p, {
    x: Math.random() * w,
    y: top ? -20 - Math.random() * 60 : Math.random() * h,
    vy: 18 + Math.random() * 30,
    sway: Math.random() * Math.PI * 2,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 1.2,
    note: Math.random() < 0.35,
    s: 0.7 + Math.random() * 0.6,
    a: 0.18 + Math.random() * 0.3,
  });
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    if (!parts.length) for (let i = 0; i < count; i++) parts.push(spawn({}));
  };
  const draw = (t) => {
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y += p.vy * dt; p.sway += dt; p.rot += p.vr * dt;
      if (p.y > h + 20) spawn(p, true);
      const x = p.x + Math.sin(p.sway) * 10;
      ctx.save();
      ctx.translate(x, p.y); ctx.rotate(p.rot); ctx.scale(p.s, p.s);
      ctx.globalAlpha = p.a;
      if (p.note) {
        ctx.strokeStyle = '#D4FF24'; ctx.lineWidth = 1;
        ctx.strokeRect(-11, -6, 22, 12);
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.strokeStyle = '#E8C98A'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.font = '600 8px "JetBrains Mono", monospace'; ctx.fillStyle = '#E8C98A';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, 0.5);
      }
      ctx.restore();
    }
    raf = visible ? requestAnimationFrame(draw) : 0;
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { last = 0; raf = requestAnimationFrame(draw); }
  });
  io.observe(canvas);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); ctx.clearRect(0, 0, w, h); };
}
