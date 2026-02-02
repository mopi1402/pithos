import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isInteger } from "./is-integer";

describe("isInteger", () => {
  it("[🎯] should behave identically to Number.isInteger", () => {
    const testValues = [
      3,
      3.0,
      3.14,
      -3,
      Infinity,
      NaN,
      "3",
      null,
      undefined,
      {},
      [],
    ];

    testValues.forEach((value) => {
      expect(isInteger(value)).toBe(Number.isInteger(value));
    });
  });

  it("[🎯] returns true for integer-valued floats", () => {
    expect(isInteger(3.0)).toBe(true);
    expect(isInteger(-0)).toBe(true);
  });

  it("[🎯] returns false for Infinity", () => {
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
  });

  it("[🎯] returns false for NaN", () => {
    expect(isInteger(NaN)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns true for all integers",
    (n) => {
      expect(isInteger(n)).toBe(true);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] is equivalent to Number.isInteger for doubles",
    (n) => {
      expect(isInteger(n)).toBe(Number.isInteger(n));
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] is equivalent to Number.isInteger for any value",
    (value) => {
      expect(isInteger(value)).toBe(Number.isInteger(value));
    }
  );
});
