import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { dropRightWhile } from "./drop-right-while";

describe("dropRightWhile", () => {
  it("drops elements from right while predicate is true", () => {
    expect(dropRightWhile([1, 2, 3, 4], (x) => x > 2)).toEqual([1, 2]);
  });

  it("returns empty when all match", () => {
    expect(dropRightWhile([1, 2, 3], () => true)).toEqual([]);
  });

  it("returns all when none match", () => {
    expect(dropRightWhile([1, 2, 3], () => false)).toEqual([1, 2, 3]);
  });

  it("handles empty array", () => {
    expect(dropRightWhile([], () => true)).toEqual([]);
  });

  it("provides index to predicate", () => {
    expect(dropRightWhile([1, 2, 3], (_, i) => i > 1)).toEqual([1, 2]);
  });

  it("provides array to predicate", () => {
    expect(
      dropRightWhile([1, 2, 3], (v, _, arr) => v === arr[arr.length - 1])
    ).toEqual([1, 2]);
  });

  it("[👾] keeps only first element when others match", () => {
    expect(dropRightWhile([1, 2, 3], (x) => x > 1)).toEqual([1]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = dropRightWhile(arr, (x) => x > 0);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always false predicate returns all elements",
    (arr) => {
      const result = dropRightWhile(arr, () => false);
      expect(result).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always true predicate returns empty array",
    (arr) => {
      const result = dropRightWhile(arr, () => true);
      expect(result).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is a prefix of original array",
    (arr) => {
      const result = dropRightWhile(arr, (x) => x > 0);
      expect(arr.slice(0, result.length)).toEqual(result);
    }
  );

  itProp.prop([fc.array(fc.integer({ min: -100, max: 100 }))])(
    "[🎲] last element of result does not match predicate (when non-empty)",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = dropRightWhile(arr, predicate);
      if (result.length > 0) {
        expect(predicate(result[result.length - 1])).toBe(false);
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      dropRightWhile(arr, (x) => x > 0);
      expect(arr).toEqual(original);
    }
  );
});
