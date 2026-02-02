import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { nthArg } from "./nthArg";

describe("nthArg", () => {
  it("returns nth argument", () => {
    const fn = nthArg(1);
    expect(fn("a", "b", "c")).toBe("b");
  });

  it("[🎯] handles negative index", () => {
    const fn = nthArg(-1);
    expect(fn("a", "b", "c")).toBe("c");
  });

  it("[🎯] returns undefined for out of bounds", () => {
    const fn = nthArg(5);
    expect(fn("a", "b")).toBeUndefined();
  });

  it("handles zero index", () => {
    const fn = nthArg(0);
    expect(fn("first", "second")).toBe("first");
  });

  itProp.prop([fc.array(fc.anything(), { minLength: 1, maxLength: 10 })])(
    "[🎲] nthArg(0) returns first element",
    (args) => {
      const fn = nthArg(0);
      expect(fn(...args)).toBe(args[0]);
    }
  );

  itProp.prop([fc.array(fc.anything(), { minLength: 1, maxLength: 10 })])(
    "[🎲] nthArg(-1) returns last element",
    (args) => {
      const fn = nthArg(-1);
      expect(fn(...args)).toBe(args[args.length - 1]);
    }
  );
});
