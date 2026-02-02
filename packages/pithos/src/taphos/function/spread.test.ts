import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { spread } from "./spread";

describe("spread", () => {
  it("spreads array arguments over function", () => {
    const fn = spread((a: unknown, b: unknown) => `${a} says ${b}`);
    expect(fn(["fred", "hello"])).toBe("fred says hello");
  });

  it("respects custom start index", () => {
    const fn = spread((a: unknown, b: unknown, c: unknown) => [a, b, c], 1);
    expect(fn(["first", "second", "third"])).toEqual(["first", "second", "third"]);
  });

  it("[👾] leadingArgs are passed before spread args", () => {
    // With start=2, first 2 elements are leading args, rest are spread
    // leadingArgs = ["a", "b"], spreadArgs = ["c", "d"]
    // func receives: "a", "b", "c", "d"
    const fn = spread((...args: unknown[]) => args, 2);
    expect(fn(["a", "b", "c", "d"])).toEqual(["a", "b", "c", "d"]);
  });

  it("[🎯] handles empty array", () => {
    const fn = spread((...args: unknown[]) => args.length);
    expect(fn([])).toBe(0);
  });

  it("[🎯] handles single element array", () => {
    const fn = spread((a: unknown) => a);
    expect(fn(["only"])).toBe("only");
  });

  itProp.prop([fc.array(fc.integer(), { minLength: 0, maxLength: 10 })])(
    "[🎲] spreads array into function arguments",
    (arr) => {
      const fn = spread((...args: unknown[]) => args);
      expect(fn(arr)).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 2, maxLength: 10 })])(
    "[🎲] sum of spread equals sum of array",
    (arr) => {
      const fn = spread((...args: unknown[]) => (args as number[]).reduce((a, b) => a + b, 0));
      const expected = arr.reduce((a, b) => a + b, 0);
      expect(fn(arr)).toBe(expected);
    }
  );
});
