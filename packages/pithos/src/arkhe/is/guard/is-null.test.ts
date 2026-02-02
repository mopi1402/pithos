import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNull } from "./is-null";

describe("isNull", () => {
  it("[🎯] should return true for null", () => {
    expect(isNull(null)).toBe(true);
  });

  it("[🎯] should return false for undefined", () => {
    expect(isNull(undefined)).toBe(false);
  });

  it("should return false for falsy values", () => {
    expect(isNull(0)).toBe(false);
    expect(isNull("")).toBe(false);
    expect(isNull(false)).toBe(false);
  });

  it("should return false for objects", () => {
    expect(isNull({})).toBe(false);
  });

  itProp.prop([fc.anything()])("[🎲] only null returns true", (value) => {
    expect(isNull(value)).toBe(value === null);
  });
});
