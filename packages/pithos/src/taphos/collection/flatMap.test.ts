import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flatMap } from "./flatMap";

describe("flatMap", () => {
  it("maps and flattens one level", () => {
    expect(flatMap([1, 2], (n) => [n, n])).toEqual([1, 1, 2, 2]);
  });

  it("handles iteratee returning single values", () => {
    expect(flatMap([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
  });

  it("handles iteratee returning empty arrays", () => {
    expect(flatMap([1, 2, 3], () => [])).toEqual([]);
  });

  it("provides index to iteratee", () => {
    expect(flatMap(["a", "b"], (_, i) => [i])).toEqual([0, 1]);
  });

  it("provides collection to iteratee", () => {
    const arr = [1, 2];
    expect(flatMap(arr, (_, __, coll) => [coll.length])).toEqual([2, 2]);
  });

  it("[🎯] handles empty array", () => {
    expect(flatMap([], (n) => [n, n])).toEqual([]);
  });

  it("[🎯] handles single element array", () => {
    expect(flatMap([5], (n) => [n, n * 2])).toEqual([5, 10]);
  });

  it("only flattens one level", () => {
    expect(flatMap([1, 2], (n) => [[n, n]])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  itProp.prop([fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 })])(
    "[🎲] is equivalent to native Array.flatMap",
    (arr) => {
      const iteratee = (n: number) => [n, n * 2];
      expect(flatMap(arr, iteratee)).toEqual(arr.flatMap(iteratee));
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer(), { maxLength: 10 }), { maxLength: 20 })])(
    "[🎲] is equivalent to native Array.flatMap for identity",
    (arr) => {
      const iteratee = (x: number[]) => x;
      expect(flatMap(arr, iteratee)).toEqual(arr.flatMap(iteratee));
    }
  );
});
