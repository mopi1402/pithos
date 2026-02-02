import { describe, it, expect } from "vitest";
import { isEmpty } from "./is-empty";

describe("isEmpty", () => {
  it("should return true for null and undefined", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("should check array length", () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  it("should check string length", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("abc")).toBe(false);
  });

  it("should check Map size", () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Map([["a", 1]]))).toBe(false);
  });

  it("should check Set size", () => {
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  it("should check object keys", () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it("should return true for primitives", () => {
    expect(isEmpty(42)).toBe(true);
  });

  it("[🎯] returns true for all primitive types", () => {
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(Symbol("test"))).toBe(true);
    expect(isEmpty(123n)).toBe(true);
  });
});
