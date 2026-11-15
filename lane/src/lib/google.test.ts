import { describe, it, expect } from "vitest";
import { isAllowedGoogleUrl, photoPaths } from "./google";

describe("isAllowedGoogleUrl", () => {
  it("aceita googleusercontent https", () => {
    expect(isAllowedGoogleUrl("https://lh3.googleusercontent.com/abc")).toBe(true);
  });
  it.each([
    "http://lh3.googleusercontent.com/abc",
    "https://evil.com/abc",
    "https://googleusercontent.com.evil.com/abc",
    "https://evilgoogleusercontent.com/abc",
    "not a url",
  ])("rejeita %s", (u) => expect(isAllowedGoogleUrl(u)).toBe(false));
});

describe("photoPaths", () => {
  it("é determinístico e seguro para caminho", () => {
    expect(photoPaths("AB/c d")).toEqual({ full: "photos/AB_c_d.jpg", thumb: "photos/thumbs/AB_c_d.jpg" });
    expect(photoPaths("AB/c d")).toEqual(photoPaths("AB/c d"));
  });
});
