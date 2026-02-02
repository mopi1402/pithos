import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { rest } from "./rest";

describe("rest", () => {
  it("collects rest arguments into array", () => {
    const fn = rest((what: unknown, names: unknown) => `${what} ${(names as string[]).join(", ")}`);
    expect(fn("hello", "fred", "barney")).toBe("hello fred, barney");
  });

  it("uses func.length - 1 as default start", () => {
    const fn = rest((_a: unknown, _b: unknown, rest: unknown) => rest);
    expect(fn(1, 2, 3, 4)).toEqual([3, 4]);
  });

  it("respects custom start index", () => {
    const fn = rest((args: unknown) => args, 0);
    expect(fn("a", "b", "c")).toEqual(["a", "b", "c"]);
  });

  it("[👾] uses explicit start over func.length - 1", () => {
    // Function has 3 params, so default start would be 2
    // But we explicitly set start=1, so rest should start at index 1
    const fn = rest((a: unknown, rest: unknown, _unused: unknown) => [a, rest], 1);
    expect(fn("first", "second", "third")).toEqual(["first", ["second", "third"]]);
  });

  it("[🎯] handles no rest arguments", () => {
    const fn = rest((a: unknown, rest: unknown) => [a, rest]);
    expect(fn("only")).toEqual(["only", []]);
  });

  it("[🎯] handles start index of 0", () => {
    const fn = rest((args: unknown) => args, 0);
    expect(fn()).toEqual([]);
  });

  itProp.prop([fc.array(fc.string(), { minLength: 1, maxLength: 10 })])(
    "[🎲] collects all args after start into array",
    (args) => {
      const fn = rest((first: unknown, rest: unknown) => ({ first, rest }), 1);
      const result = fn(...args) as { first: unknown; rest: unknown };
      expect(result.first).toBe(args[0]);
      expect(result.rest).toEqual(args.slice(1));
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 0, maxLength: 10 })])(
    "[🎲] with start=0 collects all arguments",
    (args) => {
      const fn = rest((collected: unknown) => collected, 0);
      expect(fn(...args)).toEqual(args);
    }
  );
});
