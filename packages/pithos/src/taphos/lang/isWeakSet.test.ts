import { describe, it, expect } from "vitest";
import { isWeakSet } from "./isWeakSet";

describe("isWeakSet", () => {
  it("[🎯] returns true for WeakSet", () => {
    expect(isWeakSet(new WeakSet())).toBe(true);
  });

  it("[🎯] returns false for Set", () => {
    expect(isWeakSet(new Set())).toBe(false);
  });

  it("returns false for plain object", () => {
    expect(isWeakSet({})).toBe(false);
  });

  it("[🎯] returns false for null", () => {
    expect(isWeakSet(null)).toBe(false);
  });
});
