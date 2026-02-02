import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isFinite } from "./is-finite";

describe("isFinite", () => {
  it("[🎯] should behave identically to Number.isFinite", () => {
    const testValues = [
      3,
      Number.MIN_VALUE,
      Infinity,
      -Infinity,
      NaN,
      "3",
      null,
      undefined,
      {},
      [],
    ];

    testValues.forEach((value) => {
      expect(isFinite(value)).toBe(Number.isFinite(value));
    });
  });

  it("[🎯] returns false for Infinity", () => {
    expect(isFinite(Infinity)).toBe(false);
    expect(isFinite(-Infinity)).toBe(false);
  });

  it("[🎯] returns false for NaN", () => {
    expect(isFinite(NaN)).toBe(false);
  });

  it("[🎯] returns true for Number.MIN_VALUE and Number.MAX_VALUE", () => {
    expect(isFinite(Number.MIN_VALUE)).toBe(true);
    expect(isFinite(Number.MAX_VALUE)).toBe(true);
  });

  itProp.prop([fc.integer()])(
    "[🎲] is equivalent to Number.isFinite for integers",
    (n) => {
      expect(isFinite(n)).toBe(Number.isFinite(n));
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] is equivalent to Number.isFinite for finite doubles",
    (n) => {
      expect(isFinite(n)).toBe(Number.isFinite(n));
      expect(isFinite(n)).toBe(true);
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] is equivalent to Number.isFinite for any value",
    (value) => {
      expect(isFinite(value)).toBe(Number.isFinite(value));
    }
  );
});
