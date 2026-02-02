import { describe, it, expect } from "vitest";
import { pullAllBy } from "./pullAllBy";

describe("pullAllBy", () => {
  it("removes values using iteratee function", () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
    expect(pullAllBy(array, [{ x: 1 }, { x: 3 }], (o) => o.x)).toEqual([
      { x: 2 },
    ]);
  });

  it("removes values using property key", () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
    expect(pullAllBy(array, [{ x: 2 }], "x")).toEqual([{ x: 1 }, { x: 3 }]);
  });

  it("removes all matching occurrences", () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 1 }];
    expect(pullAllBy(array, [{ x: 1 }], "x")).toEqual([{ x: 2 }]);
  });

  it("handles empty values array", () => {
    const array = [{ x: 1 }, { x: 2 }];
    expect(pullAllBy(array, [], "x")).toEqual([{ x: 1 }, { x: 2 }]);
  });

  it("[🎯] handles empty array", () => {
    const array: { x: number }[] = [];
    expect(pullAllBy(array, [{ x: 1 }], "x")).toEqual([]);
  });

  it("[🎯] returns the mutated array reference", () => {
    const array = [{ x: 1 }, { x: 2 }];
    const result = pullAllBy(array, [{ x: 1 }], "x");
    expect(result).toBe(array);
  });

  it("[🎯] mutates original array", () => {
    const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
    pullAllBy(array, [{ x: 2 }], "x");
    expect(array).toEqual([{ x: 1 }, { x: 3 }]);
  });
});
