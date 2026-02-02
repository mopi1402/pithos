import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { dropWhile } from "./drop-while";

describe("dropWhile", () => {
  it("drops elements from left while predicate is true", () => {
    expect(dropWhile([1, 2, 3, 4], (x) => x < 3)).toEqual([3, 4]);
  });

  it("returns empty when all match", () => {
    expect(dropWhile([1, 2, 3], () => true)).toEqual([]);
  });

  it("returns all when none match", () => {
    expect(dropWhile([1, 2, 3], () => false)).toEqual([1, 2, 3]);
  });

  it("handles empty array", () => {
    expect(dropWhile([], () => true)).toEqual([]);
  });

  it("provides index to predicate", () => {
    expect(dropWhile([1, 2, 3], (_, i) => i < 2)).toEqual([3]);
  });

  it("provides array to predicate", () => {
    expect(dropWhile([1, 2, 3], (v, _, arr) => v === arr[0])).toEqual([2, 3]);
  });

  it("[👾] does not access beyond array length", () => {
    const arr = [1, 2, 3];
    const indices: number[] = [];
    dropWhile(arr, (_, i) => {
      indices.push(i);
      return true;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = dropWhile(arr, (x) => x > 0);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always false predicate returns all elements",
    (arr) => {
      const result = dropWhile(arr, () => false);
      expect(result).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always true predicate returns empty array",
    (arr) => {
      const result = dropWhile(arr, () => true);
      expect(result).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      dropWhile(arr, (x) => x > 0);
      expect(arr).toEqual(original);
    }
  );
  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is a suffix of original array",
    (arr) => {
      const result = dropWhile(arr, (x) => x > 0);
      expect(arr.slice(arr.length - result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer({ min: -100, max: 100 }))])(
    "[🎲] first element of result does not match predicate (when non-empty)",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = dropWhile(arr, predicate);
      if (result.length > 0) {
        expect(predicate(result[0])).toBe(false);
      }
    }
  );
});
