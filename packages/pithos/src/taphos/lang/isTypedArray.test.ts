import { describe, it, expect } from "vitest";
import { isTypedArray } from "./isTypedArray";

describe("isTypedArray", () => {
  it("[🎯] returns true for Uint8Array", () => {
    expect(isTypedArray(new Uint8Array(2))).toBe(true);
  });

  it("[🎯] returns true for Float32Array", () => {
    expect(isTypedArray(new Float32Array(2))).toBe(true);
  });

  it("[🎯] returns true for Int32Array", () => {
    expect(isTypedArray(new Int32Array(2))).toBe(true);
  });

  it("[🎯] returns false for regular array", () => {
    expect(isTypedArray([1, 2, 3])).toBe(false);
  });

  it("[🎯] returns false for DataView", () => {
    expect(isTypedArray(new DataView(new ArrayBuffer(2)))).toBe(false);
  });
});
