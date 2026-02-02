import { describe, it, expect } from "vitest";
import { isPromise } from "./is-promise";

describe("isPromise", () => {
  it("should return true for native Promise instances", () => {
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise(Promise.resolve(42))).toBe(true);
    expect(isPromise(Promise.reject("err").catch(() => {}))).toBe(true);
  });

  it("[🎯] should return true for thenable objects", () => {
    expect(isPromise({ then: () => {} })).toBe(true);
  });

  it("[🎯] should return true for thenable functions", () => {
    const fn = () => {};
    fn.then = () => {};
    expect(isPromise(fn)).toBe(true);
  });

  it("should return false for async functions (not promises themselves)", () => {
    expect(isPromise(async () => {})).toBe(false);
  });

  it("[🎯] should return false for objects with non-function .then", () => {
    expect(isPromise({ then: "not a function" })).toBe(false);
    expect(isPromise({ then: null })).toBe(false);
  });

  it("[🎯] should return false for nullish values", () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
  });

  it("should return false for other types", () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise(() => {})).toBe(false);
  });
});
