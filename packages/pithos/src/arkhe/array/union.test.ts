import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { union } from "./union";

describe("union", () => {
  it("creates array of unique values from multiple arrays", () => {
    expect(
      union([
        [1, 2],
        [2, 3],
        [3, 4],
      ])
    ).toEqual([1, 2, 3, 4]);
  });

  it("returns empty array for empty input", () => {
    expect(union([])).toEqual([]);
  });

  it("handles single array", () => {
    expect(union([[1, 2, 3]])).toEqual([1, 2, 3]);
  });

  it("preserves first occurrence order", () => {
    expect(
      union([
        ["a", "b"],
        ["b", "c"],
      ])
    ).toEqual(["a", "b", "c"]);
  });

  it("handles empty arrays in input", () => {
    expect(union([[1, 2], [], [3, 4]])).toEqual([1, 2, 3, 4]);
  });

  it("handles duplicate values in same array", () => {
    expect(
      union([
        [1, 1, 2],
        [2, 3, 3],
      ])
    ).toEqual([1, 2, 3]);
  });

  it("works with objects by reference", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    expect(union([[obj1, obj2], [obj1]])).toEqual([obj1, obj2]);
  });

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result has no duplicates",
    (arrays) => {
      const result = union(arrays);
      const unique = new Set(result);
      expect(result.length).toBe(unique.size);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result length is at most sum of all lengths",
    (arrays) => {
      const result = union(arrays);
      const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
      expect(result.length).toBeLessThanOrEqual(totalLength);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] union with itself equals deduplicated array",
    (arr) => {
      const result = union([arr, arr]);
      const unique = [...new Set(arr)];
      expect(result).toEqual(unique);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()), { minLength: 1 })])(
    "[🎲] every unique input element is present in result",
    (arrays) => {
      const result = union(arrays);
      const resultSet = new Set(result);

      for (const arr of arrays) {
        for (const item of arr) {
          expect(resultSet.has(item)).toBe(true);
        }
      }
    }
  );

  it("[🎲] does not mutate original arrays", () => {
    const arr1 = [1, 2];
    const arr2 = [2, 3];
    union([arr1, arr2]);
    expect(arr1).toEqual([1, 2]);
    expect(arr2).toEqual([2, 3]);
  });
});
