import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { takeWhile } from "./take-while";

describe("takeWhile", () => {
  it("takes elements from beginning while predicate is true", () => {
    expect(takeWhile([1, 2, 3, 4, 5], (n) => n < 3)).toEqual([1, 2]);
  });

  it("returns empty array when first element fails", () => {
    expect(takeWhile([1, 2, 3], (n) => n > 10)).toEqual([]);
  });

  it("returns all elements when all pass predicate", () => {
    expect(takeWhile([1, 2, 3], (n) => n > 0)).toEqual([1, 2, 3]);
  });

  it("returns empty array for empty input", () => {
    expect(takeWhile([], () => true)).toEqual([]);
  });

  it("works with objects", () => {
    const users = [
      { user: "barney", active: true },
      { user: "fred", active: true },
      { user: "pebbles", active: false },
    ];
    expect(takeWhile(users, (u) => u.active)).toEqual([
      { user: "barney", active: true },
      { user: "fred", active: true },
    ]);
  });

  it("passes index and array to predicate", () => {
    const indices: number[] = [];
    takeWhile([10, 20, 30], (_, i, arr) => {
      indices.push(i);
      return arr.length === 3 && i < 2;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it("handles single element array", () => {
    expect(takeWhile([42], (n) => n > 0)).toEqual([42]);
    expect(takeWhile([42], (n) => n < 0)).toEqual([]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = takeWhile(arr, (x) => x > 0);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] all result elements satisfy predicate",
    (arr) => {
      const predicate = (x: number) => x % 2 === 0;
      const result = takeWhile(arr, predicate);
      result.forEach((x) => expect(predicate(x)).toBe(true));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always true predicate returns all elements",
    (arr) => {
      const result = takeWhile(arr, () => true);
      expect(result).toEqual(arr);
    }
  );

  it("[🎲] does not mutate original array", () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    takeWhile(array, (n) => n < 3);
    expect(array).toEqual(original);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is always a prefix of the original array",
    (arr) => {
      const predicate = (x: number) => x % 2 === 0;
      const result = takeWhile(arr, predicate);
      expect(arr.slice(0, result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] element just after result (if any) does not satisfy predicate",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = takeWhile(arr, predicate);
      const boundaryIndex = result.length;
      if (boundaryIndex < arr.length) {
        expect(predicate(arr[boundaryIndex])).toBe(false);
      }
    }
  );
});
