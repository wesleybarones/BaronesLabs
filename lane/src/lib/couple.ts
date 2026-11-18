import type { Parts } from "./elapsed";

// pedido de namoro: madrugada de 30/12/2014, por volta da 1h (horário de Brasília)
export const NAMORO: Parts = { year: 2014, month: 12, day: 30, hour: 1, minute: 0, second: 0 };
// casamento: 15/11/2017 às 15h
export const CASAMENTO: Parts = { year: 2017, month: 11, day: 15, hour: 15, minute: 0, second: 0 };

export type Anniversary = { kind: "namoro" | "casamento"; years: number };

export function anniversaryToday(now: Parts): Anniversary[] {
  const out: Anniversary[] = [];
  for (const [kind, d] of [["namoro", NAMORO], ["casamento", CASAMENTO]] as const) {
    const years = now.year - d.year;
    if (years > 0 && now.month === d.month && now.day === d.day) out.push({ kind, years });
  }
  return out;
}
