import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isSafeInteger } from "./isSafeInteger";

describe("isSafeInteger", () => {
  it("returns true for safe integers", () => {
    expect(isSafeInteger(42)).toBe(true);
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("[🎯] returns false for unsafe integers", () => {
    expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });

  it("[🎯] returns false for decimals", () => {
    expect(isSafeInteger(3.14)).toBe(false);
  });

  it("[🎯] returns false for non-numbers", () => {
    expect(isSafeInteger("42")).toBe(false);
  });

  itProp.prop([fc.integer({ min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER })])(
    "[🎲] returns true for safe integers",
    (n) => {
      expect(isSafeInteger(n)).toBe(true);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] is equivalent to Number.isSafeInteger",
    (n) => {
      expect(isSafeInteger(n)).toBe(Number.isSafeInteger(n));
    }
  );
});
