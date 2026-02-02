import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { differenceBy } from "./difference-by";

describe("differenceBy", () => {
  it("returns all when no overlap", () => {
    expect(differenceBy([1, 2], [3, 4], (x) => x)).toEqual([1, 2]);
  });

  it("returns empty when all excluded", () => {
    expect(differenceBy([1, 2], [1, 2], (x) => x)).toEqual([]);
  });

  it("handles empty first array", () => {
    expect(differenceBy([], [1, 2], (x) => x)).toEqual([]);
  });

  it("handles empty second array", () => {
    expect(differenceBy([1, 2], [], (x) => x)).toEqual([1, 2]);
  });

  it("[🎯] union type branch: function iteratee", () => {
    expect(differenceBy([2.1, 1.2, 3.3], [2.3, 3.4], Math.floor)).toEqual([
      1.2,
    ]);
  });

  it("[🎯] union type branch: property key iteratee", () => {
    expect(
      differenceBy(
        [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
        [{ id: 2, name: "Bobby" }],
        "id"
      )
    ).toEqual([{ id: 1, name: "Alice" }]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result length is at most first array length",
    (arr1, arr2) => {
      const result = differenceBy(arr1, arr2, (x) => x % 10);
      expect(result.length).toBeLessThanOrEqual(arr1.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] difference with itself is empty",
    (arr) => {
      const result = differenceBy(arr, arr, (x) => x);
      expect(result).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result contains no elements with computed values in exclude set",
    (arr1, arr2) => {
      const iteratee = (x: number) => x % 10;
      const excludeValues = new Set(arr2.map(iteratee));
      const result = differenceBy(arr1, arr2, iteratee);

      result.forEach((item) => {
        expect(excludeValues.has(iteratee(item))).toBe(false);
      });
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      differenceBy(arr1, arr2, (x) => x);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
