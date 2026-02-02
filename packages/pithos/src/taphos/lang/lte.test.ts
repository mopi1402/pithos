import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lte } from "./lte";

describe("lte", () => {
  it("returns true when first value is lesser", () => {
    expect(lte(1, 3)).toBe(true);
  });

  it("[🎯] returns true when values are equal", () => {
    expect(lte(3, 3)).toBe(true);
  });

  it("returns false when first value is greater", () => {
    expect(lte(3, 1)).toBe(false);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to <= operator",
    (a, b) => {
      expect(lte(a, b)).toBe(a <= b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] n is always <= itself",
    (n) => {
      expect(lte(n, n)).toBe(true);
    }
  );
});
