import { describe, it, expect } from "vitest";
import { elapsed, wallClock, type Parts } from "./elapsed";

const p = (y: number, mo: number, d: number, h = 0, mi = 0, s = 0): Parts => ({
  year: y, month: mo, day: d, hour: h, minute: mi, second: s,
});

describe("elapsed", () => {
  it("conta desde o namoro até hoje", () => {
    expect(elapsed(p(2014, 12, 30), p(2026, 11, 15, 14, 32, 8))).toEqual({
      year: 11, month: 10, day: 16, hour: 14, minute: 32, second: 8,
    });
  });

  it("casamento faz exatamente 9 anos à meia-noite de 15/11/2026", () => {
    expect(elapsed(p(2017, 11, 15), p(2026, 11, 15))).toEqual(p(9, 0, 0));
  });

  it("não fica negativo em virada de mês curto", () => {
    const r = elapsed(p(2026, 1, 31, 23, 59, 59), p(2026, 3, 1, 0, 0, 0));
    for (const v of Object.values(r)) expect(v).toBeGreaterThanOrEqual(0);
    expect(r).toEqual({ year: 0, month: 1, day: 0, hour: 0, minute: 0, second: 1 });
  });

  it("um segundo depois do início", () => {
    expect(elapsed(p(2014, 12, 30), p(2014, 12, 30, 0, 0, 1))).toEqual(p(0, 0, 0, 0, 0, 1));
  });
});

describe("wallClock", () => {
  it("converte para horário de São Paulo", () => {
    // 2026-11-15T17:32:08Z = 14:32:08 em SP (UTC-3)
    expect(wallClock(new Date("2026-11-15T17:32:08Z"))).toEqual(p(2026, 11, 15, 14, 32, 8));
  });
});
