import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniq } from "./uniq";

describe("uniq", () => {
  it("removes duplicate values", () => {
    expect(uniq([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("preserves order of first occurrence", () => {
    expect(uniq([11, 2, 3, 44, 11, 2, 3])).toEqual([11, 2, 3, 44]);
  });

  it("returns empty array for empty input", () => {
    expect(uniq([])).toEqual([]);
  });

  it("handles all unique values", () => {
    expect(uniq([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("handles all duplicate values", () => {
    expect(uniq([1, 1, 1])).toEqual([1]);
  });

  it("handles single element array", () => {
    expect(uniq([42])).toEqual([42]);
  });

  it("handles string values", () => {
    expect(uniq(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("[🎯] tests JSDoc example", () => {
    expect(uniq([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    expect(uniq([11, 2, 3, 44, 11, 2, 3])).toEqual([11, 2, 3, 44]);
  });

  // --- Large array (len > 200): Set-based path ---

  it("[🎯] uses Set path for arrays >200 elements", () => {
    const arr = Array.from({ length: 250 }, (_, i) => i % 100);
    const result = uniq(arr);
    expect(result).toEqual(Array.from({ length: 100 }, (_, i) => i));
  });

  it("[🎯] Set path preserves first occurrence order", () => {
    const arr = Array.from({ length: 201 }, (_, i) => 201 - i);
    const result = uniq(arr);
    expect(result).toEqual(arr);
  });

  it("[🎯] Set path with all identical elements", () => {
    const arr = new Array(201).fill(42);
    expect(uniq(arr)).toEqual([42]);
  });

  it("[👾] loop path does not match out-of-bounds undefined", () => {
    // If j < rLen mutates to j <= rLen, result[rLen] is undefined → would wrongly deduplicate undefined
    const arr: (number | undefined)[] = [1, undefined, undefined, 2];
    expect(uniq(arr)).toEqual([1, undefined, 2]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result has no duplicates",
    (arr) => {
      const result = uniq(arr);
      expect(result.length).toBe(new Set(result).size);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      expect(uniq(arr).length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] order preserved (first occurrence)",
    (arr) => {
      const result = uniq(arr);
      const indices = result.map((val) => arr.indexOf(val));
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i]).toBeGreaterThan(indices[i - 1]);
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] every unique value from input is in result",
    (arr) => {
      const result = uniq(arr);
      const resultSet = new Set(result);
      for (const item of arr) {
        expect(resultSet.has(item)).toBe(true);
      }
    }
  );

  it("[🎲] does not mutate original array", () => {
    const array = [1, 2, 2, 3];
    const original = [...array];
    uniq(array);
    expect(array).toEqual(original);
  });
});
