import { describe, it, expect } from "vitest";
import { groupByMonth } from "./group";

describe("groupByMonth", () => {
  it("agrupa por mês, mais recente primeiro, em português", () => {
    const g = groupByMonth([
      { id: 1, taken_at: "2017-11-15T15:00:00Z" },
      { id: 2, taken_at: "2026-11-15T15:00:00Z" },
      { id: 3, taken_at: "2017-11-20T15:00:00Z" },
    ]);
    expect(g.map((x) => x.label)).toEqual(["novembro de 2026", "novembro de 2017"]);
    expect(g[1].items.map((x) => x.id)).toEqual([3, 1]);
  });
});
