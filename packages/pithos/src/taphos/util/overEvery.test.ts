import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { overEvery } from "./overEvery";

describe("overEvery", () => {
  it("returns true when all predicates pass", () => {
    const fn = overEvery([(n: number) => n > 0, (n: number) => n % 2 === 0]);
    expect(fn(4)).toBe(true);
  });

  it("returns false when any predicate fails", () => {
    const fn = overEvery([(n: number) => n > 0, (n: number) => n % 2 === 0]);
    expect(fn(-2)).toBe(false);
  });

  it("[🎯] handles empty predicates array", () => {
    const fn = overEvery([]);
    expect(fn(42)).toBe(true);
  });

  it("handles single predicate", () => {
    const fn = overEvery([(n: number) => n > 0]);
    expect(fn(1)).toBe(true);
    expect(fn(-1)).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] with always-true predicates returns true",
    (n) => {
      const fn = overEvery([() => true, () => true]);
      expect(fn(n)).toBe(true);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] with one always-false predicate returns false",
    (n) => {
      const fn = overEvery([() => true, () => false]);
      expect(fn(n)).toBe(false);
    }
  );
});
