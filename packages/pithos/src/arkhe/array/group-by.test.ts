import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { groupBy } from "./group-by";

describe("groupBy", () => {
  describe("array", () => {
    it("groups by iteratee result", () => {
      const nums = [1.2, 2.1, 2.4];
      expect(groupBy(nums, Math.floor)).toEqual({ 1: [1.2], 2: [2.1, 2.4] });
    });

    it("groups objects by property", () => {
      const users = [
        { age: 30, name: "a" },
        { age: 30, name: "b" },
        { age: 25, name: "c" },
      ];
      expect(groupBy(users, (u) => u.age)).toEqual({
        30: [
          { age: 30, name: "a" },
          { age: 30, name: "b" },
        ],
        25: [{ age: 25, name: "c" }],
      });
    });

    it("handles empty array", () => {
      expect(groupBy([], () => "key")).toEqual({});
    });

    it("[🎯] single element creates one group", () => {
      expect(groupBy([42], (x) => x % 10)).toEqual({ 2: [42] });
    });

    it("[🎯] all same key creates single group with all elements", () => {
      expect(groupBy([1, 2, 3], () => "same")).toEqual({
        same: [1, 2, 3],
      });
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] flattened values equal original array",
    (arr) => {
      const grouped = groupBy(arr, (x) => x % 5);
      const flattened = Object.values(grouped).flat();
      expect(flattened).toHaveLength(arr.length);
      expect(flattened.sort()).toEqual([...arr].sort());
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] keys correspond to iteratee results",
    (arr) => {
      const grouped = groupBy(arr, (x) => x % 3);
      const keys = Object.keys(grouped).map(Number);
      const expectedKeys = new Set(arr.map((x) => x % 3));
      expect(new Set(keys)).toEqual(expectedKeys);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] each element in group has matching key",
    (arr) => {
      const iteratee = (x: number) => x % 3;
      const grouped = groupBy(arr, iteratee);
      for (const [key, group] of Object.entries(grouped)) {
        if (!group) continue;
        for (const el of group) {
          expect(String(iteratee(el))).toBe(key);
        }
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      groupBy(arr, (x) => x % 2);
      expect(arr).toEqual(original);
    }
  );
});
