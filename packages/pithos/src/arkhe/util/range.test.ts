import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { range } from "./range";

describe("range", () => {
  it("creates range from 0 to n with single argument", () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
  });

  it("creates range from start to end", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });

  it("creates range with custom step", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it("creates descending range", () => {
    expect(range(4, 0)).toEqual([4, 3, 2, 1]);
  });

  it("creates descending range with negative step", () => {
    expect(range(10, 0, -2)).toEqual([10, 8, 6, 4, 2]);
  });

  it("throws RangeError for zero step", () => {
    expect(() => range(0, 5, 0)).toThrow(RangeError);
    expect(() => range(0, 5, 0)).toThrow("Step must not be zero");
  });

  it("returns empty for invalid direction", () => {
    expect(range(0, 5, -1)).toEqual([]);
  });

  it("handles zero range", () => {
    expect(range(0)).toEqual([]);
  });

  itProp.prop([fc.integer({ min: 0, max: 100 })])(
    "[🎲] range(n) has length n",
    (n) => {
      expect(range(n)).toHaveLength(n);
    }
  );

  itProp.prop([
    fc.integer({ min: 0, max: 50 }),
    fc.integer({ min: 0, max: 50 }),
  ])("[🎲] range contains sequential values", (offset1, offset2) => {
    const start = Math.min(offset1, offset2);
    const end = Math.max(offset1, offset2);
    const result = range(start, end);
    for (let i = 1; i < result.length; i++) {
      expect(result[i] - result[i - 1]).toBe(1);
    }
  });

  itProp.prop([
    fc.integer({ min: 0, max: 50 }),
    fc.integer({ min: 1, max: 10 }),
  ])("[🎲] step divides range correctly", (n, step) => {
    const result = range(0, n, step);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBe(i * step);
    }
  });

  it("[🎯] tests JSDoc example range(5)", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("[🎯] tests JSDoc example range(0, 10, 2)", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it("[🎯] tests JSDoc example range(5, 0)", () => {
    expect(range(5, 0)).toEqual([5, 4, 3, 2, 1]);
  });

  it("[🎯] tests JSDoc example range(5, 0, -2)", () => {
    expect(range(5, 0, -2)).toEqual([5, 3, 1]);
  });

  it("[🎯] handles single element range", () => {
    expect(range(1)).toEqual([0]);
    expect(range(0, 1)).toEqual([0]);
  });

  it("[🎯] handles start equals end", () => {
    expect(range(5, 5)).toEqual([]);
  });
});
