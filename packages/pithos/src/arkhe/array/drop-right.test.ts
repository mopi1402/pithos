import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { dropRight } from "./drop-right";

describe("dropRight", () => {
  it("drops n elements from the end", () => {
    expect(dropRight([1, 2, 3, 4, 5], 2)).toEqual([1, 2, 3]);
  });

  it("returns a copy when count is 0", () => {
    const arr = [1, 2, 3];
    expect(dropRight(arr, 0)).not.toBe(arr);
  });

  it("throws RangeError for negative count", () => {
    expect(() => dropRight([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("[🎯] returns empty array for empty input", () => {
    expect(dropRight([], 5)).toEqual([]);
  });

  it("[🎯] returns empty array when count exceeds length", () => {
    expect(dropRight([1, 2, 3], 10)).toEqual([]);
  });

  it("[🎯] returns empty array when count equals length", () => {
    expect(dropRight([1, 2, 3], 3)).toEqual([]);
  });

  it("[👾] returns identical content when count is 0", () => {
    expect(dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result length === max(0, array.length - count)",
    (arr, count) => {
      const result = dropRight(arr, count);
      const expected = Math.max(0, arr.length - count);
      expect(result.length).toBe(expected);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result is a prefix of original array",
    (arr, count) => {
      const result = dropRight(arr, count);
      expect(arr.slice(0, result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] does not mutate original array",
    (arr, count) => {
      const original = [...arr];
      dropRight(arr, count);
      expect(arr).toEqual(original);
    }
  );
});
