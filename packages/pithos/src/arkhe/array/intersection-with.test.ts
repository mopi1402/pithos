import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { intersectionWith } from "./intersection-with";

describe("intersectionWith", () => {
  it("returns elements present in all arrays", () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const arr2 = [{ id: 2 }, { id: 3 }, { id: 4 }];
    expect(intersectionWith([arr1, arr2], (a, b) => a.id === b.id)).toEqual([
      { id: 2 },
      { id: 3 },
    ]);
  });

  it("handles multiple arrays", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ x: 2 }, { x: 3 }, { x: 4 }];
    const arr3 = [{ x: 3 }, { x: 4 }, { x: 5 }];
    expect(intersectionWith([arr1, arr2, arr3], (a, b) => a.x === b.x)).toEqual(
      [{ x: 3 }]
    );
  });

  it("uses custom comparator", () => {
    const arr1 = [1.2, 2.8, 3.1];
    const arr2 = [1.9, 3.5];
    expect(
      intersectionWith([arr1, arr2], (a, b) => Math.floor(a) === Math.floor(b))
    ).toEqual([1.2, 3.1]);
  });

  it("removes duplicates keeping first occurrence", () => {
    const arr1 = [
      { id: 1, order: "first" },
      { id: 1, order: "second" },
    ];
    const arr2 = [{ id: 1, order: "third" }];
    expect(intersectionWith([arr1, arr2], (a, b) => a.id === b.id)).toEqual([
      { id: 1, order: "first" },
    ]);
  });

  it("returns empty array when arrays is empty", () => {
    expect(intersectionWith([], (a: number, b: number) => a === b)).toEqual([]);
  });

  it("returns empty array when first array is empty", () => {
    expect(
      intersectionWith([[], [{ id: 1 }]], (a, b) => a.id === b.id)
    ).toEqual([]);
  });

  it("returns empty array when no common elements", () => {
    const arr1 = [{ id: 1 }];
    const arr2 = [{ id: 2 }];
    expect(intersectionWith([arr1, arr2], (a, b) => a.id === b.id)).toEqual([]);
  });

  it("[🎯] returns empty for empty second array", () => {
    expect(
      intersectionWith([[{ id: 1 }], []], (a, b) => a.id === b.id)
    ).toEqual([]);
  });

  it("[🎯] intersection with itself returns deduplicated array", () => {
    expect(
      intersectionWith(
        [
          [1, 2, 2, 3],
          [1, 2, 2, 3],
        ],
        (a, b) => a === b
      )
    ).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] result length is at most min of array lengths",
    (arr1, arr2) => {
      const result = intersectionWith([arr1, arr2], (a, b) => a === b);
      expect(result.length).toBeLessThanOrEqual(
        Math.min(arr1.length, arr2.length)
      );
    }
  );

  itProp.prop([
    fc.array(fc.integer({ min: -10, max: 10 })),
    fc.array(fc.integer({ min: -10, max: 10 })),
  ])(
    "[🎲] each result element matches something in all arrays",
    (arr1, arr2) => {
      const comparator = (a: number, b: number) => Math.abs(a - b) <= 1;
      const result = intersectionWith([arr1, arr2], comparator);

      for (const elem of result) {
        expect(arr1.some((x) => comparator(elem, x))).toBe(true);
        expect(arr2.some((x) => comparator(elem, x))).toBe(true);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] does not mutate original arrays",
    (arr1, arr2) => {
      const original1 = [...arr1];
      const original2 = [...arr2];
      intersectionWith([arr1, arr2], (a, b) => a === b);
      expect(arr1).toEqual(original1);
      expect(arr2).toEqual(original2);
    }
  );
});
