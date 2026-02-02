import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { difference } from "./difference";

describe("difference", () => {
  it("returns elements in first array not in second", () => {
    expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
  });

  it("returns all when no overlap", () => {
    expect(difference([1, 2], [3, 4])).toEqual([1, 2]);
  });

  it("returns empty when all excluded", () => {
    expect(difference([1, 2], [1, 2])).toEqual([]);
  });

  it("handles empty first array", () => {
    expect(difference([], [1, 2])).toEqual([]);
  });

  it("handles empty second array", () => {
    expect(difference([1, 2], [])).toEqual([1, 2]);
  });

  it("preserves duplicates in first array", () => {
    expect(difference([1, 1, 2], [2])).toEqual([1, 1]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result length <= first array length",
    (arr1, arr2) => {
      const result = difference(arr1, arr2);
      expect(result.length).toBeLessThanOrEqual(arr1.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] difference(arr, []) === arr",
    (arr) => {
      expect(difference(arr, [])).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] difference(arr, arr) === []",
    (arr) => {
      const unique = [...new Set(arr)];
      expect(difference(unique, unique)).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result contains no elements from exclude array",
    (arr1, arr2) => {
      const excludeSet = new Set(arr2);
      const result = difference(arr1, arr2);

      result.forEach((item) => {
        expect(excludeSet.has(item)).toBe(false);
      });
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      difference(arr1, arr2);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
