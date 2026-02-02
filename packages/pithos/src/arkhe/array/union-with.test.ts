import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unionWith } from "./union-with";

describe("unionWith", () => {
  it("creates unique array using comparator", () => {
    const arrays = [
      [
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ],
      [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    ];
    const result = unionWith(arrays, (a, b) => a.x === b.x && a.y === b.y);
    expect(result).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 4 },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(unionWith([], () => true)).toEqual([]);
  });

  it("handles single array", () => {
    const arrays = [[{ id: 1 }, { id: 2 }, { id: 1 }]];
    const result = unionWith(arrays, (a, b) => a.id === b.id);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("preserves first occurrence order", () => {
    const arrays = [
      [1, 2],
      [2, 3],
    ];
    const result = unionWith(arrays, (a, b) => a === b);
    expect(result).toEqual([1, 2, 3]);
  });

  it("handles case-insensitive string comparison", () => {
    const arrays = [
      ["A", "b"],
      ["a", "C"],
    ];
    const result = unionWith(
      arrays,
      (a, b) => a.toLowerCase() === b.toLowerCase()
    );
    expect(result).toEqual(["A", "b", "C"]);
  });

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] result length is at most sum of all lengths",
    (arrays) => {
      const result = unionWith(arrays, (a, b) => a === b);
      const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
      expect(result.length).toBeLessThanOrEqual(totalLength);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] union with itself using equality is deduplicated",
    (arr) => {
      const result = unionWith([arr, arr], (a, b) => a === b);
      const unique = [...new Set(arr)];
      expect(result.sort()).toEqual(unique.sort());
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()), { minLength: 1 })])(
    "[🎲] every result element comes from one of the input arrays",
    (arrays) => {
      const result = unionWith(arrays, (a, b) => a === b);
      const allElements = arrays.flat();
      result.forEach((item) => {
        expect(allElements).toContain(item);
      });
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] no duplicates according to comparator in result",
    (arrays) => {
      const comparator = (a: number, b: number) => a % 5 === b % 5;
      const result = unionWith(arrays, comparator);

      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          expect(comparator(result[i], result[j])).toBe(false);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.array(fc.integer()))])(
    "[🎲] does not mutate original arrays",
    (arrays) => {
      const originals = arrays.map((arr) => [...arr]);
      unionWith(arrays, (a, b) => a === b);
      arrays.forEach((arr, i) => {
        expect(arr).toEqual(originals[i]);
      });
    }
  );
});
