"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSwipe, swipeTarget } from "@/lib/nav";

/** Troca de aba deslizando o dedo para os lados.
 *  Acompanha o dedo o tempo todo (o iPhone às vezes cancela o toque em vez de soltar)
 *  e arrasta a tela junto, como num app nativo. */
export function SwipeNav() {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const c = document.getElementById("conteudo");
    if (c) { c.style.transition = ""; c.style.transform = ""; c.style.opacity = ""; c.style.willChange = ""; }
  }, [path]);

  // pré-carrega só as abas vizinhas, alguns segundos depois (sem disputar a internet com a abertura)
  useEffect(() => {
    const t = setTimeout(() => {
      const ir = () => {
        for (const lado of ["esquerda", "direita"] as const) {
          const alvo = swipeTarget(path, lado);
          if (alvo) router.prefetch(alvo);
        }
      };
      const w = window as Window & { requestIdleCallback?: (f: () => void) => void };
      if (w.requestIdleCallback) w.requestIdleCallback(ir); else ir();
    }, 3000);
    return () => clearTimeout(t);
  }, [path, router]);

  useEffect(() => {
    let x0 = 0, y0 = 0, x = 0, y = 0, t0 = 0, ativo = false, horizontal: boolean | null = null;
    const conteudo = () => document.getElementById("conteudo");
    const ignorar = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("[data-noswipe], input, textarea, select, [contenteditable=true]");

    const soltarTela = (animar: boolean) => {
      const c = conteudo();
      if (!c) return;
      c.style.transition = animar ? "transform .25s ease-out" : "";
      c.style.transform = "";
      c.style.willChange = "";
      if (animar) setTimeout(() => { c.style.transition = ""; }, 260);
    };

    const inicio = (e: TouchEvent) => {
      ativo = e.touches.length === 1 && !ignorar(e.target);
      horizontal = null;
      if (!ativo) return;
      x0 = x = e.touches[0].clientX; y0 = y = e.touches[0].clientY; t0 = Date.now();
    };
    const mover = (e: TouchEvent) => {
      if (!ativo) return;
      x = e.touches[0].clientX; y = e.touches[0].clientY;
      const dx = x - x0, dy = y - y0;
      if (horizontal === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) horizontal = Math.abs(dx) > Math.abs(dy);
      if (!horizontal) return;
      const temAlvo = swipeTarget(window.location.pathname, dx < 0 ? "esquerda" : "direita") !== null;
      const c = conteudo();
      if (c) { c.style.willChange = "transform"; c.style.transition = ""; c.style.transform = `translateX(${dx * (temAlvo ? 0.45 : 0.12)}px)`; }
    };
    const fim = () => {
      if (!ativo) return;
      ativo = false;
      const lado = horizontal ? isSwipe(x - x0, y - y0, Date.now() - t0) : null;
      const alvo = lado ? swipeTarget(window.location.pathname, lado) : null;
      if (alvo && lado) {
        // a tela atual sai para o lado do gesto; a próxima entra pelo outro lado
        const c = conteudo();
        if (c) {
          c.style.transition = "transform .18s ease-in, opacity .18s ease-in";
          c.style.transform = `translateX(${lado === "esquerda" ? -38 : 38}%)`;
          c.style.opacity = "0";
          setTimeout(() => { if (c.style.opacity === "0") { c.style.transition = ""; c.style.transform = ""; c.style.opacity = ""; } }, 2500);
        }
        router.push(alvo);
      } else soltarTela(true);
    };

    document.addEventListener("touchstart", inicio, { passive: true });
    document.addEventListener("touchmove", mover, { passive: true });
    document.addEventListener("touchend", fim, { passive: true });
    document.addEventListener("touchcancel", fim, { passive: true });
    return () => {
      document.removeEventListener("touchstart", inicio);
      document.removeEventListener("touchmove", mover);
      document.removeEventListener("touchend", fim);
      document.removeEventListener("touchcancel", fim);
    };
  }, [router]);

  return null;
}
