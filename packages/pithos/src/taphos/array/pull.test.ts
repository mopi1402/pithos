import { describe, it, expect } from "vitest";
import { pull } from "./pull";

describe("pull", () => {
  it("removes specified values", () => {
    expect(pull([1, 2, 3, 4], 2, 4)).toEqual([1, 3]);
  });

  it("removes all occurrences", () => {
    expect(pull([1, 2, 1, 2], 1)).toEqual([2, 2]);
  });

  it("returns all when no values match", () => {
    expect(pull([1, 2, 3], 4, 5)).toEqual([1, 2, 3]);
  });

  it("[🎯] handles empty array", () => {
    expect(pull([], 1, 2)).toEqual([]);
  });

  it("[🎯] handles no values to pull", () => {
    expect(pull([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("mutates original array", () => {
    const arr = [1, 2, 3];
    pull(arr, 2);
    expect(arr).toEqual([1, 3]);
  });
});
