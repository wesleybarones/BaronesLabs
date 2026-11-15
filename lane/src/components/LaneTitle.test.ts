import { it, expect } from "vitest";
import { sortearFrase } from "./LaneTitle";

it("nunca repete a frase atual e cobre todas", () => {
  for (let atual = -1; atual < 6; atual++) {
    const vistos = new Set<number>();
    for (let k = 0; k < 6; k++) {
      const n = sortearFrase(atual, 6, () => k / 6 + 0.01);
      expect(n).not.toBe(atual);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(6);
      vistos.add(n);
    }
    expect(vistos.size).toBe(atual < 0 ? 6 : 5);
  }
});
