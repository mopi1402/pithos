import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isString } from "./is-string";

describe("isString", () => {
  it("should return true for string primitives", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString(String(123))).toBe(true);
    expect(isString(`template`)).toBe(true);
  });

  it("[🎯] should return false for String objects", () => {
    expect(isString(new String("hello"))).toBe(false);
  });

  it("should return false for string-like values", () => {
    expect(isString(123)).toBe(false);
    expect(isString(["h", "e", "l", "l", "o"])).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(true)).toBe(false);
  });

  itProp.prop([fc.string()])("[🎲] all strings return true", (str) => {
    expect(isString(str)).toBe(true);
  });
});
