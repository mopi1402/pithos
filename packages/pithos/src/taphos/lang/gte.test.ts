import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { gte } from "./gte";

describe("gte", () => {
  it("returns true when first value is greater", () => {
    expect(gte(3, 1)).toBe(true);
  });

  it("[🎯] returns true when values are equal", () => {
    expect(gte(3, 3)).toBe(true);
  });

  it("returns false when first value is lesser", () => {
    expect(gte(1, 3)).toBe(false);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to >= operator",
    (a, b) => {
      expect(gte(a, b)).toBe(a >= b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] n is always >= itself",
    (n) => {
      expect(gte(n, n)).toBe(true);
    }
  );
});
