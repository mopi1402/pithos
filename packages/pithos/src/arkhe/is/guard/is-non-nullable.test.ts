import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNonNullable } from "./is-non-nullable";

describe("isNonNullable", () => {
  it("[🎯] should return false for null", () => {
    expect(isNonNullable(null)).toBe(false);
  });

  it("[🎯] should return false for undefined", () => {
    expect(isNonNullable(undefined)).toBe(false);
  });

  it("should return true for falsy values", () => {
    expect(isNonNullable(0)).toBe(true);
    expect(isNonNullable("")).toBe(true);
    expect(isNonNullable(false)).toBe(true);
    expect(isNonNullable(NaN)).toBe(true);
  });

  it("should return true for truthy values", () => {
    expect(isNonNullable("hello")).toBe(true);
    expect(isNonNullable(42)).toBe(true);
    expect(isNonNullable({})).toBe(true);
  });

  itProp.prop([fc.anything()])("[🎲] only null/undefined return false", (value) => {
    expect(isNonNullable(value)).toBe(value !== null && value !== undefined);
  });
});
