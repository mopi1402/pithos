import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pickBy } from "./pickBy";

describe("pickBy", () => {
  it("picks entries matching predicate", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pickBy(obj, (v) => v > 1)).toEqual({ b: 2, c: 3 });
  });

  it("returns empty object when no entries match", () => {
    const obj = { a: 1, b: 2 };
    expect(pickBy(obj, () => false)).toEqual({});
  });

  it("returns all entries when all match", () => {
    const obj = { a: 1, b: 2 };
    expect(pickBy(obj, () => true)).toEqual({ a: 1, b: 2 });
  });

  it("provides key to predicate", () => {
    const obj = { foo: 1, bar: 2, baz: 3 };
    expect(pickBy(obj, (_, k) => k.startsWith("ba"))).toEqual({
      bar: 2,
      baz: 3,
    });
  });

  it("provides object to predicate", () => {
    const obj = { a: 1, b: 2 };
    expect(pickBy(obj, (v, _, o) => v === o.a)).toEqual({ a: 1 });
  });

  it("excludes inherited properties", () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto) as { inherited: number; own: number };
    obj.own = 2;
    expect(pickBy(obj, () => true)).toEqual({ own: 2 });
  });

  it("does not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    pickBy(obj, (v) => v > 1);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it("preserves reference for nested values", () => {
    const nested = { x: 1 };
    const obj = { a: nested, b: null };
    const result = pickBy(obj, (v) => v !== null);
    expect(result.a).toBe(nested);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      pickBy(obj, (v) => v > 0);
      expect(obj).toEqual(original);
    }
  );
});
