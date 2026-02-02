import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { groupWith } from "./group-with";

describe("groupWith", () => {
  it("groups consecutive elements matching predicate", () => {
    expect(groupWith([1, 1, 2, 2, 3], (a, b) => a === b)).toEqual([
      [1, 1],
      [2, 2],
      [3],
    ]);
  });

  it("groups consecutive ascending numbers", () => {
    expect(groupWith([1, 2, 3, 5, 6], (a, b) => b - a === 1)).toEqual([
      [1, 2, 3],
      [5, 6],
    ]);
  });

  it("returns empty for empty array", () => {
    expect(groupWith([], () => true)).toEqual([]);
  });

  it("handles single element", () => {
    expect(groupWith([1], () => true)).toEqual([[1]]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] flattened groups equal original array",
    (arr) => {
      const grouped = groupWith(arr, (a, b) => Math.abs(a - b) <= 1);
      const flattened = grouped.flat();
      expect(flattened).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always true predicate creates single group",
    (arr) => {
      const grouped = groupWith(arr, () => true);
      if (arr.length > 0) {
        expect(grouped).toHaveLength(1);
        expect(grouped[0]).toEqual(arr);
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] always false predicate creates individual groups",
    (arr) => {
      const grouped = groupWith(arr, () => false);
      expect(grouped).toHaveLength(arr.length);
      grouped.forEach((group, i) => {
        expect(group).toEqual([arr[i]]);
      });
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 2 })])(
    "[🎲] adjacent elements within group satisfy predicate",
    (arr) => {
      const predicate = (a: number, b: number) => Math.abs(a - b) <= 1;
      const grouped = groupWith(arr, predicate);
      for (const group of grouped) {
        for (let i = 0; i < group.length - 1; i++) {
          expect(predicate(group[i], group[i + 1])).toBe(true);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 2 })])(
    "[🎲] group boundaries do not satisfy predicate",
    (arr) => {
      const predicate = (a: number, b: number) => Math.abs(a - b) <= 1;
      const grouped = groupWith(arr, predicate);
      for (let i = 0; i < grouped.length - 1; i++) {
        const lastOfCurrent = grouped[i][grouped[i].length - 1];
        const firstOfNext = grouped[i + 1][0];
        expect(predicate(lastOfCurrent, firstOfNext)).toBe(false);
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      groupWith(arr, (a, b) => a === b);
      expect(arr).toEqual(original);
    }
  );
});
