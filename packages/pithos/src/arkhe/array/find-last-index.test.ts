import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { findLastIndex } from "./find-last-index";

describe("findLastIndex", () => {
  it("finds last matching index", () => {
    expect(findLastIndex([1, 2, 3, 2], (x) => x === 2)).toBe(3);
  });

  it("returns -1 when no match", () => {
    expect(findLastIndex([1, 2, 3], (x) => x === 4)).toBe(-1);
  });

  it("handles empty array", () => {
    expect(findLastIndex([], () => true)).toBe(-1);
  });

  it("provides index to predicate", () => {
    expect(findLastIndex([1, 2, 3], (_, i) => i === 1)).toBe(1);
  });

  it("provides array to predicate", () => {
    expect(findLastIndex([1, 2, 3], (v, _, arr) => v === arr[0])).toBe(0);
  });

  it("[🎯] single element matching predicate returns 0", () => {
    expect(findLastIndex([42], (x) => x === 42)).toBe(0);
  });

  it("[🎯] single element not matching returns -1", () => {
    expect(findLastIndex([42], (x) => x !== 42)).toBe(-1);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is -1 or valid index",
    (arr) => {
      const result = findLastIndex(arr, (x) => x > 0);
      expect(result).toBeGreaterThanOrEqual(-1);
      expect(result).toBeLessThan(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer()).filter((a) => a.length > 0)])(
    "[🎲] always true predicate returns last index",
    (arr) => {
      const result = findLastIndex(arr, () => true);
      expect(result).toBe(arr.length - 1);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] no element after result satisfies predicate",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = findLastIndex(arr, predicate);

      if (result !== -1) {
        expect(predicate(arr[result])).toBe(true);
        for (let i = result + 1; i < arr.length; i++) {
          expect(predicate(arr[i])).toBe(false);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      findLastIndex(arr, () => true);
      expect(arr).toEqual(original);
    }
  );
});
