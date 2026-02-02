import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { keyBy } from "./key-by";

describe("keyBy", () => {
  describe("array", () => {
    it("keys by iteratee result", () => {
      const users = [
        { id: "a", name: "alice" },
        { id: "b", name: "bob" },
      ];
      expect(keyBy(users, (u) => u.id)).toEqual({
        a: { id: "a", name: "alice" },
        b: { id: "b", name: "bob" },
      });
    });

    it("last value wins for duplicate keys", () => {
      const items = [
        { type: "a", v: 1 },
        { type: "a", v: 2 },
      ];
      expect(keyBy(items, (i) => i.type)).toEqual({ a: { type: "a", v: 2 } });
    });

    it("handles empty array", () => {
      expect(keyBy([], () => "key")).toEqual({});
    });

    it("[🎯] single element creates object with one key", () => {
      expect(keyBy([{ id: "x", val: 1 }], (x) => x.id)).toEqual({
        x: { id: "x", val: 1 },
      });
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] values length is at most array length",
    (arr) => {
      const result = keyBy(arr, (x) => x % 5);
      expect(Object.values(result).length).toBeLessThanOrEqual(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] keys correspond to iteratee results",
    (arr) => {
      const result = keyBy(arr, (x) => x % 3);
      const keys = Object.keys(result).map(Number);
      const expectedKeys = new Set(arr.map((x) => x % 3));
      expect(new Set(keys)).toEqual(expectedKeys);
    }
  );

  itProp.prop([fc.array(fc.nat({ max: 100 }))])(
    "[🎲] each value produces its key when passed through iteratee",
    (arr) => {
      const iteratee = (x: number) => x % 5;
      const result = keyBy(arr, iteratee);

      for (const [key, value] of Object.entries(result)) {
        expect(iteratee(value as number)).toBe(Number(key));
      }
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      keyBy(arr, (x) => x % 2);
      expect(arr).toEqual(original);
    }
  );
});
