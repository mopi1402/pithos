import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniqBy } from "./uniq-by";

describe("uniqBy", () => {
  it("removes duplicates using iteratee", () => {
    expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
  });

  it("works with object property accessor", () => {
    const array = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    expect(uniqBy(array, (item) => item.id)).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(uniqBy([], (x) => x)).toEqual([]);
  });

  it("preserves first occurrence", () => {
    const array = [
      { type: "a", value: 1 },
      { type: "b", value: 2 },
      { type: "a", value: 3 },
    ];
    expect(uniqBy(array, (item) => item.type)).toEqual([
      { type: "a", value: 1 },
      { type: "b", value: 2 },
    ]);
  });

  it("handles all unique values", () => {
    expect(uniqBy([1, 2, 3], (x) => x)).toEqual([1, 2, 3]);
  });

  it("handles all duplicate values", () => {
    expect(uniqBy([1, 1, 1], (x) => x)).toEqual([1]);
  });

  it("handles single element array", () => {
    expect(uniqBy([42], (x) => x)).toEqual([42]);
  });

  it("[🎯] all same iteratee value returns first occurrence only", () => {
    expect(uniqBy([1, 2, 3], () => "same")).toEqual([1]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result has no duplicates based on iteratee",
    (arr) => {
      const result = uniqBy(arr, (x) => x % 5);
      const keys = result.map((x) => x % 5);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = uniqBy(arr, (x) => x % 3);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] order preserved (first occurrence)",
    (arr) => {
      const result = uniqBy(arr, (x) => x % 10);
      const indices = result.map((val) => arr.indexOf(val));
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i]).toBeGreaterThan(indices[i - 1]);
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] every unique key from input is represented in result",
    (arr) => {
      const iteratee = (x: number) => x % 7;
      const result = uniqBy(arr, iteratee);
      const resultKeys = new Set(result.map(iteratee));

      for (const item of arr) {
        expect(resultKeys.has(iteratee(item))).toBe(true);
      }
    }
  );

  it("[🎲] does not mutate original array", () => {
    const array = [2.1, 1.2, 2.3];
    const original = [...array];
    uniqBy(array, Math.floor);
    expect(array).toEqual(original);
  });
});
