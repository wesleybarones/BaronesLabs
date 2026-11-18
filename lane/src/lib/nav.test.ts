import { describe, it, expect } from "vitest";
import { sectionIndex, swipeTarget, isSwipe } from "./nav";

describe("nav", () => {
  it("acha a aba de cada caminho", () => {
    expect(sectionIndex("/")).toBe(0);
    expect(sectionIndex("/fotos/importar")).toBe(1);
    expect(sectionIndex("/lembrancas/nova")).toBe(2);
    expect(sectionIndex("/poemas/abc")).toBe(3);
    expect(sectionIndex("/musica")).toBe(4);
  });
  it("deslizar para a esquerda vai para a próxima aba, para a direita volta", () => {
    expect(swipeTarget("/", "esquerda")).toBe("/fotos");
    expect(swipeTarget("/poemas/abc", "esquerda")).toBe("/musica");
    expect(swipeTarget("/fotos", "direita")).toBe("/");
  });
  it("não passa das pontas", () => {
    expect(swipeTarget("/", "direita")).toBeNull();
    expect(swipeTarget("/musica", "esquerda")).toBeNull();
  });
  it("só conta como deslize um gesto horizontal claro e rápido", () => {
    expect(isSwipe(-90, 10, 300)).toBe("esquerda");
    expect(isSwipe(90, -20, 300)).toBe("direita");
    expect(isSwipe(40, 0, 300)).toBeNull();      // curto demais
    expect(isSwipe(-90, 80, 300)).toBeNull();    // mais vertical (rolagem)
    expect(isSwipe(-90, 10, 1200)).toBeNull();   // lento demais
  });
});
