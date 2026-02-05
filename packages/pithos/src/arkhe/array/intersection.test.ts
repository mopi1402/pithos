import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { intersection } from "./intersection";

describe("intersection", () => {
  it("returns common elements", () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });

  it("handles multiple arrays", () => {
    expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
  });

  it("returns empty when no overlap", () => {
    expect(intersection([1, 2], [3, 4])).toEqual([]);
  });

  it("returns empty when first array is empty", () => {
    expect(intersection([], [1, 2, 3])).toEqual([]);
  });

  it("returns empty when any array is empty", () => {
    expect(intersection([1, 2], [])).toEqual([]);
  });

  it("returns empty for no arrays", () => {
    expect(intersection()).toEqual([]);
  });

  it("deduplicates results", () => {
    expect(intersection([1, 1, 2], [1, 2])).toEqual([1, 2]);
  });

  it("[🎯] intersection with itself returns unique elements", () => {
    expect(intersection([1, 2, 2, 3], [1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it("[👾] does not include out-of-bounds undefined element", () => {
    // If i < first.length mutates to i <= first.length, first[first.length] is undefined
    // and could be included if undefined exists in other arrays
    const result = intersection([1, 2], [1, 2, undefined] as number[]);
    expect(result).toEqual([1, 2]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result length <= min(arr1.length, arr2.length)",
    (arr1, arr2) => {
      const result = intersection(arr1, arr2);
      expect(result.length).toBeLessThanOrEqual(
        Math.min(arr1.length, arr2.length)
      );
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] all result elements are in both arrays",
    (arr1, arr2) => {
      const result = intersection(arr1, arr2);
      for (const item of result) {
        expect(arr1).toContain(item);
        expect(arr2).toContain(item);
      }
    }
  );

  itProp.prop([
    fc.array(fc.integer()),
    fc.array(fc.integer()),
    fc.array(fc.integer()),
  ])("[🎲] all result elements are in all arrays", (arr1, arr2, arr3) => {
    const result = intersection(arr1, arr2, arr3);
    for (const item of result) {
      expect(arr1).toContain(item);
      expect(arr2).toContain(item);
      expect(arr3).toContain(item);
    }
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      intersection(arr1, arr2);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
