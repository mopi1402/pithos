import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { zip } from "./zip";

describe("zip", () => {
  it("zips two arrays", () => {
    expect(zip([1, 2], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("zips three arrays", () => {
    expect(zip([1, 2], ["a", "b"], [true, false])).toEqual([
      [1, "a", true],
      [2, "b", false],
    ]);
  });

  it("truncates to shortest array", () => {
    expect(zip([1, 2, 3], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("returns empty for no arrays", () => {
    expect(zip()).toEqual([]);
  });

  it("handles single array", () => {
    expect(zip([1, 2])).toEqual([[1], [2]]);
  });

  it("returns empty when any array is empty", () => {
    expect(zip([1, 2], [])).toEqual([]);
  });

  it("[👾] uses first array length when it's shortest", () => {
    expect(zip([1], ["a", "b", "c"], [true, false])).toEqual([[1, "a", true]]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.string())])(
    "[🎲] result length equals shortest input array",
    (arr1, arr2) => {
      const result = zip(arr1, arr2);
      const minLength = Math.min(arr1.length, arr2.length);
      expect(result.length).toBe(minLength);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.string())])(
    "[🎲] each tuple has length equal to number of input arrays",
    (arr1, arr2) => {
      const result = zip(arr1, arr2);
      result.forEach((tuple) => {
        expect(tuple.length).toBe(2);
      });
    }
  );

  itProp.prop([
    fc.array(fc.integer()),
    fc.array(fc.string()),
    fc.array(fc.boolean()),
  ])("[🎲] preserves element order and position", (arr1, arr2, arr3) => {
    const result = zip(arr1, arr2, arr3);
    result.forEach((tuple, i) => {
      expect(tuple[0]).toBe(arr1[i]);
      expect(tuple[1]).toBe(arr2[i]);
      expect(tuple[2]).toBe(arr3[i]);
    });
  });
});
