import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isPrimitive } from "./is-primitive";

describe("isPrimitive", () => {
  it("should return true for each primitive type", () => {
    expect(isPrimitive("string")).toBe(true);    // typeof "string"
    expect(isPrimitive(42)).toBe(true);          // typeof "number"
    expect(isPrimitive(true)).toBe(true);        // typeof "boolean"
    expect(isPrimitive(undefined)).toBe(true);   // typeof "undefined"
    expect(isPrimitive(Symbol())).toBe(true);    // typeof "symbol"
    expect(isPrimitive(42n)).toBe(true);         // typeof "bigint"
  });

  it("[🎯] should return true for null", () => {
    expect(isPrimitive(null)).toBe(true);
  });

  it("[🎯] should return false for objects", () => {
    expect(isPrimitive({})).toBe(false);
  });

  it("[🎯] should return false for functions", () => {
    expect(isPrimitive(() => {})).toBe(false);
  });

  itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
    "[🎲] string, number, boolean are primitives",
    (value) => {
      expect(isPrimitive(value)).toBe(true);
    }
  );
});
