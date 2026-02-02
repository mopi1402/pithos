import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unary } from "./unary";

describe("unary", () => {
  it("caps function to one argument", () => {
    const fn = unary((x: unknown) => parseInt(x as string, 10));
    expect(["6", "8", "10"].map(fn)).toEqual([6, 8, 10]);
  });

  it("[🎯] ignores additional arguments", () => {
    const fn = unary((...args: unknown[]) => args.length);
    expect((fn as (...args: unknown[]) => number)("a", "b", "c")).toBe(1);
  });

  it("passes first argument correctly", () => {
    const fn = unary((x: unknown) => x);
    expect(fn("test")).toBe("test");
  });

  it("[🎯] handles undefined argument", () => {
    const fn = unary((x: unknown) => x === undefined);
    expect(fn(undefined)).toBe(true);
  });

  itProp.prop([fc.anything()])(
    "[🎲] always passes exactly one argument",
    (value) => {
      const fn = unary((...args: unknown[]) => args);
      const result = fn(value) as unknown[];
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(value);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] preserves identity for single argument",
    (n) => {
      const fn = unary((x: unknown) => x);
      expect(fn(n)).toBe(n);
    }
  );
});
