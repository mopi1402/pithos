import { describe, it, expect } from "vitest";
import { isSet } from "./is-set";

describe("isSet", () => {
  it("should return true for Set instances", () => {
    expect(isSet(new Set())).toBe(true);
    expect(isSet(new Set([1, 2, 3]))).toBe(true);
    expect(isSet(new Set(["a", "b"]))).toBe(true);
  });

  it("[🎯] should return false for other collection types", () => {
    expect(isSet(new WeakSet())).toBe(false);
    expect(isSet(new Map())).toBe(false);
    expect(isSet(new WeakMap())).toBe(false);
  });

  it("[🎯] should return false for array-like values", () => {
    expect(isSet([])).toBe(false);
    expect(isSet([1, 2, 3])).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isSet(null)).toBe(false);
    expect(isSet(undefined)).toBe(false);
    expect(isSet({})).toBe(false);
    expect(isSet("Set")).toBe(false);
  });
});
