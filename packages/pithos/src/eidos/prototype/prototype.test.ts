import { describe, it, expect } from "vitest";
import { deepClone, deepCloneFull } from "./prototype";

describe("Prototype Pattern (re-exports from Arkhe)", () => {
  describe("deepClone", () => {
    it("creates deep copy of nested objects", () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    it("handles circular references", () => {
      const original: Record<string, unknown> = { a: 1 };
      original.self = original;

      const cloned = deepClone(original);

      expect(cloned.self).toBe(cloned);
      expect(cloned.self).not.toBe(original);
    });

    it("clones Date, Map, Set", () => {
      const original = {
        date: new Date("2024-01-01"),
        map: new Map([["x", 1]]),
        set: new Set([1, 2, 3]),
      };

      const cloned = deepClone(original);

      expect(cloned.date).toEqual(original.date);
      expect(cloned.date).not.toBe(original.date);
      expect(cloned.map.get("x")).toBe(1);
      expect(cloned.set.has(2)).toBe(true);
    });
  });

  describe("deepCloneFull", () => {
    it("clones TypedArrays", () => {
      const original = { data: new Uint8Array([1, 2, 3]) };
      const cloned = deepCloneFull(original);

      expect(cloned.data).toEqual(original.data);
      expect(cloned.data).not.toBe(original.data);
    });
  });

  describe("idiomatic usage", () => {
    it("spread for shallow immutable updates", () => {
      const user = { name: "Alice", age: 30 };
      const updated = { ...user, age: 31 };

      expect(updated.age).toBe(31);
      expect(user.age).toBe(30);
    });

    it("deepClone when you need independent nested copies", () => {
      const state = {
        users: [{ name: "Alice" }, { name: "Bob" }],
        settings: { theme: "dark" },
      };

      const snapshot = deepClone(state);
      state.users.push({ name: "Charlie" });

      expect(snapshot.users).toHaveLength(2);
      expect(state.users).toHaveLength(3);
    });
  });
});
