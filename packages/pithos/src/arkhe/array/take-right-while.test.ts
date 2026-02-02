import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { takeRightWhile } from "./take-right-while";

describe("takeRightWhile", () => {
  it("takes elements from end while predicate is true", () => {
    expect(takeRightWhile([1, 2, 3, 4, 5], (n) => n > 3)).toEqual([4, 5]);
  });

  it("returns empty array when first element from end fails", () => {
    expect(takeRightWhile([1, 2, 3], (n) => n > 10)).toEqual([]);
  });

  it("returns all elements when all pass predicate", () => {
    expect(takeRightWhile([1, 2, 3], (n) => n > 0)).toEqual([1, 2, 3]);
  });

  it("returns empty array for empty input", () => {
    expect(takeRightWhile([], () => true)).toEqual([]);
  });

  it("works with objects", () => {
    const users = [
      { user: "barney", active: false },
      { user: "fred", active: true },
      { user: "pebbles", active: true },
    ];
    expect(takeRightWhile(users, (u) => u.active)).toEqual([
      { user: "fred", active: true },
      { user: "pebbles", active: true },
    ]);
  });

  it("passes index and array to predicate", () => {
    const indices: number[] = [];
    takeRightWhile([10, 20, 30], (_, i, arr) => {
      indices.push(i);
      return arr.length === 3;
    });
    expect(indices).toEqual([2, 1, 0]);
  });

  it("handles single element array", () => {
    expect(takeRightWhile([42], (n) => n > 0)).toEqual([42]);
    expect(takeRightWhile([42], (n) => n < 0)).toEqual([]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = takeRightWhile(arr, (x) => x > 0);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] all result elements satisfy predicate",
    (arr) => {
      const predicate = (x: number) => x % 2 === 0;
      const result = takeRightWhile(arr, predicate);
      result.forEach((x) => expect(predicate(x)).toBe(true));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always true predicate returns all elements",
    (arr) => {
      const result = takeRightWhile(arr, () => true);
      expect(result).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is always a suffix of the original array",
    (arr) => {
      const predicate = (x: number) => x % 2 === 0;
      const result = takeRightWhile(arr, predicate);
      expect(arr.slice(arr.length - result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] element just before result (if any) does not satisfy predicate",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = takeRightWhile(arr, predicate);
      const boundaryIndex = arr.length - result.length - 1;
      if (boundaryIndex >= 0) {
        expect(predicate(arr[boundaryIndex])).toBe(false);
      }
    }
  );

  it("[🎲] does not mutate original array", () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    takeRightWhile(array, (n) => n > 3);
    expect(array).toEqual(original);
  });
});
