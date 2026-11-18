import type { Parts } from "./elapsed";

/** Dias completos (calendário) entre duas datas de relógio de parede. */
export function diasJuntos(de: Parts, ate: Parts): number {
  const a = Date.UTC(de.year, de.month - 1, de.day);
  const b = Date.UTC(ate.year, ate.month - 1, ate.day);
  return Math.max(0, Math.round((b - a) / 86400000));
}
