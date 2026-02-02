import { describe, it, expect } from "vitest";
import { isObject } from "./is-object";

describe("isObject", () => {
  it("should return true for plain objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
  });

  it("should return true for built-in object types", () => {
    expect(isObject(new Map())).toBe(true);
    expect(isObject(new Date())).toBe(true);
  });

  it("should return true for class instances", () => {
    expect(isObject(new (class Foo {})())).toBe(true);
  });

  it("[🎯] should return false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("[🎯] should return false for arrays", () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it("[🎯] should return false for primitives", () => {
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject("string")).toBe(false);
  });

  it("[🎯] should return false for functions", () => {
    expect(isObject(() => {})).toBe(false);
  });
});
