import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { minBy } from "./min-by";

describe("minBy", () => {
  describe("array", () => {
    it("finds element with minimum value", () => {
      const users = [
        { name: "alice", age: 30 },
        { name: "bob", age: 25 },
      ];
      expect(minBy(users, (u) => u.age)).toEqual({ name: "bob", age: 25 });
    });

    it("returns undefined for empty array", () => {
      expect(minBy([], (x) => x)).toBeUndefined();
    });

    it("[👾] returns first element when it's the minimum", () => {
      const items = [{ v: 1 }, { v: 2 }, { v: 3 }];
      expect(minBy(items, (x) => x.v)).toEqual({ v: 1 });
    });

    it("[👾] returns first occurrence on equal values", () => {
      const items = [
        { id: 1, v: 5 },
        { id: 2, v: 5 },
      ];
      expect(minBy(items, (x) => x.v)).toEqual({ id: 1, v: 5 });
    });

    it("[👾] does not call iteratee on empty array", () => {
      const iteratee = vi.fn((x: number) => x);
      minBy([], iteratee);
      expect(iteratee).not.toHaveBeenCalled();
    });

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] result is undefined or in the array",
      (arr) => {
        const result = minBy(arr, (x) => x);
        if (arr.length === 0) {
          expect(result).toBeUndefined();
        } else {
          expect(arr).toContain(result);
        }
      }
    );

    itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
      "[🎲] no element has lower iteratee value than result",
      (arr) => {
        const iteratee = (x: number) => Math.abs(x) % 10;
        const result = minBy(arr, iteratee);
        if (result === undefined) throw new Error("Result should be defined");
        const resultValue = iteratee(result);

        for (const elem of arr) {
          expect(resultValue).toBeLessThanOrEqual(iteratee(elem));
        }
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] does not mutate original array",
      (arr) => {
        const original = [...arr];
        minBy(arr, (x) => x);
        expect(arr).toEqual(original);
      }
    );
  });
});
