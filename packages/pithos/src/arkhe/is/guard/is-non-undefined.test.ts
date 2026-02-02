import { describe, it, expect } from "vitest";
import { isNonUndefined } from "./is-non-undefined";

describe("isNonUndefined", () => {
  it("[🎯] should return false for undefined", () => {
    expect(isNonUndefined(undefined)).toBe(false);
  });

  it("[🎯] should return true for null (only checks undefined)", () => {
    expect(isNonUndefined(null)).toBe(true);
  });

  it("should return true for defined values", () => {
    expect(isNonUndefined(0)).toBe(true);
  });
});
