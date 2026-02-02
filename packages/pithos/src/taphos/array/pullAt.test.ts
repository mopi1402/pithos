import { describe, it, expect } from "vitest";
import { pullAt } from "./pullAt";

describe("pullAt", () => {
  it("removes elements at specified indexes", () => {
    const array = ["a", "b", "c", "d"];
    const pulled = pullAt(array, [1, 3]);
    expect(pulled).toEqual(["b", "d"]);
    expect(array).toEqual(["a", "c"]);
  });

  it("returns elements in index order", () => {
    const array = ["a", "b", "c", "d"];
    const pulled = pullAt(array, [3, 1]);
    expect(pulled).toEqual(["d", "b"]);
  });

  it("handles duplicate indexes", () => {
    const array = ["a", "b", "c"];
    const pulled = pullAt(array, [1, 1]);
    expect(pulled).toEqual(["b", "b"]);
    expect(array).toEqual(["a", "c"]);
  });

  it("ignores out-of-bounds indexes", () => {
    const array = ["a", "b", "c"];
    const pulled = pullAt(array, [5, 10]);
    expect(pulled).toEqual([]);
    expect(array).toEqual(["a", "b", "c"]);
  });

  it("ignores negative indexes", () => {
    const array = ["a", "b", "c"];
    const pulled = pullAt(array, [-1, -2]);
    expect(pulled).toEqual([]);
    expect(array).toEqual(["a", "b", "c"]);
  });

  it("handles mixed valid and invalid indexes", () => {
    const array = ["a", "b", "c", "d"];
    const pulled = pullAt(array, [-1, 1, 10, 3]);
    expect(pulled).toEqual(["b", "d"]);
    expect(array).toEqual(["a", "c"]);
  });

  it("handles empty indexes array", () => {
    const array = ["a", "b", "c"];
    const pulled = pullAt(array, []);
    expect(pulled).toEqual([]);
    expect(array).toEqual(["a", "b", "c"]);
  });

  it("[🎯] handles empty array", () => {
    const array: string[] = [];
    const pulled = pullAt(array, [0, 1]);
    expect(pulled).toEqual([]);
    expect(array).toEqual([]);
  });

  it("[🎯] handles single element array", () => {
    const array = ["a"];
    const pulled = pullAt(array, [0]);
    expect(pulled).toEqual(["a"]);
    expect(array).toEqual([]);
  });

  it("mutates original array", () => {
    const array = [1, 2, 3, 4, 5];
    pullAt(array, [1, 3]);
    expect(array).toEqual([1, 3, 5]);
  });
});
