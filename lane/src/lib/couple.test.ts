import { describe, it, expect } from "vitest";
import { anniversaryToday, NAMORO, CASAMENTO } from "./couple";
import { elapsed } from "./elapsed";

const day = (y: number, m: number, d: number) => ({ year: y, month: m, day: d, hour: 10, minute: 0, second: 0 });

describe("couple", () => {
  it("datas e horários do casal", () => {
    expect(NAMORO).toMatchObject({ year: 2014, month: 12, day: 30, hour: 1, minute: 0 });
    expect(CASAMENTO).toMatchObject({ year: 2017, month: 11, day: 15, hour: 15, minute: 0 });
  });
  it("relógios contam a partir dos horários certos", () => {
    const agora = { year: 2026, month: 11, day: 18, hour: 0, minute: 30, second: 0 };
    expect(elapsed(NAMORO, agora)).toEqual({ year: 11, month: 10, day: 18, hour: 23, minute: 30, second: 0 });
    expect(elapsed(CASAMENTO, agora)).toEqual({ year: 9, month: 0, day: 2, hour: 9, minute: 30, second: 0 });
    // às 15h em ponto do dia 15/11 completa exatamente 9 anos
    expect(elapsed(CASAMENTO, { year: 2026, month: 11, day: 15, hour: 15, minute: 0, second: 0 })).toEqual({ year: 9, month: 0, day: 0, hour: 0, minute: 0, second: 0 });
  });
  it("15/11/2026 é aniversário de 9 anos de casamento", () => {
    expect(anniversaryToday(day(2026, 11, 15))).toEqual([{ kind: "casamento", years: 9 }]);
  });
  it("30/12/2026 é aniversário de 12 anos de namoro", () => {
    expect(anniversaryToday(day(2026, 12, 30))).toEqual([{ kind: "namoro", years: 12 }]);
  });
  it("dia comum não é aniversário", () => {
    expect(anniversaryToday(day(2026, 6, 1))).toEqual([]);
  });
  it("o próprio dia do casamento não conta como aniversário", () => {
    expect(anniversaryToday(day(2017, 11, 15))).toEqual([]);
  });
});
