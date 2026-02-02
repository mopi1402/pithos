import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { findLast } from "./find-last";

describe("findLast", () => {
  it("returns the last element matching predicate", () => {
    expect(findLast([1, 2, 3, 4, 5], (n) => n % 2 === 0)).toBe(4);
  });

  it("returns undefined when no element matches", () => {
    expect(findLast([1, 3, 5], (n) => n % 2 === 0)).toBeUndefined();
  });

  it("returns undefined for empty array", () => {
    expect(findLast([], () => true)).toBeUndefined();
  });

  it("works with objects", () => {
    const users = [
      { user: "barney", active: true },
      { user: "fred", active: false },
      { user: "pebbles", active: true },
    ];
    expect(findLast(users, (u) => u.active)).toEqual({
      user: "pebbles",
      active: true,
    });
  });

  it("passes index and array to predicate", () => {
    const indices: number[] = [];
    findLast([10, 20, 30], (_, i, arr) => {
      indices.push(i);
      return arr.length === 3 && i === 0;
    });
    expect(indices).toEqual([2, 1, 0]);
  });

  it("stops at first match from end", () => {
    let callCount = 0;
    findLast([1, 2, 3, 4, 5], (n) => {
      callCount++;
      return n === 4;
    });
    expect(callCount).toBe(2);
  });

  it("handles single element array", () => {
    expect(findLast([42], (n) => n === 42)).toBe(42);
    expect(findLast([42], (n) => n === 0)).toBeUndefined();
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is undefined or in array",
    (arr) => {
      const result = findLast(arr, (x) => x > 0);
      if (result !== undefined) {
        expect(arr).toContain(result);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()).filter((a) => a.length > 0)])(
    "[🎲] always true predicate returns last element",
    (arr) => {
      const result = findLast(arr, () => true);
      expect(result).toBe(arr[arr.length - 1]);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] no element after result satisfies predicate",
    (arr) => {
      const predicate = (x: number) => x > 0;
      const result = findLast(arr, predicate);

      if (result !== undefined) {
        expect(predicate(result)).toBe(true);
        const resultIndex = arr.lastIndexOf(result);
        for (let i = resultIndex + 1; i < arr.length; i++) {
          expect(predicate(arr[i])).toBe(false);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      findLast(arr, () => true);
      expect(arr).toEqual(original);
    }
  );
});
