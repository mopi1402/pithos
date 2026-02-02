import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniqWith } from "./uniq-with";

describe("uniqWith", () => {
  it("removes duplicates using comparator", () => {
    const objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ];
    const result = uniqWith(objects, (a, b) => a.x === b.x && a.y === b.y);
    expect(result).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(uniqWith([], () => true)).toEqual([]);
  });

  it("preserves first occurrence", () => {
    const array = [
      { id: 1, value: "first" },
      { id: 1, value: "second" },
    ];
    expect(uniqWith(array, (a, b) => a.id === b.id)).toEqual([
      { id: 1, value: "first" },
    ]);
  });

  it("handles case-insensitive comparison", () => {
    const result = uniqWith(
      ["A", "a", "B", "b"],
      (a, b) => a.toLowerCase() === b.toLowerCase()
    );
    expect(result).toEqual(["A", "B"]);
  });

  it("handles all unique values", () => {
    const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(uniqWith(array, (a, b) => a.id === b.id)).toEqual(array);
  });

  it("handles all duplicate values", () => {
    const array = [{ id: 1 }, { id: 1 }, { id: 1 }];
    expect(uniqWith(array, (a, b) => a.id === b.id)).toEqual([{ id: 1 }]);
  });

  it("handles single element array", () => {
    expect(uniqWith([{ id: 1 }], () => true)).toEqual([{ id: 1 }]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is at most array length",
    (arr) => {
      const result = uniqWith(arr, (a, b) => a === b);
      expect(result.length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] equality comparator removes all duplicates",
    (arr) => {
      const result = uniqWith(arr, (a, b) => a === b);
      const unique = [...new Set(arr)];
      expect(result.sort()).toEqual(unique.sort());
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] no duplicates according to comparator in result",
    (arr) => {
      const comparator = (a: number, b: number) => a % 5 === b % 5;
      const result = uniqWith(arr, comparator);
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          expect(comparator(result[i], result[j])).toBe(false);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      uniqWith(arr, (a, b) => a === b);
      expect(arr).toEqual(original);
    }
  );
});
