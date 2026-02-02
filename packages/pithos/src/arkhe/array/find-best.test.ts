import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { findBest } from "./find-best";

describe("findBest", () => {
  it("finds element by comparator (max)", () => {
    const result = findBest(
      [1, 3, 2],
      (x) => x,
      (a, b) => a > b
    );
    expect(result).toBe(3);
  });

  it("finds element by comparator (min)", () => {
    const result = findBest(
      [3, 1, 2],
      (x) => x,
      (a, b) => a < b
    );
    expect(result).toBe(1);
  });

  it("uses iteratee to derive comparison value", () => {
    const users = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const result = findBest(
      users,
      (u) => u.age,
      (a, b) => a < b
    );
    expect(result).toEqual({ age: 20 });
  });

  it("returns undefined for empty array", () => {
    expect(
      findBest(
        [],
        (x) => x,
        () => true
      )
    ).toBeUndefined();
  });

  it("returns first element when all equal", () => {
    const result = findBest(
      [1, 1, 1],
      (x) => x,
      (a, b) => a > b
    );
    expect(result).toBe(1);
  });

  it("[👾] does not call iteratee on empty array", () => {
    const iteratee = vi.fn((x: number) => x);
    findBest([], iteratee, (a, b) => a > b);
    expect(iteratee).not.toHaveBeenCalled();
  });

  it("[🎯] returns first element when multiple have same extreme value", () => {
    const items = [
      { id: 1, score: 10 },
      { id: 2, score: 5 },
      { id: 3, score: 10 },
    ];
    const result = findBest(
      items,
      (x) => x.score,
      (a, b) => a > b
    );
    expect(result).toEqual({ id: 1, score: 10 });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result is undefined or in the array",
    (arr) => {
      const result = findBest(
        arr,
        (x) => x,
        (a, b) => a > b
      );
      if (arr.length === 0) {
        expect(result).toBeUndefined();
      } else {
        expect(arr).toContain(result);
      }
    }
  );

  itProp.prop([fc.array(fc.integer({ min: 1, max: 100 }))])(
    "[🎲] result is >= all elements when finding max",
    (arr) => {
      if (arr.length === 0) return;
      const result = findBest(
        arr,
        (x) => x,
        (a, b) => a > b
      );
      arr.forEach((elem) => {
        expect(result).toBeGreaterThanOrEqual(elem);
      });
    }
  );

  itProp.prop([fc.array(fc.integer({ min: 1, max: 100 }))])(
    "[🎲] result is <= all elements when finding min",
    (arr) => {
      if (arr.length === 0) return;
      const result = findBest(
        arr,
        (x) => x,
        (a, b) => a < b
      );
      arr.forEach((elem) => {
        expect(result).toBeLessThanOrEqual(elem);
      });
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      findBest(
        arr,
        (x) => x,
        (a, b) => a > b
      );
      expect(arr).toEqual(original);
    }
  );
});
