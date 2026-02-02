import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { min } from "./min";

describe("min", () => {
  it("returns minimum value", () => {
    expect(min([4, 2, 8, 6])).toBe(2);
  });

  it("[🎯] returns undefined for empty array", () => {
    expect(min([])).toBeUndefined();
  });

  it("[🎯] handles negative numbers", () => {
    expect(min([-1, -5, -3])).toBe(-5);
  });

  it("[🎯] handles single element", () => {
    expect(min([42])).toBe(42);
  });

  itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 50 })])(
    "[🎲] is equivalent to Math.min",
    (arr) => {
      expect(min(arr)).toBe(Math.min(...arr));
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1, maxLength: 50 })])(
    "[🎲] result is <= all elements",
    (arr) => {
      const result = min(arr)!;
      expect(arr.every(n => n >= result)).toBe(true);
    }
  );
});
