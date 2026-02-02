import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { takeRight } from "./take-right";

describe("takeRight", () => {
  it("takes n elements from the end", () => {
    expect(takeRight([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
  });

  it("returns empty array when count is 0", () => {
    expect(takeRight([1, 2, 3], 0)).toEqual([]);
  });

  it("throws RangeError for negative count", () => {
    expect(() => takeRight([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("[🎯] returns empty array for empty input", () => {
    expect(takeRight([], 5)).toEqual([]);
  });

  it("[🎯] returns all elements when count exceeds length", () => {
    expect(takeRight([1, 2, 3], 10)).toEqual([1, 2, 3]);
  });

  it("[🎯] returns all elements when count equals length", () => {
    expect(takeRight([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result length is min of count and array length",
    (arr, count) => {
      const result = takeRight(arr, count);
      expect(result.length).toBe(Math.min(count, arr.length));
    }
  );

  itProp.prop([fc.array(fc.integer()).filter((a) => a.length > 0)])(
    "[🎲] takeRight(arr, arr.length) equals arr",
    (arr) => {
      const result = takeRight(arr, arr.length);
      expect(result).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result is always a suffix of the original array",
    (arr, count) => {
      const result = takeRight(arr, count);
      expect(arr.slice(arr.length - result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] does not mutate original array",
    (arr, count) => {
      const original = [...arr];
      takeRight(arr, count);
      expect(arr).toEqual(original);
    }
  );
});
