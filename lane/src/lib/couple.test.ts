import { describe, it, expect } from "vitest";
import { anniversaryToday, NAMORO, CASAMENTO } from "./couple";

const day = (y: number, m: number, d: number) => ({ year: y, month: m, day: d, hour: 10, minute: 0, second: 0 });

describe("couple", () => {
  it("datas do casal", () => {
    expect(NAMORO).toMatchObject({ year: 2014, month: 12, day: 30 });
    expect(CASAMENTO).toMatchObject({ year: 2017, month: 11, day: 15 });
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
