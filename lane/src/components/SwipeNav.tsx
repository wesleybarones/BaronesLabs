"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSwipe, swipeTarget } from "@/lib/nav";

/** Troca de aba deslizando o dedo para os lados. */
export function SwipeNav() {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    for (const lado of ["esquerda", "direita"] as const) {
      const alvo = swipeTarget(path, lado);
      if (alvo) router.prefetch(alvo);
    }
  }, [path, router]);

  useEffect(() => {
    let x = 0, y = 0, t = 0, ativo = false;
    const ignorar = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("[data-noswipe], input, textarea, select, [contenteditable=true]");
    const inicio = (e: TouchEvent) => {
      ativo = e.touches.length === 1 && !ignorar(e.target);
      if (!ativo) return;
      x = e.touches[0].clientX; y = e.touches[0].clientY; t = Date.now();
    };
    const fim = (e: TouchEvent) => {
      if (!ativo) return;
      ativo = false;
      const p = e.changedTouches[0];
      const lado = isSwipe(p.clientX - x, p.clientY - y, Date.now() - t);
      if (!lado) return;
      const alvo = swipeTarget(window.location.pathname, lado);
      if (alvo) router.push(alvo);
    };
    document.addEventListener("touchstart", inicio, { passive: true });
    document.addEventListener("touchend", fim, { passive: true });
    return () => {
      document.removeEventListener("touchstart", inicio);
      document.removeEventListener("touchend", fim);
    };
  }, [router]);

  return null;
}
