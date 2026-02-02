import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { gt } from "./gt";

describe("gt", () => {
  it("returns true when first value is greater", () => {
    expect(gt(3, 1)).toBe(true);
  });

  it("[🎯] returns false when values are equal", () => {
    expect(gt(3, 3)).toBe(false);
  });

  it("returns false when first value is lesser", () => {
    expect(gt(1, 3)).toBe(false);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to > operator",
    (a, b) => {
      expect(gt(a, b)).toBe(a > b);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] n is never greater than itself",
    (n) => {
      expect(gt(n, n)).toBe(false);
    }
  );
});
