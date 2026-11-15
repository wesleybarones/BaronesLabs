import { describe, it, expect } from "vitest";
import { readId3 } from "./id3";

const enc = (s: string) => Array.from(new TextEncoder().encode(s));
const size4 = (n: number, synch: boolean) =>
  synch ? [(n >> 21) & 127, (n >> 14) & 127, (n >> 7) & 127, n & 127] : [(n >>> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255];
function frame(id: string, body: number[], v: 3 | 4) { return [...enc(id), ...size4(body.length, v === 4), 0, 0, ...body]; }
function tag(frames: number[][], v: 3 | 4) {
  const all = frames.flat();
  return new Uint8Array([...enc("ID3"), v, 0, 0, ...size4(all.length, true), ...all, 0xff, 0xfb]).buffer;
}

describe("readId3", () => {
  it("lê título e letra (ID3v2.4, UTF-8)", () => {
    const buf = tag([
      frame("TIT2", [3, ...enc("15 de Novembro")], 4),
      frame("USLT", [3, ...enc("eng"), 0, ...enc("Lâ-ne, você é linda\nforte e delicada")], 4),
    ], 4);
    expect(readId3(buf)).toEqual({ title: "15 de Novembro", lyrics: "Lâ-ne, você é linda\nforte e delicada" });
  });

  it("lê UTF-16 com BOM (ID3v2.3)", () => {
    const u16 = (s: string) => [0xff, 0xfe, ...Array.from(s).flatMap((c) => [c.charCodeAt(0) & 255, c.charCodeAt(0) >> 8])];
    const buf = tag([frame("TIT2", [1, ...u16("Nossa")], 3)], 3);
    expect(readId3(buf)).toEqual({ title: "Nossa" });
  });

  it("junta acentos soltos (NFD → NFC)", () => {
    const buf = tag([frame("TIT2", [3, ...enc("voce\u0302")], 4)], 4);
    expect(readId3(buf).title).toBe("você");
  });

  it("arquivo sem ID3 devolve vazio", () => {
    expect(readId3(new Uint8Array([0xff, 0xfb, 0, 0]).buffer)).toEqual({});
  });
});
