import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { defaults } from "./defaults";

describe("defaults", () => {
  it("fills in undefined properties from source", () => {
    expect(defaults({ a: 1 }, { a: 2, b: 3 })).toEqual({ a: 1, b: 3 });
  });

  it("does not override existing properties", () => {
    expect(defaults({ a: 1, b: 2 }, { a: 99, b: 99 })).toEqual({ a: 1, b: 2 });
  });

  it("applies multiple sources in order", () => {
    expect(defaults({ a: 1 }, { b: 2 }, { b: 3, c: 4 })).toEqual({
      a: 1,
      b: 2,
      c: 4,
    });
  });

  it("fills undefined values but not null", () => {
    expect(defaults({ a: undefined, b: null }, { a: 1, b: 2 })).toEqual({
      a: 1,
      b: null,
    });
  });

  it("ignores inherited properties", () => {
    const source = Object.create({ inherited: "ignored" });
    source.own = "included";
    expect(defaults({}, source)).toEqual({ own: "included" });
  });

  itProp.prop([
    fc.dictionary(fc.string(), fc.integer()),
    fc.dictionary(fc.string(), fc.integer()),
  ])("[🎲] does not mutate target object", (target, source) => {
    const original = { ...target };
    defaults(target, source);
    expect(target).toEqual(original);
  });
});
