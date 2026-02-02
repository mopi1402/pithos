import { describe, it, expect } from "vitest";
import { pullAllWith } from "./pullAllWith";

describe("pullAllWith", () => {
  it("removes values using comparator function", () => {
    const array = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ];
    const result = pullAllWith(
      array,
      [{ x: 3, y: 4 }],
      (a, b) => a.x === b.x && a.y === b.y
    );
    expect(result).toEqual([
      { x: 1, y: 2 },
      { x: 5, y: 6 },
    ]);
  });

  it("removes all matching occurrences", () => {
    const array = [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 1, y: 2 },
    ];
    const result = pullAllWith(
      array,
      [{ x: 1, y: 2 }],
      (a, b) => a.x === b.x && a.y === b.y
    );
    expect(result).toEqual([{ x: 3, y: 4 }]);
  });

  it("handles partial matching with custom comparator", () => {
    const array = [
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
    ];
    const result = pullAllWith(array, [{ x: 1, y: 0 }], (a, b) => a.x === b.x);
    expect(result).toEqual([{ x: 2, y: 2 }]);
  });

  it("handles empty values array", () => {
    const array = [{ x: 1 }, { x: 2 }];
    expect(pullAllWith(array, [], (a, b) => a.x === b.x)).toEqual([
      { x: 1 },
      { x: 2 },
    ]);
  });

  it("[🎯] handles empty array", () => {
    const array: { x: number }[] = [];
    expect(pullAllWith(array, [{ x: 1 }], (a, b) => a.x === b.x)).toEqual([]);
  });

  it("mutates original array", () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
    pullAllWith(array, [{ x: 2 }], (a, b) => a.x === b.x);
    expect(array).toEqual([{ x: 1 }, { x: 3 }]);
  });

  it("returns the mutated array reference", () => {
    const array = [{ x: 1 }, { x: 2 }];
    const result = pullAllWith(array, [{ x: 1 }], (a, b) => a.x === b.x);
    expect(result).toBe(array);
  });
});
