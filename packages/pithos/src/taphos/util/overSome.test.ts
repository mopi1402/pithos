import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { overSome } from "./overSome";

describe("overSome", () => {
  it("returns true when any predicate passes", () => {
    const fn = overSome([(n: number) => n > 0, (n: number) => n % 2 === 0]);
    expect(fn(-2)).toBe(true);
  });

  it("returns false when all predicates fail", () => {
    const fn = overSome([(n: number) => n > 0, (n: number) => n % 2 === 0]);
    expect(fn(-3)).toBe(false);
  });

  it("[🎯] handles empty predicates array", () => {
    const fn = overSome([]);
    expect(fn(42)).toBe(false);
  });

  it("handles single predicate", () => {
    const fn = overSome([(n: number) => n > 0]);
    expect(fn(1)).toBe(true);
    expect(fn(-1)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] with one always-true predicate returns true",
    (n) => {
      const fn = overSome([() => false, () => true]);
      expect(fn(n)).toBe(true);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] with all always-false predicates returns false",
    (n) => {
      const fn = overSome([() => false, () => false]);
      expect(fn(n)).toBe(false);
    }
  );
});
