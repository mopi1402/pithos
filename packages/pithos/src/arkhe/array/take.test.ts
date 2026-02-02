import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { take } from "./take";

describe("take", () => {
  it("takes n elements from beginning", () => {
    expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
  });

  it("returns empty array when count is 0", () => {
    expect(take([1, 2, 3], 0)).toEqual([]);
  });

  it("returns all elements when count exceeds length", () => {
    expect(take([1, 2, 3], 10)).toEqual([1, 2, 3]);
  });

  it("returns empty array for empty input", () => {
    expect(take([], 5)).toEqual([]);
  });

  it("throws RangeError for negative count", () => {
    expect(() => take([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("does not mutate original array", () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    take(array, 3);
    expect(array).toEqual(original);
  });

  it("handles single element array", () => {
    expect(take([42], 1)).toEqual([42]);
    expect(take([42], 5)).toEqual([42]);
  });

  it("handles count equal to length", () => {
    expect(take([1, 2, 3], 3)).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result length is min(count, array.length)",
    (arr, count) => {
      const result = take(arr, count);
      expect(result.length).toBe(Math.min(count, arr.length));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] take(arr, 0) returns empty array",
    (arr) => {
      expect(take(arr, 0)).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] result is always a prefix of the original array",
    (arr, count) => {
      const result = take(arr, count);
      expect(arr.slice(0, result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 0, max: 100 })])(
    "[🎲] does not mutate original",
    (arr, count) => {
      const original = [...arr];
      take(arr, count);
      expect(arr).toEqual(original);
    }
  );
});
