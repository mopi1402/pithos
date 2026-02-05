import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { mapKeys } from "./map-keys";

describe("mapKeys", () => {
  it("transforms keys using function", () => {
    const result = mapKeys({ a: 1, b: 2 }, (_, key) => `prefix_${String(key)}`);
    expect(result).toEqual({ prefix_a: 1, prefix_b: 2 });
  });

  it("receives value and object in transform", () => {
    const result = mapKeys({ a: 1, b: 2 }, (value) => `key_${value}`);
    expect(result).toEqual({ key_1: 1, key_2: 2 });
  });

  it("ignores inherited properties", () => {
    const obj = Object.create({ inherited: "val" });
    obj.own = 1;
    const result = mapKeys(obj, (_, key) => `_${String(key)}`);
    expect(result).toEqual({ _own: 1 });
  });

  it("[🎯] last value wins for duplicate transformed keys", () => {
    const result = mapKeys({ a: 1, b: 2, c: 3 }, () => "same");
    expect(result).toEqual({ same: 3 });
  });

  it("[🎯] ignores symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 1, a: 2 };
    const result = mapKeys(obj, (_, key) =>
      typeof key === "symbol" ? "sym" : `_${String(key)}`
    );
    expect(result).toEqual({ _a: 2 });
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      mapKeys(obj, (_, key) => key);
      expect(obj).toEqual(original);
    }
  );
});
