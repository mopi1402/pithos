import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { omit } from "./omit";

describe("omit", () => {
  it("removes specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ["a", "c"])).toEqual({ b: 2 });
  });

  it("returns copy when keys array is empty", () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, []);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).not.toBe(obj);
  });

  it("ignores keys not present in object", () => {
    const obj = { a: 1 } as { a: number; b?: number };
    expect(omit(obj, ["b"])).toEqual({ a: 1 });
  });

  it("handles numeric keys", () => {
    const obj = { 1: "a", 2: "b", 3: "c" };
    expect(omit(obj, [1, 3])).toEqual({ 2: "b" });
  });

  it("handles symbol keys", () => {
    const s1 = Symbol("s1");
    const s2 = Symbol("s2");
    const obj = { [s1]: 1, [s2]: 2, a: 3 };
    expect(omit(obj, [s1])).toEqual({ [s2]: 2, a: 3 });
  });

  it("does not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    omit(obj, ["a"]);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("preserves prototype chain for values (shallow copy)", () => {
    const nested = { x: 1 };
    const obj = { a: nested, b: 2 };
    const result = omit(obj, ["b"]);
    expect(result.a).toBe(nested);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] omitting empty array returns copy",
    (obj) => {
      const result = omit(obj, []);
      expect(result).toEqual(obj);
      expect(result).not.toBe(obj);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      const keys = Object.keys(obj).slice(0, 1);
      omit(obj, keys);
      expect(obj).toEqual(original);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] result has fewer or equal keys",
    (obj) => {
      const keys = Object.keys(obj);
      const result = omit(obj, keys.slice(0, Math.floor(keys.length / 2)));
      expect(Object.keys(result).length).toBeLessThanOrEqual(
        Object.keys(obj).length
      );
    }
  );
});
