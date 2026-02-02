import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNaN } from "./is-nan";

describe("isNaN", () => {
  it("[🎯] should behave identically to Number.isNaN", () => {
    const testValues = [
      NaN,
      Number.NaN,
      0 / 0,
      3,
      "3",
      undefined,
      {},
      null,
      Infinity,
      -Infinity,
    ];

    testValues.forEach((value) => {
      expect(isNaN(value)).toBe(Number.isNaN(value));
    });
  });

  it("[🎯] returns true for NaN", () => {
    expect(isNaN(NaN)).toBe(true);
    expect(isNaN(Number.NaN)).toBe(true);
    expect(isNaN(0 / 0)).toBe(true);
  });

  it("[🎯] returns false for non-NaN values", () => {
    expect(isNaN(undefined)).toBe(false);
    expect(isNaN("NaN")).toBe(false);
    expect(isNaN(Infinity)).toBe(false);
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

  itProp.prop([fc.anything()])(
    "[🎲] is equivalent to Number.isNaN for any value",
    (value) => {
      expect(isNaN(value)).toBe(Number.isNaN(value));
    }
  );
});
