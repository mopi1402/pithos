import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { fill } from "./fill";

describe("fill", () => {
  it("fills elements from start to end", () => {
    expect(fill([1, 2, 3, 4, 5], 0, 1, 3)).toEqual([1, 0, 0, 4, 5]);
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3];
    fill(arr, 0);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("[🎯] returns empty array for empty input", () => {
    expect(fill([], 0)).toEqual([]);
  });

  it("[🎯] fills entire array without start/end", () => {
    expect(fill([1, 2, 3], 0)).toEqual([0, 0, 0]);
  });

  it("[🎯] handles negative indices", () => {
    expect(fill([1, 2, 3, 4], 0, -2)).toEqual([1, 2, 0, 0]);
  });

  it("[🎯] handles start greater than end", () => {
    expect(fill([1, 2, 3], 0, 2, 1)).toEqual([1, 2, 3]);
  });

  itProp.prop([
    fc.array(fc.integer(), { minLength: 1 }),
    fc.integer(),
    fc.integer({ min: 0, max: 10 }),
    fc.integer({ min: 0, max: 10 }),
  ])(
    "[🎲] elements in range [start, end) equal fill value",
    (arr, value, rawStart, rawEnd) => {
      const start = Math.min(rawStart, arr.length);
      const end = Math.min(rawEnd, arr.length);
      const result = fill(arr, value, start, end);

      for (let i = start; i < end; i++) {
        expect(result[i]).toBe(value);
      }
    }
  );

  itProp.prop([
    fc.array(fc.integer(), { minLength: 1 }),
    fc.integer(),
    fc.integer({ min: 0, max: 10 }),
    fc.integer({ min: 0, max: 10 }),
  ])(
    "[🎲] elements outside range [start, end) are unchanged",
    (arr, value, rawStart, rawEnd) => {
      const start = Math.min(rawStart, arr.length);
      const end = Math.min(rawEnd, arr.length);
      const result = fill(arr, value, start, end);

      for (let i = 0; i < start; i++) {
        expect(result[i]).toBe(arr[i]);
      }
      for (let i = end; i < arr.length; i++) {
        expect(result[i]).toBe(arr[i]);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] does not mutate original",
    (arr, value) => {
      const original = [...arr];
      fill(arr, value);
      expect(arr).toEqual(original);
    }
  );
});
