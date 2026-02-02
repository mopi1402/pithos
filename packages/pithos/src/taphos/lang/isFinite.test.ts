import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isFinite } from "./isFinite";

describe("isFinite", () => {
  it("returns true for finite numbers", () => {
    expect(isFinite(42)).toBe(true);
    expect(isFinite(3.14)).toBe(true);
    expect(isFinite(-100)).toBe(true);
  });

  it("[🎯] returns false for Infinity", () => {
    expect(isFinite(Infinity)).toBe(false);
    expect(isFinite(-Infinity)).toBe(false);
  });

  it("[🎯] returns false for NaN", () => {
    expect(isFinite(NaN)).toBe(false);
  });

  it("[🎯] returns false for non-numbers", () => {
    expect(isFinite("42")).toBe(false);
    expect(isFinite(null)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns true for all integers",
    (n) => {
      expect(isFinite(n)).toBe(true);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] returns true for finite doubles",
    (n) => {
      expect(isFinite(n)).toBe(true);
    }
  );
});
