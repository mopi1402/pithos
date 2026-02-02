import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unionBy } from "./union-by";

describe("unionBy", () => {
  it("unions by iteratee", () => {
    expect(
      unionBy(
        [
          [2.1, 1.2],
          [2.3, 3.4],
        ],
        Math.floor
      )
    ).toEqual([2.1, 1.2, 3.4]);
  });

  it("unions by property", () => {
    const arr1 = [{ x: 1 }, { x: 2 }];
    const arr2 = [{ x: 1 }, { x: 3 }];
    expect(unionBy([arr1, arr2], (o) => o.x)).toEqual([
      { x: 1 },
      { x: 2 },
      { x: 3 },
    ]);
  });

  it("keeps first occurrence", () => {
    expect(
      unionBy([[{ id: 1, v: "a" }], [{ id: 1, v: "b" }]], (o) => o.id)
    ).toEqual([{ id: 1, v: "a" }]);
  });

  it("handles multiple arrays", () => {
    expect(unionBy([[1], [2], [1, 3]], (x) => x)).toEqual([1, 2, 3]);
  });

  it("returns empty for empty input", () => {
    expect(unionBy([], (x) => x)).toEqual([]);
  });

  it("handles empty arrays in input", () => {
    expect(unionBy([[1, 2], [], [3]], (x) => x)).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result length is at most sum of all lengths",
    (arrays) => {
      const result = unionBy(arrays, (x) => x % 10);
      const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
      expect(result.length).toBeLessThanOrEqual(totalLength);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] no duplicates based on iteratee",
    (arrays) => {
      const result = unionBy(arrays, (x) => x % 5);
      const keys = result.map((x) => x % 5);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()), { minLength: 1 })])(
    "[🎲] every result element comes from one of the input arrays",
    (arrays) => {
      const result = unionBy(arrays, (x) => x % 10);
      const allElements = arrays.flat();
      result.forEach((item) => {
        expect(allElements).toContain(item);
      });
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] every unique key from inputs is represented in result",
    (arrays) => {
      const iteratee = (x: number) => x % 7;
      const result = unionBy(arrays, iteratee);
      const resultKeys = new Set(result.map(iteratee));

      for (const arr of arrays) {
        for (const item of arr) {
          expect(resultKeys.has(iteratee(item))).toBe(true);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr) => {
      const original = [...arr];
      unionBy([[...arr]], (x) => x);
      expect(arr).toEqual(original);
    }
  );
});
