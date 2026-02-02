import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flatMapDepth } from "./flatMapDepth";

describe("flatMapDepth", () => {
  it("flattens to specified depth", () => {
    expect(flatMapDepth([1, 2], (n) => [[[[n, n]]]], 2)).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it("defaults to depth 1", () => {
    expect(flatMapDepth([1, 2], (n) => [[[n, n]]])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it("handles depth 0", () => {
    expect(flatMapDepth([1, 2], (n) => [[n, n]], 0)).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  it("handles iteratee returning single values", () => {
    expect(flatMapDepth([1, 2, 3], (n) => n * 2, 1)).toEqual([2, 4, 6]);
  });

  it("provides index to iteratee", () => {
    expect(flatMapDepth(["a", "b"], (_, i) => [[[i]]], 1)).toEqual([[0], [1]]);
  });

  it("provides collection to iteratee", () => {
    const arr = [1, 2];
    expect(flatMapDepth(arr, (_, __, coll) => [[[coll.length]]], 1)).toEqual([
      [2],
      [2],
    ]);
  });

  it("[🎯] handles empty array", () => {
    expect(flatMapDepth([], (n) => [[n]], 2)).toEqual([]);
  });

  it("[🎯] handles single element array", () => {
    expect(flatMapDepth([5], (n) => [[[n]]], 2)).toEqual([5]);
  });

  itProp.prop([fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 }), fc.integer({ min: 0, max: 3 })])(
    "[🎲] is equivalent to flatMap + flat(depth) for simple arrays",
    (arr, depth) => {
      const iteratee = (n: number) => [[n]];
      expect(flatMapDepth(arr, iteratee, depth)).toEqual(
        arr.flatMap(iteratee).flat(depth)
      );
    }
  );
});
