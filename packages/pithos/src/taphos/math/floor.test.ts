import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { floor } from "./floor";

describe("floor", () => {
  it("rounds down to integer by default", () => {
    expect(floor(4.906)).toBe(4);
  });

  it("[🎯] rounds down to precision", () => {
    expect(floor(0.046, 2)).toBe(0.04);
  });

  it("[🎯] handles negative precision", () => {
    expect(floor(4060, -2)).toBe(4000);
  });

  it("[🎯] handles already rounded numbers", () => {
    expect(floor(4, 0)).toBe(4);
  });

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true, min: -1000, max: 1000 })])(
    "[🎲] result <= input for default precision",
    (n) => {
      expect(floor(n)).toBeLessThanOrEqual(n);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] integers unchanged with default precision",
    (n) => {
      expect(floor(n)).toBe(n);
    }
  );
});
