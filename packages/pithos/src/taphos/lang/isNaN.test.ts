import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNaN } from "./isNaN";

describe("isNaN", () => {
  it("[🎯] returns true for NaN", () => {
    expect(isNaN(NaN)).toBe(true);
  });

  it("[🎯] returns false for undefined", () => {
    expect(isNaN(undefined)).toBe(false);
  });

  it("[🎯] returns false for string NaN", () => {
    expect(isNaN("NaN")).toBe(false);
  });

  it("returns false for numbers", () => {
    expect(isNaN(42)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns false for all integers",
    (n) => {
      expect(isNaN(n)).toBe(false);
    }
  );

  itProp.prop([fc.double({ noNaN: true })])(
    "[🎲] returns false for non-NaN doubles",
    (n) => {
      expect(isNaN(n)).toBe(false);
    }
  );
});
