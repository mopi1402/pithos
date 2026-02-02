import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { omitBy } from "./omit-by";

describe("omitBy", () => {
  it("omits properties where predicate returns true", () => {
    const obj = { a: 1, b: "2", c: 3 };
    expect(omitBy(obj, (value) => typeof value === "number")).toEqual({
      b: "2",
    });
  });

  it("removes null/undefined values", () => {
    const obj = { a: 1, b: null, c: undefined, d: 4 };
    expect(omitBy(obj, (v) => v == null)).toEqual({ a: 1, d: 4 });
  });

  it("removes empty strings", () => {
    const obj = { name: "John", email: "", phone: "123" };
    expect(omitBy(obj, (v) => v === "")).toEqual({
      name: "John",
      phone: "123",
    });
  });

  it("returns empty object when all properties match", () => {
    expect(omitBy({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  it("returns copy when no properties match", () => {
    const obj = { a: 1, b: 2 };
    expect(omitBy(obj, () => false)).toEqual({ a: 1, b: 2 });
  });

  it("returns empty object for empty input", () => {
    expect(omitBy({}, () => true)).toEqual({});
  });

  it("passes value and key to predicate", () => {
    const calls: Array<[unknown, string]> = [];
    omitBy({ a: 1, b: 2 }, (value, key) => {
      calls.push([value, key]);
      return false;
    });

    expect(calls).toContainEqual([1, "a"]);
    expect(calls).toContainEqual([2, "b"]);
  });

  it("does not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    const original = { ...obj };
    omitBy(obj, (v) => v === 1);
    expect(obj).toEqual(original);
  });

  it("only iterates own properties", () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto);
    obj.own = 2;

    const result = omitBy(obj, () => false);
    expect(result).toEqual({ own: 2 });
    expect(result).not.toHaveProperty("inherited");
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      omitBy(obj, (v) => v > 0);
      expect(obj).toEqual(original);
    }
  );
});
