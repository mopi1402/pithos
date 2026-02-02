import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { times } from "./times";

describe("times", () => {
  it("returns array of indices without iteratee", () => {
    expect(times(3)).toEqual([0, 1, 2]);
  });

  it("applies iteratee to each index", () => {
    expect(times(3, (i) => i * 2)).toEqual([0, 2, 4]);
  });

  it("returns empty array for n = 0", () => {
    expect(times(0)).toEqual([]);
  });

  it("throws RangeError for negative n", () => {
    expect(() => times(-1)).toThrow(RangeError);
    expect(() => times(-1)).toThrow("n must not be negative");
  });

  it("throws RangeError for non-integer n", () => {
    expect(() => times(2.5)).toThrow(RangeError);
    expect(() => times(2.5)).toThrow("n must be an integer");
  });

  it("handles n = 1", () => {
    expect(times(1)).toEqual([0]);
  });

  it("works with object return type", () => {
    expect(times(2, (i) => ({ id: i }))).toEqual([{ id: 0 }, { id: 1 }]);
  });

  it("[🎯] tests JSDoc example with string template", () => {
    expect(times(3, (index) => `item-${index}`)).toEqual([
      "item-0",
      "item-1",
      "item-2",
    ]);
  });

  it("[🎯] tests JSDoc example with constant return", () => {
    expect(times(3, () => "x")).toEqual(["x", "x", "x"]);
  });

  itProp.prop([fc.integer({ min: 0, max: 100 })])(
    "[🎲] returns array of correct length",
    (n) => {
      expect(times(n)).toHaveLength(n);
    }
  );

  itProp.prop([fc.integer({ min: 0, max: 100 })])(
    "[🎲] indices are sequential from 0",
    (n) => {
      const result = times(n);
      result.forEach((val, idx) => {
        expect(val).toBe(idx);
      });
    }
  );

  itProp.prop([fc.integer({ min: 0, max: 100 }), fc.func(fc.integer())])(
    "[🎲] iteratee is called n times with correct indices",
    (n, fn) => {
      const calls: number[] = [];
      times(n, (i) => {
        calls.push(i);
        return fn(i);
      });
      expect(calls).toHaveLength(n);
      expect(calls).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  );
});
