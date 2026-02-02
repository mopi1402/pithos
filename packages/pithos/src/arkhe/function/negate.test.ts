import { describe, it, expect } from "vitest";
import { negate } from "./negate";

describe("negate", () => {
  it("negates the result of predicate", () => {
    const isEven = (n: number) => n % 2 === 0;
    const isOdd = negate(isEven);

    expect(isOdd(1)).toBe(true);
    expect(isOdd(2)).toBe(false);
  });

  it("works with array filter", () => {
    const isEven = (n: number) => n % 2 === 0;
    const result = [1, 2, 3, 4, 5].filter(negate(isEven));

    expect(result).toEqual([1, 3, 5]);
  });

  it("handles multiple arguments", () => {
    const includes = (arr: number[], val: number) => arr.includes(val);
    const excludes = negate(includes);

    expect(excludes([1, 2, 3], 4)).toBe(true);
    expect(excludes([1, 2, 3], 2)).toBe(false);
  });

  it("[🎯] handles truthy/falsy values", () => {
    const identity = (x: unknown) => x;
    const isFalsy = negate(identity);

    expect(isFalsy(0)).toBe(true);
    expect(isFalsy("")).toBe(true);
    expect(isFalsy(null)).toBe(true);
    expect(isFalsy(undefined)).toBe(true);
    expect(isFalsy(1)).toBe(false);
    expect(isFalsy("hello")).toBe(false);
  });

  it("returns boolean even when predicate returns non-boolean", () => {
    const returnNumber = () => 42;
    const negated = negate(returnNumber);

    expect(negated()).toBe(false);
    expect(typeof negated()).toBe("boolean");
  });

  it("handles no arguments", () => {
    const alwaysTrue = () => true;
    const alwaysFalse = negate(alwaysTrue);

    expect(alwaysFalse()).toBe(false);
  });
});
