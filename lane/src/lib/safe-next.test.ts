import { it, expect } from "vitest";
import { safeNext } from "./safe-next";

it.each([
  [null, "/"], ["/fotos", "/fotos"], ["//evil.com", "/"], ["https://evil.com", "/"], ["/\\evil.com", "/"],
])("safeNext(%s) = %s", (i, o) => expect(safeNext(i)).toBe(o));
