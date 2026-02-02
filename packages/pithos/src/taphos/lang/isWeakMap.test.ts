import { describe, it, expect } from "vitest";
import { isWeakMap } from "./isWeakMap";

describe("isWeakMap", () => {
  it("[🎯] returns true for WeakMap", () => {
    expect(isWeakMap(new WeakMap())).toBe(true);
  });

  it("[🎯] returns false for Map", () => {
    expect(isWeakMap(new Map())).toBe(false);
  });

  it("returns false for plain object", () => {
    expect(isWeakMap({})).toBe(false);
  });

  it("[🎯] returns false for null", () => {
    expect(isWeakMap(null)).toBe(false);
  });
});
