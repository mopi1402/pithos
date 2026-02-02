import { describe, it, expect } from "vitest";
import { curry } from "./curry";

describe("curry", () => {
  it("curries a function with multiple arguments", () => {
    const add = (a: number, b: number, c: number) => a + b + c;
    const curriedAdd = curry(add);

    expect(curriedAdd(1)(2)(3)).toBe(6);
  });

  it("supports partial application", () => {
    const add = (a: number, b: number, c: number) => a + b + c;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const curriedAdd = curry(add) as any;

    expect(curriedAdd(1, 2)(3)).toBe(6);
    expect(curriedAdd(1)(2, 3)).toBe(6);
    expect(curriedAdd(1, 2, 3)).toBe(6);
  });

  it("handles custom arity", () => {
    const fn = (...args: number[]) => args.reduce((a, b) => a + b, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const curried = curry(fn, 3) as any;

    expect(curried(1)(2)(3)).toBe(6);
  });

  it("[🎯] handles zero arity", () => {
    const fn = () => 42;
    const curried = curry(fn, 0);

    expect(curried()).toBe(42);
  });

  it("[🎯] throws RangeError for negative arity", () => {
    expect(() => curry(() => {}, -1)).toThrow(RangeError);
    expect(() => curry(() => {}, -1)).toThrow("arity must be non-negative");
  });

  it("[🎯] throws RangeError for non-integer arity", () => {
    expect(() => curry(() => {}, 2.5)).toThrow(RangeError);
    expect(() => curry(() => {}, 2.5)).toThrow("arity must be an integer");
  });

  it("uses func.length as default arity", () => {
    const fn = (a: number, b: number) => a + b;
    const curried = curry(fn);

    expect(curried(1)(2)).toBe(3);
  });

  it("handles single argument function", () => {
    const double = (x: number) => x * 2;
    const curried = curry(double);

    expect(curried(5)).toBe(10);
  });

  it("preserves this context", () => {
    const obj = {
      multiplier: 2,
      multiply(a: number, b: number) {
        return (a + b) * this.multiplier;
      },
    };

    const curried = curry(obj.multiply.bind(obj));
    expect(curried(3)(4)).toBe(14);
  });
});
