import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isUndefined } from "./is-undefined";

describe("isUndefined", () => {
  it("[🎯] should return true for undefined", () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(void 0)).toBe(true);
  });

  it("[🎯] should return false for null", () => {
    expect(isUndefined(null)).toBe(false);
  });

  it("should return false for falsy non-undefined values", () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined("")).toBe(false);
    expect(isUndefined(false)).toBe(false);
  });

  it("should return false for other types", () => {
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined("undefined")).toBe(false);
  });

  itProp.prop([fc.anything()])("[🎲] only undefined returns true", (value) => {
    expect(isUndefined(value)).toBe(value === undefined);
  });
});
