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

  // --- Large exclusion set (vLen > 16): Set-based path ---

  it("uses Set path when exclusion array has >16 elements", () => {
    const values = Array.from({ length: 20 }, (_, i) => i); // [0..19]
    expect(difference([0, 5, 10, 20, 25], values)).toEqual([20, 25]);
  });

  it("returns empty via Set path when all excluded", () => {
    const values = Array.from({ length: 17 }, (_, i) => i);
    expect(difference([0, 1, 2, 3], values)).toEqual([]);
  });

  it("returns all via Set path when no overlap", () => {
    const values = Array.from({ length: 17 }, (_, i) => i);
    expect(difference([100, 200, 300], values)).toEqual([100, 200, 300]);
  });

  it("preserves duplicates via Set path", () => {
    const values = Array.from({ length: 17 }, (_, i) => i);
    expect(difference([0, 0, 100, 100], values)).toEqual([100, 100]);
  });

  it("handles empty source array via Set path", () => {
    const values = Array.from({ length: 17 }, (_, i) => i);
    expect(difference([], values)).toEqual([]);
  });

  // --- Mutation tests ---

  it("[👾] uses loop path when exclusion has exactly 16 elements", () => {
    const values = Array.from({ length: 16 }, (_, i) => i); // exactly 16 → loop path
    expect(difference([0, 5, 16, 20], values)).toEqual([16, 20]);
  });

  it("[👾] uses Set path when exclusion has exactly 17 elements", () => {
    const values = Array.from({ length: 17 }, (_, i) => i); // exactly 17 → Set path
    expect(difference([0, 5, 17, 20], values)).toEqual([17, 20]);
  });

  it("[👾] loop path does not exclude undefined when not in values", () => {
    // If j < vLen mutates to j <= vLen, values[vLen] is undefined → would wrongly exclude undefined
    const arr: (number | undefined)[] = [1, undefined, 3];
    const values: (number | undefined)[] = [1];
    expect(difference(arr, values)).toEqual([undefined, 3]);
  });

  it("[👾] Set path does not add undefined to exclude set", () => {
    // If i < vLen mutates to i <= vLen, values[vLen] is undefined → added to Set → would wrongly exclude undefined
    const values: (number | undefined)[] = Array.from({ length: 17 }, (_, i) => i);
    const arr: (number | undefined)[] = [undefined, 100, 200];
    expect(difference(arr, values)).toEqual([undefined, 100, 200]);
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
