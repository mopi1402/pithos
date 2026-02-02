import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { maxBy } from "./max-by";

describe("maxBy", () => {
  describe("array", () => {
    it("finds element with maximum value", () => {
      const users = [
        { name: "alice", age: 30 },
        { name: "bob", age: 25 },
      ];
      expect(maxBy(users, (u) => u.age)).toEqual({ name: "alice", age: 30 });
    });

    it("finds maximum when not first element", () => {
      const users = [
        { name: "alice", age: 25 },
        { name: "bob", age: 30 },
        { name: "charlie", age: 20 },
      ];
      expect(maxBy(users, (u) => u.age)).toEqual({ name: "bob", age: 30 });
    });

    it("returns undefined for empty array", () => {
      expect(maxBy([], (x: number) => x)).toBeUndefined();
    });

    it("[👾] returns first occurrence on equal values", () => {
      const items = [
        { id: 1, v: 5 },
        { id: 2, v: 5 },
      ];
      expect(maxBy(items, (x) => x.v)).toEqual({ id: 1, v: 5 });
    });

    it("[👾] does not call iteratee on empty array", () => {
      const iteratee = vi.fn((x: number) => x);
      maxBy([], iteratee);
      expect(iteratee).not.toHaveBeenCalled();
    });

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] result is undefined or in the array",
      (arr) => {
        const result = maxBy(arr, (x) => x);
        if (arr.length === 0) {
          expect(result).toBeUndefined();
        } else {
          expect(arr).toContain(result);
        }
      }
    );

    itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
      "[🎲] no element has higher iteratee value than result",
      (arr) => {
        const iteratee = (x: number) => x % 10;
        const result = maxBy(arr, iteratee);
        if (result === undefined) throw new Error("Result should be defined");
        const resultValue = iteratee(result);

        for (const elem of arr) {
          expect(resultValue).toBeGreaterThanOrEqual(iteratee(elem));
        }
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] does not mutate original array",
      (arr) => {
        const original = [...arr];
        maxBy(arr, (x) => x);
        expect(arr).toEqual(original);
      }
    );
  });
});
