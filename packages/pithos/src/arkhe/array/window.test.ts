import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { window } from "./window";

describe("window", () => {
  it("creates sliding windows of specified size", () => {
    expect(window([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  it("handles size equal to array length", () => {
    expect(window([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  it("returns empty for size greater than array length", () => {
    expect(window([1, 2, 3], 5)).toEqual([]);
  });

  it("throws RangeError when size is zero or negative", () => {
    expect(() => window([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => window([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("throws RangeError for non-integer sizes", () => {
    expect(() => window([1, 2, 3], 2.5)).toThrow(RangeError);
    expect(() => window([1, 2, 3], NaN)).toThrow(RangeError);
  });

  it("returns empty for empty array", () => {
    expect(window([], 2)).toEqual([]);
  });

  it("handles size of 1", () => {
    expect(window([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 10 })])(
    "[🎲] number of windows equals max(0, length - size + 1)",
    (arr, size) => {
      const result = window(arr, size);
      const expected = Math.max(0, arr.length - size + 1);
      expect(result.length).toBe(expected);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 10 })])(
    "[🎲] each window has correct size",
    (arr, size) => {
      const result = window(arr, size);
      result.forEach((win) => {
        expect(win.length).toBe(size);
      });
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 10 })])(
    "[🎲] flattened windows contains all elements with duplicates",
    (arr, size) => {
      if (arr.length < size) return;
      const result = window(arr, size);
      const flattened = result.flat();
      arr.forEach((elem) => {
        expect(flattened.filter((x) => x === elem).length).toBeGreaterThan(0);
      });
    }
  );

  itProp.prop([
    fc.array(fc.integer(), { minLength: 1 }),
    fc.integer({ min: 1, max: 10 }),
  ])(
    "[🎲] window[i] contains array[i..i+size) (positional invariant)",
    (arr, size) => {
      const result = window(arr, size);

      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < size; j++) {
          expect(result[i][j]).toBe(arr[i + j]);
        }
      }
    }
  );
});
