import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { divide } from "./divide";

describe("divide", () => {
  it("divides two numbers", () => {
    expect(divide(6, 4)).toBe(1.5);
  });

  it("[🎯] handles division by zero", () => {
    expect(divide(6, 0)).toBe(Infinity);
  });

  it("[🎯] handles negative numbers", () => {
    expect(divide(-6, 2)).toBe(-3);
  });

  itProp.prop([fc.integer(), fc.integer({ min: 1 })])(
    "[🎲] is equivalent to / operator for positive divisor",
    (a, b) => {
      expect(divide(a, b)).toBe(a / b);
    }
  );

  itProp.prop([fc.integer({ min: 1 })])(
    "[🎲] dividing by 1 returns same number",
    (n) => {
      expect(divide(n, 1)).toBe(n);
    }
  );

  itProp.prop([fc.integer({ min: 1 })])(
    "[🎲] dividing by itself returns 1",
    (n) => {
      expect(divide(n, n)).toBe(1);
    }
  );
});
