import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { countBy } from "./count-by";

describe("countBy", () => {
  describe("array", () => {
    it("counts by iteratee result", () => {
      expect(countBy([1.2, 2.1, 2.4], Math.floor)).toEqual({ 1: 1, 2: 2 });
    });

    it("counts by property", () => {
      const users = [{ active: true }, { active: false }, { active: true }];
      expect(countBy(users, (u) => String(u.active))).toEqual({
        true: 2,
        false: 1,
      });
    });

    it("handles empty array", () => {
      expect(countBy([], () => "key")).toEqual({});
    });

    it("[🎯] keys are always strings", () => {
      const result = countBy([1, 2, 3, 4], (n) => n % 2);
      expect(typeof Object.keys(result)[0]).toBe("string");
      expect(result["1"]).toBe(2);
      expect(result["0"]).toBe(2);
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] sum of all counts equals array length",
    (arr) => {
      const result = countBy(arr, (n) => n % 3);
      const sum = Object.values(result).reduce((a, b) => a + b, 0);
      expect(sum).toBe(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] all counts are positive integers",
    (arr) => {
      const result = countBy(arr, (n) => n % 5);
      Object.values(result).forEach((count) => {
        expect(count).toBeGreaterThan(0);
        expect(Number.isInteger(count)).toBe(true);
      });
    }
  );

  itProp.prop([fc.array(fc.string())])(
    "[🎲] keys correspond to iteratee results",
    (arr) => {
      const result = countBy(arr, (s) => s.length);
      const keys = Object.keys(result);
      const expectedKeys = new Set(arr.map((s) => String(s.length)));
      expect(new Set(keys)).toEqual(expectedKeys);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      countBy(arr, (n) => n);
      expect(arr).toEqual(original);
    }
  );
});
