import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { invert } from "./invert";

describe("invert", () => {
  it("swaps keys and values", () => {
    expect(invert({ a: "x", b: "y" })).toEqual({ x: "a", y: "b" });
  });

  it("works with number values", () => {
    expect(invert({ a: 1, b: 2 })).toEqual({ 1: "a", 2: "b" });
  });

  it("later values overwrite earlier for duplicate values", () => {
    expect(invert({ a: "x", b: "x" })).toEqual({ x: "b" });
  });

  it("ignores inherited properties", () => {
    const obj = Object.create({ inherited: "val" });
    obj.own = "ownVal";
    expect(invert(obj)).toEqual({ ownVal: "own" });
  });

  it("[🎯] handles symbol keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value", a: "x" };
    const result = invert(obj);
    expect(result).toEqual({ value: sym, x: "a" });
  });

  itProp.prop([fc.dictionary(fc.string(), fc.string())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      invert(obj);
      expect(obj).toEqual(original);
    }
  );
});
