import { describe, it, expect } from "vitest";
import { isBuffer } from "./isBuffer";

describe("isBuffer", () => {
  it("[🎯] returns true for Buffer", () => {
    expect(isBuffer(Buffer.from("hello"))).toBe(true);
  });

  it("[🎯] returns false for Uint8Array", () => {
    expect(isBuffer(new Uint8Array(2))).toBe(false);
  });

  it("returns false for arrays", () => {
    expect(isBuffer([1, 2, 3])).toBe(false);
  });

  it("returns false for strings", () => {
    expect(isBuffer("hello")).toBe(false);
  });

  it("[🎯] returns false for null", () => {
    expect(isBuffer(null)).toBe(false);
  });
});
