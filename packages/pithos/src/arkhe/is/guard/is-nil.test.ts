import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNil } from "./is-nil";

describe("isNil", () => {
  it("[🎯] should return true for null", () => {
    expect(isNil(null)).toBe(true);
  });

  it("[🎯] should return true for undefined", () => {
    expect(isNil(undefined)).toBe(true);
  });

  it("should return false for falsy values", () => {
    expect(isNil(0)).toBe(false);
    expect(isNil("")).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil(NaN)).toBe(false);
  });

  it("should return false for truthy values", () => {
    expect(isNil("hello")).toBe(false);
    expect(isNil(42)).toBe(false);
    expect(isNil({})).toBe(false);
  });

  itProp.prop([fc.anything()])("[🎲] only null/undefined return true", (value) => {
    expect(isNil(value)).toBe(value === null || value === undefined);
  });
});
