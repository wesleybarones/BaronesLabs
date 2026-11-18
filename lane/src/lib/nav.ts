export const NAV_ITEMS = [
  { href: "/", label: "Início", d: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/fotos", label: "Fotos", d: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 10 4.5-4.5L13 16l3-3 4 4M15 9.5a1.5 1.5 0 1 0 0-.01" },
  { href: "/lembrancas", label: "Lembranças", d: "M12 21s-7.5-4.6-9.2-9.3C1.6 8.4 3.7 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.4 3.4 4.2 6.7C19.5 16.4 12 21 12 21z" },
  { href: "/poemas", label: "Poemas", d: "M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h5" },
  { href: "/musica", label: "Música", d: "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
] as const;

export type Lado = "esquerda" | "direita";

export function sectionIndex(path: string): number {
  const i = NAV_ITEMS.findIndex((it) => it.href !== "/" && (path === it.href || path.startsWith(it.href + "/")));
  return i < 0 ? 0 : i;
}

/** Deslizar para a esquerda vai para a aba seguinte; para a direita, para a anterior. */
export function swipeTarget(path: string, lado: Lado): string | null {
  const next = sectionIndex(path) + (lado === "esquerda" ? 1 : -1);
  return next >= 0 && next < NAV_ITEMS.length ? NAV_ITEMS[next].href : null;
}

/** Gesto horizontal claro (≥ 70px, mais horizontal que vertical) e rápido (< 700ms). */
export function isSwipe(dx: number, dy: number, ms: number): Lado | null {
  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6 || ms > 700) return null;
  return dx < 0 ? "esquerda" : "direita";
}
