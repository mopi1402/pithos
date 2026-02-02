import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { reverse } from "./reverse";

describe("reverse", () => {
  it("reverses the array", () => {
    expect(reverse([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1]);
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3];
    reverse(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("[🎯] returns empty array for empty input", () => {
    expect(reverse([])).toEqual([]);
  });

  it("[🎯] handles single element array", () => {
    expect(reverse([42])).toEqual([42]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] reverse(reverse(arr)) === arr",
    (arr) => {
      const reversed = reverse(arr);
      const doubleReversed = reverse(reversed);
      expect(doubleReversed).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])("[🎲] preserves length", (arr) => {
    const result = reverse(arr);
    expect(result).toHaveLength(arr.length);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original",
    (arr) => {
      const original = [...arr];
      reverse(arr);
      expect(arr).toEqual(original);
    }
  );
});
