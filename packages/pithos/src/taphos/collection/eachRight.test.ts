import { describe, it, expect, vi } from "vitest";
import { eachRight, forEachRight } from "./eachRight";

describe("eachRight", () => {
  it("iterates from right to left", () => {
    const result: number[] = [];
    eachRight([1, 2, 3], (x) => result.push(x));
    expect(result).toEqual([3, 2, 1]);
  });

  it("provides index to iteratee", () => {
    const indices: number[] = [];
    eachRight(["a", "b", "c"], (_, index) => indices.push(index));
    expect(indices).toEqual([2, 1, 0]);
  });

  it("provides collection to iteratee", () => {
    const arr = [1, 2, 3];
    const fn = vi.fn();
    eachRight(arr, fn);
    expect(fn).toHaveBeenCalledWith(3, 2, arr);
    expect(fn).toHaveBeenCalledWith(2, 1, arr);
    expect(fn).toHaveBeenCalledWith(1, 0, arr);
  });

  it("[🎯] handles empty array", () => {
    const fn = vi.fn();
    eachRight([], fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it("[🎯] handles single element array", () => {
    const result: number[] = [];
    eachRight([42], (x) => result.push(x));
    expect(result).toEqual([42]);
  });
});

describe("forEachRight", () => {
  it("is an alias for eachRight", () => {
    expect(forEachRight).toBe(eachRight);
  });
});
