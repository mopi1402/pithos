import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flatMapDeep } from "./flatMapDeep";

describe("flatMapDeep", () => {
  it("maps and flattens deeply", () => {
    expect(flatMapDeep([1, 2], (n) => [[n, n]])).toEqual([1, 1, 2, 2]);
  });

  it("flattens multiple levels of nesting", () => {
    expect(flatMapDeep([1], (n) => [[[n, n + 1, n + 2]]])).toEqual([1, 2, 3]);
  });

  it("handles iteratee returning single values", () => {
    expect(flatMapDeep([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]);
  });

  it("handles iteratee returning empty arrays", () => {
    expect(flatMapDeep([1, 2, 3], () => [])).toEqual([]);
  });

  it("provides index to iteratee", () => {
    expect(flatMapDeep(["a", "b"], (_, i) => [[i]])).toEqual([0, 1]);
  });

  it("provides collection to iteratee", () => {
    const arr = [1, 2];
    expect(flatMapDeep(arr, (_, __, coll) => [[coll.length]])).toEqual([2, 2]);
  });

  it("[🎯] handles empty array", () => {
    expect(flatMapDeep([], (n) => [[n]])).toEqual([]);
  });

  it("[🎯] handles single element array", () => {
    expect(flatMapDeep([5], (n) => [[[n]]])).toEqual([5]);
  });

  itProp.prop([fc.array(fc.integer({ min: -100, max: 100 }), { maxLength: 50 })])(
    "[🎲] is equivalent to map + flat(Infinity) for simple arrays",
    (arr) => {
      const iteratee = (n: number) => [[n, n * 2]];
      expect(flatMapDeep(arr, iteratee)).toEqual(
        arr.map(iteratee).flat(Infinity)
      );
    }
  );
});
