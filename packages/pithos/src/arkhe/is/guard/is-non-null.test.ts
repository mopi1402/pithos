import { describe, it, expect } from "vitest";
import { isNonNull } from "./is-non-null";

describe("isNonNull", () => {
  it("[🎯] should return false for null", () => {
    expect(isNonNull(null)).toBe(false);
  });

  it("[🎯] should return true for undefined", () => {
    expect(isNonNull(undefined)).toBe(true);
  });

  it("should return true for falsy values", () => {
    expect(isNonNull(0)).toBe(true);
    expect(isNonNull("")).toBe(true);
    expect(isNonNull(false)).toBe(true);
  });

  it("should return true for truthy values", () => {
    expect(isNonNull("hello")).toBe(true);
    expect(isNonNull({})).toBe(true);
  });
});
