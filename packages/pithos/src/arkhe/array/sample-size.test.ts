import { describe, it, expect, vi, afterEach } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { sampleSize } from "./sample-size";

describe("sampleSize", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns n random elements", () => {
    const array = [1, 2, 3, 4, 5];
    const result = sampleSize(array, 3);
    expect(result).toHaveLength(3);
    result.forEach((item) => expect(array).toContain(item));
  });

  it("returns all elements when n >= length", () => {
    const array = [1, 2, 3];
    const result = sampleSize(array, 5);
    expect(result).toHaveLength(3);
    expect(result.sort()).toEqual([1, 2, 3]);
  });

  it("returns empty array when n is 0", () => {
    expect(sampleSize([1, 2, 3], 0)).toEqual([]);
  });

  it("returns empty array for empty array", () => {
    expect(sampleSize([], 5)).toEqual([]);
  });

  it("throws RangeError for negative n", () => {
    expect(() => sampleSize([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("does not mutate original array", () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    sampleSize(array, 3);
    expect(array).toEqual(original);
  });

  it("returns unique elements (no duplicates)", () => {
    const array = [1, 2, 3, 4, 5];
    const result = sampleSize(array, 5);
    const unique = new Set(result);
    expect(unique.size).toBe(result.length);
  });

  it("handles single element array", () => {
    expect(sampleSize([42], 1)).toEqual([42]);
  });

  it("[👾] throws RangeError with correct message for negative n", () => {
    expect(() => sampleSize([1, 2, 3], -1)).toThrow("n must be non-negative");
  });

  it("[👾] performs Fisher-Yates shuffle correctly", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const result = sampleSize([1, 2, 3, 4, 5], 3);
    expect(result).toEqual([5, 1, 2]);
  });

  itProp.prop([fc.array(fc.integer()), fc.nat()])(
    "[🎲] result length is min(n, array.length)",
    (arr, n) => {
      const result = sampleSize(arr, n);
      expect(result.length).toBe(Math.min(n, arr.length));
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.nat()])(
    "[🎲] all result elements are in original array",
    (arr, n) => {
      const result = sampleSize(arr, n);
      result.forEach((elem) => {
        expect(arr).toContain(elem);
      });
    }
  );

  itProp.prop([fc.uniqueArray(fc.integer()), fc.nat()])(
    "[🎲] result has no duplicates (given unique input)",
    (arr, n) => {
      const result = sampleSize(arr, n);
      const unique = new Set(result);
      expect(unique.size).toBe(result.length);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: -10, max: -1 })])(
    "[🎲] throws for negative n",
    (arr, n) => {
      expect(() => sampleSize(arr, n)).toThrow(RangeError);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.nat()])(
    "[🎲] does not mutate original array",
    (arr, n) => {
      const original = [...arr];
      sampleSize(arr, n);
      expect(arr).toEqual(original);
    }
  );
});
