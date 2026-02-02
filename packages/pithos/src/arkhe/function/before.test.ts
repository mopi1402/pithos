import { describe, it, expect } from "vitest";
import { before } from "./before";

describe("before", () => {
  it("invokes func at most n-1 times", () => {
    let count = 0;
    const increment = before(() => ++count, 3);

    expect(increment()).toBe(1);
    expect(increment()).toBe(2);
    expect(increment()).toBe(2);
    expect(increment()).toBe(2);
    expect(count).toBe(2);
  });

  it("returns undefined before first invocation", () => {
    const fn = before(() => 42, 2);
    expect(fn()).toBe(42);
  });

  it("[🎯] never invokes func when n <= 1", () => {
    let called = false;
    const fn = before(() => {
      called = true;
      return 42;
    }, 1);

    expect(fn()).toBeUndefined();
    expect(fn()).toBeUndefined();
    expect(called).toBe(false);
  });

  it("[🎯] handles n = 0", () => {
    let called = false;
    const fn = before(() => {
      called = true;
    }, 0);

    expect(fn()).toBeUndefined();
    expect(called).toBe(false);
  });

  it("[🎯] throws RangeError for negative n", () => {
    expect(() => before(() => { }, -1)).toThrow(RangeError);
    expect(() => before(() => { }, -1)).toThrow("n must be non-negative");
  });

  it("[🎯] throws RangeError for non-integer n", () => {
    expect(() => before(() => { }, 2.5)).toThrow(RangeError);
    expect(() => before(() => { }, 2.5)).toThrow("n must be an integer");
  });

  it("passes arguments to func", () => {
    const fn = before((a: number, b: number) => a + b, 3);
    expect(fn(1, 2)).toBe(3);
    expect(fn(3, 4)).toBe(7);
    expect(fn(5, 6)).toBe(7);
  });

  it("caches last result after limit", () => {
    let callCount = 0;
    const fn = before(() => ++callCount, 3);

    fn();
    fn();
    const lastResult = fn();

    expect(lastResult).toBe(2);
    expect(callCount).toBe(2);
  });
});
