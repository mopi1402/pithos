import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { xor } from "./xor";

describe("xor", () => {
  it("returns symmetric difference of arrays", () => {
    expect(
      xor([
        [2, 1],
        [2, 3],
      ])
    ).toEqual([1, 3]);
  });

  it("handles multiple arrays", () => {
    expect(
      xor([
        [1, 2, 3],
        [3, 4, 5],
        [5, 6],
      ])
    ).toEqual([1, 2, 4, 6]);
  });

  it("returns empty array for empty input", () => {
    expect(xor([])).toEqual([]);
  });

  it("returns all elements for single array", () => {
    expect(xor([[1, 2, 3]])).toEqual([1, 2, 3]);
  });

  it("handles empty arrays in input", () => {
    expect(xor([[1, 2], [], [2, 3]])).toEqual([1, 3]);
  });

  it("handles duplicates within same array", () => {
    expect(
      xor([
        [1, 1, 2],
        [2, 3, 3],
      ])
    ).toEqual([1, 3]);
  });

  it("returns empty array when all elements are shared", () => {
    expect(
      xor([
        [1, 2],
        [1, 2],
      ])
    ).toEqual([]);
  });

  it("preserves first occurrence order", () => {
    expect(
      xor([
        ["a", "b"],
        ["b", "c"],
      ])
    ).toEqual(["a", "c"]);
  });

  it("handles three-way intersection", () => {
    expect(
      xor([
        [1, 2],
        [2, 3],
        [2, 4],
      ])
    ).toEqual([1, 3, 4]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] xor is commutative",
    (arr1, arr2) => {
      const result1 = xor([arr1, arr2]);
      const result2 = xor([arr2, arr1]);
      expect(result1.sort()).toEqual(result2.sort());
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] xor with itself is empty",
    (arr) => {
      const result = xor([arr, arr]);
      expect(result).toEqual([]);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result has no duplicates",
    (arrays) => {
      const result = xor(arrays);
      const unique = new Set(result);
      expect(result.length).toBe(unique.size);
    }
  );

  itProp.prop([
    fc.array(fc.array(fc.integer(), { maxLength: 5 }), { maxLength: 4 }),
  ])(
    "[🎲] each result element appears in exactly one input array",
    (arrays) => {
      const result = xor(arrays);
      for (const elem of result) {
        const containingArrays = arrays.filter((arr) => arr.includes(elem));
        expect(containingArrays.length).toBe(1);
      }
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] does not mutate original arrays",
    (arrays) => {
      const originals = arrays.map((arr) => [...arr]);
      xor(arrays);
      arrays.forEach((arr, i) => {
        expect(arr).toEqual(originals[i]);
      });
    }
  );
});
