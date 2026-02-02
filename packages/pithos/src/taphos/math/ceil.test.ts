import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { ceil } from "./ceil";

describe("ceil", () => {
  it("rounds up to integer by default", () => {
    expect(ceil(4.006)).toBe(5);
  });

  it("[🎯] rounds up to precision", () => {
    expect(ceil(6.004, 2)).toBe(6.01);
  });

  it("[🎯] handles negative precision", () => {
    expect(ceil(6040, -2)).toBe(6100);
  });

  it("[🎯] handles already rounded numbers", () => {
    expect(ceil(4, 0)).toBe(4);
  });

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true, min: -1000, max: 1000 })])(
    "[🎲] result >= input for default precision",
    (n) => {
      expect(ceil(n)).toBeGreaterThanOrEqual(n);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] integers unchanged with default precision",
    (n) => {
      expect(ceil(n)).toBe(n);
    }
  );
});
