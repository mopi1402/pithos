import { describe, it, expect } from "vitest";
import { isArrayBuffer } from "./is-array-buffer";

describe("isArrayBuffer", () => {
  it("should return true for ArrayBuffer instances", () => {
    expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
    expect(isArrayBuffer(new ArrayBuffer(0))).toBe(true);
  });

  it("[🎯] should return false for TypedArrays (they wrap ArrayBuffer, but aren't one)", () => {
    expect(isArrayBuffer(new Uint8Array(8))).toBe(false);
  });

  it("[🎯] should return false for other buffer-like objects", () => {
    expect(isArrayBuffer(new DataView(new ArrayBuffer(8)))).toBe(false);
    expect(isArrayBuffer(new SharedArrayBuffer(8))).toBe(false);
  });

  it("[🎯] should return false for non-buffer values", () => {
    expect(isArrayBuffer(null)).toBe(false);
    expect(isArrayBuffer({})).toBe(false);
    expect(isArrayBuffer([])).toBe(false);
  });
});
