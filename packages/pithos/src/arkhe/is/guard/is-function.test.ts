import { describe, it, expect } from "vitest";
import { isFunction } from "./is-function";

describe("isFunction", () => {
  it("should return true for functions", () => {
    expect(isFunction(() => {})).toBe(true);
  });

  it("[🎯] should return true for async functions and classes", () => {
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
  });

  it("[🎯] should return false for non-functions", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction("function")).toBe(false);
  });
});
