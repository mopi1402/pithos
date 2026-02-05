import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { intersectionBy } from "./intersection-by";

describe("intersectionBy", () => {
  it("returns elements present in all arrays by property", () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const arr2 = [{ id: 2 }, { id: 3 }, { id: 4 }];
    expect(intersectionBy([arr1, arr2], (x) => x.id)).toEqual([
      { id: 2 },
      { id: 3 },
    ]);
  });

  it("handles multiple arrays", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const arr3 = [{ x: 3 }, { x: 4 }, { x: 5 }];
    expect(intersectionBy([arr1, arr2, arr3], (item) => item.x)).toEqual([
      { x: 3 },
    ]);
  });

  it("uses function iteratee for comparison", () => {
    const arr1 = [{ value: 1.2 }, { value: 2.8 }];
    const arr2 = [{ value: 1.9 }, { value: 3.5 }];
    expect(intersectionBy([arr1, arr2], (x) => Math.floor(x.value))).toEqual([
      { value: 1.2 },
    ]);
  });

  it("removes duplicates from result", () => {
    const arr1 = [{ id: 1 }, { id: 1 }, { id: 2 }];
    const arr2 = [{ id: 1 }, { id: 2 }];
    expect(intersectionBy([arr1, arr2], (x) => x.id)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("returns empty array when arrays is empty", () => {
    expect(intersectionBy([], (x: { id: number }) => x.id)).toEqual([]);
  });

  it("returns empty array when first array is empty", () => {
    expect(intersectionBy([[], [{ id: 1 }]], (x) => x.id)).toEqual([]);
  });

  it("[👾] single array returns deduplicated elements", () => {
    expect(intersectionBy([[1, 2, 2, 3, 3, 3]], (x) => x)).toEqual([1, 2, 3]);
  });

  it("[👾] single array deduplicates by iteratee", () => {
    const arr = [{ id: 1, v: "a" }, { id: 1, v: "b" }, { id: 2, v: "c" }];
    expect(intersectionBy([arr], (x) => x.id)).toEqual([
      { id: 1, v: "a" },
      { id: 2, v: "c" },
    ]);
  });

  it("[🎯] intersection of array with itself returns unique elements", () => {
    expect(
      intersectionBy(
        [
          [1, 2, 2, 3],
          [1, 2, 2, 3],
        ],
        (x) => x
      )
    ).toEqual([1, 2, 3]);
  });

  it("[👾] calls function iteratee correctly", () => {
    const arr1 = [{ id: 1 }, { id: 2 }];
    const arr2 = [{ id: 2 }, { id: 3 }];
    const iteratee = vi.fn((x: { id: number }) => x.id);

    intersectionBy([arr1, arr2], iteratee);

    expect(iteratee).toHaveBeenCalled();
  });

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result length is at most the length of the shortest array",
    (arrays) => {
      if (arrays.length === 0) {
        expect(intersectionBy(arrays, (x) => x)).toEqual([]);
        return;
      }
      const result = intersectionBy(arrays, (x) => x);
      const minLength = Math.min(...arrays.map((arr) => arr.length));
      expect(result.length).toBeLessThanOrEqual(minLength);
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] all result elements are in the first array",
    (arrays) => {
      if (arrays.length === 0) return;
      const result = intersectionBy(arrays, (x) => x);
      const firstArray = arrays[0] || [];
      result.forEach((elem) => {
        expect(firstArray).toContainEqual(elem);
      });
    }
  );

  itProp.prop([
    fc.array(fc.array(fc.integer({ min: -10, max: 10 })), { minLength: 1 }),
  ])(
    "[🎲] each result element's computed value exists in all arrays",
    (arrays) => {
      const iteratee = (x: number) => x % 5;
      const result = intersectionBy(arrays, iteratee);
      const sets = arrays.map((arr) => new Set(arr.map(iteratee)));

      for (const elem of result) {
        const value = iteratee(elem);
        for (const set of sets) {
          expect(set.has(value)).toBe(true);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      intersectionBy([arr1, arr2], (x) => x);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
