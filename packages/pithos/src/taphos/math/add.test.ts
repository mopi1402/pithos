import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { add } from "./add";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(6, 4)).toBe(10);
  });

  it("[🎯] handles negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });

  it("[🎯] handles decimals", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to + operator",
    (a, b) => {
      expect(add(a, b)).toBe(a + b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] adding 0 returns same number",
    (n) => {
      expect(add(n, 0)).toBe(n);
    }
  );

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is commutative",
    (a, b) => {
      expect(add(a, b)).toBe(add(b, a));
    }
  );
});
