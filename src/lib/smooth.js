import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion.js';

let lenis = null;
const HEADER_OFFSET = -72;

/** Inicia o Lenis (scroll suave) integrado ao ticker do GSAP/ScrollTrigger. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Âncoras internas com scroll suave + foco acessível
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute('href');
    const target = id === '#top' || id === '#' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    history.replaceState(null, '', id);
  });
  return lenis;
}

export function scrollToTarget(target) {
  const focus = () => {
    const el = target === document.body ? document.getElementById('conteudo') : target;
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  if (lenis) lenis.scrollTo(target === document.body ? 0 : target, { offset: HEADER_OFFSET, onComplete: focus });
  else {
    const y = target === document.body ? 0 : target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top: y });
    focus();
  }
}

/** Trava/destrava a rolagem (usado durante boot e montagem). */
export function lockScroll(locked) {
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (!lenis) return;
  locked ? lenis.stop() : lenis.start();
}

export const getLenis = () => lenis;
