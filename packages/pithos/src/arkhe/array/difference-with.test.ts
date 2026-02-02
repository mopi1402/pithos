import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { differenceWith } from "./difference-with";

describe("differenceWith", () => {
  it("filters using comparator", () => {
    const arr1 = [{ x: 1 }, { x: 2 }];
    const arr2 = [{ x: 1 }];
    expect(differenceWith(arr1, arr2, (a, b) => a.x === b.x)).toEqual([
      { x: 2 },
    ]);
  });

  it("returns all when no match", () => {
    expect(differenceWith([1, 2], [3, 4], (a, b) => a === b)).toEqual([1, 2]);
  });

  it("returns empty when all match", () => {
    expect(differenceWith([1, 2], [1, 2], (a, b) => a === b)).toEqual([]);
  });

  it("handles empty first array", () => {
    expect(differenceWith([], [1, 2], (a, b) => a === b)).toEqual([]);
  });

  it("handles empty second array", () => {
    expect(differenceWith([1, 2], [], (a, b) => a === b)).toEqual([1, 2]);
  });

  it("works with approximate equality", () => {
    expect(
      differenceWith([1.1, 2.2], [1.0, 3.0], (a, b) => Math.abs(a - b) < 0.2)
    ).toEqual([2.2]);
  });

  it("[🎯] supports different types for array and values (T ≠ U)", () => {
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const ids = [2, 4];
    expect(differenceWith(objects, ids, (obj, id) => obj.id === id)).toEqual([
      { id: 1 },
      { id: 3 },
    ]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result contains no elements matching any excluded value",
    (arr1, arr2) => {
      const comparator = (a: number, b: number) => a === b;
      const result = differenceWith(arr1, arr2, comparator);

      result.forEach((item) => {
        expect(arr2.some((value) => comparator(item, value))).toBe(false);
      });
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result length is at most first array length",
    (arr1, arr2) => {
      const result = differenceWith(arr1, arr2, (a, b) => a === b);
      expect(result.length).toBeLessThanOrEqual(arr1.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] difference with itself is empty",
    (arr) => {
      const result = differenceWith(arr, arr, (a, b) => a === b);
      expect(result).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      differenceWith(arr1, arr2, (a, b) => a === b);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
