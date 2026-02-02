import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { sample } from "./sample";

describe("sample", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("array", () => {
    it("returns element from array", () => {
      vi.mocked(Math.random).mockReturnValue(0.5);
      expect(sample([1, 2, 3])).toBe(2);
    });

    it("returns first element when random is 0", () => {
      vi.mocked(Math.random).mockReturnValue(0);
      expect(sample([1, 2, 3])).toBe(1);
    });

    it("returns last element when random is ~1", () => {
      vi.mocked(Math.random).mockReturnValue(0.99);
      expect(sample([1, 2, 3])).toBe(3);
    });

    it("returns undefined for empty array", () => {
      expect(sample([])).toBeUndefined();
    });

    it("[🎯] returns the only element for single element array", () => {
      expect(sample([42])).toBe(42);
    });

    itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
      "[🎲] result is in the array",
      (arr) => {
        const result = sample(arr);
        expect(arr).toContain(result);
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] result is undefined for empty array",
      (arr) => {
        if (arr.length === 0) {
          expect(sample(arr)).toBeUndefined();
        }
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] does not mutate original array",
      (arr) => {
        const original = [...arr];
        sample(arr);
        expect(arr).toEqual(original);
      }
    );
  });
});
