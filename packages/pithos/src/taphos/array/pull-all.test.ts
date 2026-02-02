import { describe, it, expect } from "vitest";
import { pullAll } from "./pull-all";

describe("pullAll", () => {
  it("removes specified values", () => {
    expect(pullAll([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
  });

  it("removes all occurrences", () => {
    expect(pullAll([1, 2, 1, 2], [1])).toEqual([2, 2]);
  });

  it("[🎯] handles empty values array", () => {
    expect(pullAll([1, 2, 3], [])).toEqual([1, 2, 3]);
  });

  it("[🎯] handles empty array", () => {
    expect(pullAll([], [1, 2])).toEqual([]);
  });

  it("mutates original array", () => {
    const arr = [1, 2, 3];
    pullAll(arr, [2]);
    expect(arr).toEqual([1, 3]);
  });
});
