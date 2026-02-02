import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { max } from "./max";

describe("max", () => {
  it("returns maximum value", () => {
    expect(max([4, 2, 8, 6])).toBe(8);
  });

  it("[🎯] returns undefined for empty array", () => {
    expect(max([])).toBeUndefined();
  });

  it("[🎯] handles negative numbers", () => {
    expect(max([-1, -5, -3])).toBe(-1);
  });

  it("[🎯] handles single element", () => {
    expect(max([42])).toBe(42);
  });

  itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 50 })])(
    "[🎲] is equivalent to Math.max",
    (arr) => {
      expect(max(arr)).toBe(Math.max(...arr));
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 50 })])(
    "[🎲] result is >= all elements",
    (arr) => {
      const result = max(arr)!;
      expect(arr.every(n => n <= result)).toBe(true);
    }
  );
});
