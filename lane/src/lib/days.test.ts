import { it, expect } from "vitest";
import { diasJuntos } from "./days";
import { NAMORO } from "./couple";

const p = (y: number, m: number, d: number, h = 12) => ({ year: y, month: m, day: d, hour: h, minute: 0, second: 0 });

it("conta os dias desde o início do namoro", () => {
  expect(diasJuntos(NAMORO, p(2014, 12, 30))).toBe(0);
  expect(diasJuntos(NAMORO, p(2014, 12, 31))).toBe(1);
  expect(diasJuntos(NAMORO, p(2026, 11, 18))).toBe(4341);
});
