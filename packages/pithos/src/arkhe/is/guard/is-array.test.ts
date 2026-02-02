import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isArray } from "./is-array";

describe("isArray", () => {
  it("should return true for arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray(new Array(5))).toBe(true);
  });

  it("[🎯] should return false for array-like objects", () => {
    expect(isArray({ length: 0 })).toBe(false);
    expect(isArray("string")).toBe(false);
  });

  it("[🎯] should return false for non-array values", () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(42)).toBe(false);
  });

  itProp.prop([fc.array(fc.anything())])("[🎲] all arrays return true", (arr) => {
    expect(isArray(arr)).toBe(true);
  });
});
