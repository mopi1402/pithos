import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isBoolean } from "./is-boolean";

describe("isBoolean", () => {
  it("[🎯] should return true for boolean values", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it("should return false for truthy/falsy non-booleans", () => {
    expect(isBoolean(1)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean("")).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean({})).toBe(false);
  });

  itProp.prop([fc.boolean()])("[🎲] all booleans return true", (bool) => {
    expect(isBoolean(bool)).toBe(true);
  });
});
