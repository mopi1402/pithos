import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { round } from "./round";

describe("round", () => {
  it("rounds to integer by default", () => {
    expect(round(4.006)).toBe(4);
  });

  it("[🎯] rounds to precision", () => {
    expect(round(4.006, 2)).toBe(4.01);
  });

  it("[🎯] handles negative precision", () => {
    expect(round(4060, -2)).toBe(4100);
  });

  it("[🎯] handles already rounded numbers", () => {
    expect(round(4, 0)).toBe(4);
  });

  itProp.prop([fc.integer()])(
    "[🎲] integers unchanged with default precision",
    (n) => {
      expect(round(n)).toBe(n);
    }
  );

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true, min: -1000, max: 1000 })])(
    "[🎲] result is within 0.5 of input for default precision",
    (n) => {
      expect(Math.abs(round(n) - n)).toBeLessThanOrEqual(0.5);
    }
  );
});
