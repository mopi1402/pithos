import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { multiply } from "./multiply";

describe("multiply", () => {
  it("multiplies two numbers", () => {
    expect(multiply(6, 4)).toBe(24);
  });

  it("[🎯] handles zero", () => {
    expect(multiply(6, 0)).toBe(0);
  });

  it("[🎯] handles negative numbers", () => {
    expect(multiply(-3, 4)).toBe(-12);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to * operator",
    (a, b) => {
      expect(multiply(a, b)).toBe(a * b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] multiplying by 1 returns same number",
    (n) => {
      expect(multiply(n, 1)).toBe(n);
    }
  );

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is commutative",
    (a, b) => {
      expect(multiply(a, b)).toBe(multiply(b, a));
    }
  );
});
