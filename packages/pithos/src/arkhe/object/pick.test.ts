import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pick } from "./pick";

describe("pick", () => {
  it("picks specified keys", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("returns empty object when keys array is empty", () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, [])).toEqual({});
  });

  it("ignores keys not present in object", () => {
    const obj = { a: 1 } as { a: number; b?: number };
    expect(pick(obj, ["a", "b"])).toEqual({ a: 1 });
  });

  it("handles numeric keys", () => {
    const obj = { 1: "a", 2: "b", 3: "c" };
    expect(pick(obj, [1, 3])).toEqual({ 1: "a", 3: "c" });
  });

  it("handles symbol keys", () => {
    const s1 = Symbol("s1");
    const s2 = Symbol("s2");
    const obj = { [s1]: 1, [s2]: 2, a: 3 };
    expect(pick(obj, [s1, "a"])).toEqual({ [s1]: 1, a: 3 });
  });

  it("does not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    pick(obj, ["a"]);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("preserves reference for nested values (shallow copy)", () => {
    const nested = { x: 1 };
    const obj = { a: nested, b: 2 };
    const result = pick(obj, ["a"]);
    expect(result.a).toBe(nested);
  });

  it("excludes inherited properties", () => {
    const proto = { inherited: "value" };
    const obj = Object.create(proto) as { inherited: string; own: number };
    obj.own = 1;
    expect(pick(obj, ["inherited", "own"])).toEqual({ own: 1 });
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] picking empty array returns empty object",
    (obj) => {
      const result = pick(obj, []);
      expect(result).toEqual({});
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      const keys = Object.keys(obj).slice(0, 1);
      pick(obj, keys);
      expect(obj).toEqual(original);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] result has fewer or equal keys",
    (obj) => {
      const keys = Object.keys(obj);
      const result = pick(obj, keys);
      expect(Object.keys(result).length).toBeLessThanOrEqual(
        Object.keys(obj).length
      );
    }
  );
});
