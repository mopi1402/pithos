import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toInteger } from "./toInteger";

describe("toInteger", () => {
  it("truncates decimals", () => {
    expect(toInteger(3.7)).toBe(3);
    expect(toInteger(-3.7)).toBe(-3);
  });

  it("converts strings", () => {
    expect(toInteger("3.7")).toBe(3);
  });

  it("[🎯] returns 0 for NaN", () => {
    expect(toInteger(NaN)).toBe(0);
    expect(toInteger("abc")).toBe(0);
  });

  it("[🎯] preserves Infinity", () => {
    expect(toInteger(Infinity)).toBe(Infinity);
  });

  it("[🎯] preserves 0", () => {
    expect(toInteger(0)).toBe(0);
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns integers unchanged",
    (n) => {
      expect(toInteger(n)).toBe(n);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] truncates towards zero",
    (n) => {
      expect(toInteger(n)).toBe(Math.trunc(n));
    }
  );
});
