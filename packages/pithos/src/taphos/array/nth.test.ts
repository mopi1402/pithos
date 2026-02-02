import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { nth } from "./nth";
import { at } from "./at";

describe("nth", () => {
  test("nth is a wrapper of at function", () => {
    expect(nth).not.toBe(at);
    
    const array = [1, 2, 3, 4, 5];
    
    expect(nth(array, 0)).toBe(at(array, 0));
    expect(nth(array, 0)).toBe(1);
    
    expect(nth(array, -1)).toBe(at(array, -1));
    expect(nth(array, -1)).toBe(5);
    
    expect(nth(array, 10)).toBe(at(array, 10));
    expect(nth(array, 10)).toBeUndefined();
  });

  itProp.prop([fc.array(fc.anything(), { minLength: 1 }), fc.nat()])(
    "[🎲] nth(arr, i) equals arr[i] for valid indices",
    (arr, i) => {
      const idx = i % arr.length;
      expect(nth(arr, idx)).toBe(arr[idx]);
    }
  );

  test("[🎯] returns undefined for out of bounds index", () => {
    expect(nth([1, 2, 3], 10)).toBeUndefined();
    expect(nth([1, 2, 3], -10)).toBeUndefined();
  });
});
