import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { rangeRight } from "./rangeRight";

describe("rangeRight", () => {
  it("creates reversed range with single argument", () => {
    expect(rangeRight(4)).toEqual([3, 2, 1, 0]);
  });

  it("creates reversed range with start and end", () => {
    expect(rangeRight(1, 5)).toEqual([4, 3, 2, 1]);
  });

  it("creates reversed range with step", () => {
    expect(rangeRight(0, 20, 5)).toEqual([15, 10, 5, 0]);
  });

  it("[🎯] handles empty range", () => {
    expect(rangeRight(0)).toEqual([]);
  });

  it("[🎯] handles single element range", () => {
    expect(rangeRight(1)).toEqual([0]);
  });

  itProp.prop([fc.integer({ min: 0, max: 100 })])(
    "[🎲] rangeRight(n) has length n",
    (n) => {
      expect(rangeRight(n)).toHaveLength(n);
    }
  );

  itProp.prop([fc.integer({ min: 1, max: 50 })])(
    "[🎲] rangeRight(n) first element is n-1",
    (n) => {
      const result = rangeRight(n);
      expect(result[0]).toBe(n - 1);
    }
  );

  itProp.prop([fc.integer({ min: 1, max: 50 })])(
    "[🎲] rangeRight(n) last element is 0",
    (n) => {
      const result = rangeRight(n);
      expect(result[result.length - 1]).toBe(0);
    }
  );
});
