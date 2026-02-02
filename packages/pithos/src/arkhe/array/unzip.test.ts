import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unzip } from "./unzip";

describe("unzip", () => {
  it("unzips array of tuples", () => {
    expect(
      unzip([
        [1, "a"],
        [2, "b"],
      ])
    ).toEqual([
      [1, 2],
      ["a", "b"],
    ]);
  });

  it("unzips three-element tuples", () => {
    expect(
      unzip([
        [1, "a", true],
        [2, "b", false],
      ])
    ).toEqual([
      [1, 2],
      ["a", "b"],
      [true, false],
    ]);
  });

  it("returns empty for empty array", () => {
    expect(unzip([])).toEqual([]);
  });

  it("handles single tuple", () => {
    expect(unzip([[1, 2, 3]])).toEqual([[1], [2], [3]]);
  });

  it("handles single-element tuples", () => {
    expect(unzip([[1], [2], [3]])).toEqual([[1, 2, 3]]);
  });

  it("throws RangeError when tuples have inconsistent lengths", () => {
    expect(() =>
      unzip([
        [1, "a"],
        [2, "b", "c"],
      ])
    ).toThrow(RangeError);

    expect(() =>
      unzip([
        [1, "a", true],
        [2, "b"],
      ])
    ).toThrow(RangeError);

    expect(() => unzip([[1], [2, 3]])).toThrow(RangeError);
  });

  itProp.prop([
    fc.array(fc.tuple(fc.integer(), fc.integer()), {
      minLength: 1,
      maxLength: 10,
    }),
  ])("[🎲] result has correct dimensions", (tuples) => {
    const result = unzip(tuples);
    expect(result.length).toBe(tuples[0].length);
    result.forEach((arr) => {
      expect(arr.length).toBe(tuples.length);
    });
  });

  itProp.prop([
    fc.array(fc.tuple(fc.integer(), fc.integer()), {
      minLength: 1,
      maxLength: 10,
    }),
  ])("[🎲] unzip preserves all values", (tuples) => {
    const result = unzip(tuples);
    const flattened = result.flat();
    const expected = tuples.flat();
    expect(flattened.sort()).toEqual(expected.sort());
  });

  itProp.prop([
    fc.array(fc.tuple(fc.integer(), fc.integer()), {
      minLength: 1,
      maxLength: 10,
    }),
  ])("[🎲] result[j][i] === tuples[i][j] (transpose invariant)", (tuples) => {
    const result = unzip(tuples);

    for (let i = 0; i < tuples.length; i++) {
      for (let j = 0; j < tuples[0].length; j++) {
        expect(result[j][i]).toBe(tuples[i][j]);
      }
    }
  });
});
