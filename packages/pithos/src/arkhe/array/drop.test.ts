import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { drop } from "./drop";

describe("drop", () => {
  it("drops n elements from the beginning", () => {
    expect(drop([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5]);
  });

  it("returns a copy when count is 0", () => {
    const arr = [1, 2, 3];
    expect(drop(arr, 0)).not.toBe(arr);
  });

  it("throws RangeError for negative count", () => {
    expect(() => drop([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("[🎯] returns empty array for empty input", () => {
    expect(drop([], 5)).toEqual([]);
  });

  it("[🎯] returns empty array when count exceeds length", () => {
    expect(drop([1, 2, 3], 10)).toEqual([]);
  });

  it("[🎯] returns empty array when count equals length", () => {
    expect(drop([1, 2, 3], 3)).toEqual([]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result length is max(0, array.length - count)",
    (arr, count) => {
      const result = drop(arr, count);
      expect(result.length).toBe(Math.max(0, arr.length - count));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] drop(arr, 0) returns copy",
    (arr) => {
      const result = drop(arr, 0);
      expect(result).toEqual(arr);
      expect(result).not.toBe(arr);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] does not mutate original",
    (arr, count) => {
      const original = [...arr];
      drop(arr, count);
      expect(arr).toEqual(original);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result is a suffix of original array",
    (arr, count) => {
      const result = drop(arr, count);
      expect(arr.slice(arr.length - result.length)).toEqual(result);
    }
  );
});
