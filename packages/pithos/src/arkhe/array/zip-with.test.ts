import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { zipWith } from "./zip-with";

describe("zipWith", () => {
  it("combines arrays with iteratee", () => {
    expect(
      zipWith(
        [
          [1, 2],
          [10, 20],
          [100, 200],
        ],
        (a, b, c) => a + b + c
      )
    ).toEqual([111, 222]);
  });

  it("multiplies corresponding elements", () => {
    expect(
      zipWith(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        (a, b) => a * b
      )
    ).toEqual([4, 10, 18]);
  });

  it("returns empty array for empty input", () => {
    expect(zipWith([], (x) => x)).toEqual([]);
  });

  it("handles single array", () => {
    expect(zipWith([[1, 2, 3]], (x) => x * 2)).toEqual([2, 4, 6]);
  });

  it("handles unequal length arrays with undefined", () => {
    const result = zipWith(
      [
        [1, 2, 3],
        [10, 20],
      ],
      (a, b) => (a ?? 0) + (b ?? 0)
    );
    expect(result).toEqual([11, 22, 3]);
  });

  it("works with string concatenation", () => {
    expect(
      zipWith(
        [
          ["a", "b"],
          ["1", "2"],
        ],
        (a, b) => a + b
      )
    ).toEqual(["a1", "b2"]);
  });

  it("handles empty arrays in input", () => {
    expect(zipWith([[1, 2], []], (a, b) => [a, b])).toEqual([
      [1, undefined],
      [2, undefined],
    ]);
  });

  it("[🎯] different lengths uses max length", () => {
    expect(zipWith([[1], [2, 3]], (a, b) => [a, b])).toEqual([
      [1, 2],
      [undefined, 3],
    ]);
  });

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result length equals max array length",
    (arrays) => {
      if (arrays.length === 0) return;
      const result = zipWith(arrays, (...args) => args);
      const maxLength = Math.max(...arrays.map((a) => a.length), 0);
      expect(result.length).toBe(maxLength);
    }
  );

  itProp.prop([
    fc.array(fc.array(fc.integer(), { maxLength: 5 }), {
      minLength: 1,
      maxLength: 4,
    }),
  ])(
    "[🎲] result[i] === iteratee(arrays[0][i], arrays[1][i], ...)",
    (arrays) => {
      const maxLen = Math.max(...arrays.map((a) => a.length));
      const result = zipWith(arrays, (...args) => args);

      for (let i = 0; i < maxLen; i++) {
        const expected = arrays.map((arr) => arr[i]);
        expect(result[i]).toEqual(expected);
      }
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] does not mutate original arrays",
    (arrays) => {
      const originals = arrays.map((arr) => [...arr]);
      zipWith(arrays, (...args) => args);
      arrays.forEach((arr, i) => {
        expect(arr).toEqual(originals[i]);
      });
    }
  );
});
