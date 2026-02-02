import { describe, it, expect } from "vitest";
import { isRegExp } from "./is-regexp";

describe("isRegExp", () => {
  it("should return true for RegExp instances", () => {
    expect(isRegExp(/abc/)).toBe(true);
    expect(isRegExp(new RegExp("abc"))).toBe(true);
  });

  it("[🎯] should return false for non-RegExp values", () => {
    expect(isRegExp(null)).toBe(false);
    expect(isRegExp(undefined)).toBe(false);
    expect(isRegExp("/abc/")).toBe(false);
    expect(isRegExp({ source: "abc", flags: "gi" })).toBe(false);
  });
});
