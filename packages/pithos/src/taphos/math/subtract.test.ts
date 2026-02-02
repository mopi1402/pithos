import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { subtract } from "./subtract";

describe("subtract", () => {
  it("subtracts two numbers", () => {
    expect(subtract(6, 4)).toBe(2);
  });

  it("[🎯] handles negative results", () => {
    expect(subtract(4, 6)).toBe(-2);
  });

  it("[🎯] handles negative numbers", () => {
    expect(subtract(-1, -2)).toBe(1);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to - operator",
    (a, b) => {
      expect(subtract(a, b)).toBe(a - b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] subtracting 0 returns same number",
    (n) => {
      expect(subtract(n, 0)).toBe(n);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] subtracting itself returns 0",
    (n) => {
      expect(subtract(n, n)).toBe(0);
    }
  );
});
