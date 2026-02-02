import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toSafeInteger } from "./toSafeInteger";

describe("toSafeInteger", () => {
  it("truncates decimals", () => {
    expect(toSafeInteger(3.7)).toBe(3);
  });

  it("[🎯] clamps Infinity to MAX_SAFE_INTEGER", () => {
    expect(toSafeInteger(Infinity)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("[🎯] clamps -Infinity to MIN_SAFE_INTEGER", () => {
    expect(toSafeInteger(-Infinity)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it("[🎯] returns 0 for NaN", () => {
    expect(toSafeInteger(NaN)).toBe(0);
  });

  it("[🎯] clamps large numbers", () => {
    expect(toSafeInteger(Number.MAX_VALUE)).toBe(Number.MAX_SAFE_INTEGER);
  });

  itProp.prop([fc.integer({ min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER })])(
    "[🎲] returns safe integers unchanged",
    (n) => {
      expect(toSafeInteger(n)).toBe(n);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] result is always a safe integer",
    (n) => {
      const result = toSafeInteger(n);
      expect(Number.isSafeInteger(result)).toBe(true);
    }
  );
});
