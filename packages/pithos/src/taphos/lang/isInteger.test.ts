import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isInteger } from "./isInteger";

describe("isInteger", () => {
  it("returns true for integers", () => {
    expect(isInteger(42)).toBe(true);
    expect(isInteger(42.0)).toBe(true);
    expect(isInteger(-10)).toBe(true);
  });

  it("[🎯] returns false for decimals", () => {
    expect(isInteger(42.5)).toBe(false);
  });

  it("[🎯] returns false for non-numbers", () => {
    expect(isInteger("42")).toBe(false);
    expect(isInteger(null)).toBe(false);
  });

  it("[🎯] returns false for Infinity", () => {
    expect(isInteger(Infinity)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns true for all integers",
    (n) => {
      expect(isInteger(n)).toBe(true);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] is equivalent to Number.isInteger",
    (n) => {
      expect(isInteger(n)).toBe(Number.isInteger(n));
    }
  );
});
