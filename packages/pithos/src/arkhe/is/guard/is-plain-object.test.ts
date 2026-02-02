import { describe, it, expect } from "vitest";
import { isPlainObject } from "./is-plain-object";

describe("isPlainObject", () => {
  it("should return true for object literals", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
  });

  it("should return true for Object constructor", () => {
    expect(isPlainObject(new Object())).toBe(true);
  });

  it("[🎯] should return true for null-prototype objects", () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("[🎯] should return false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("[🎯] should return false for non-object types", () => {
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
  });

  it("[🎯] should return false for objects with custom prototypes", () => {
    expect(isPlainObject([])).toBe(false);              // Array.prototype
    expect(isPlainObject(new Date())).toBe(false);      // Date.prototype
    expect(isPlainObject(new (class Foo {})())).toBe(false); // Custom prototype
  });
});
