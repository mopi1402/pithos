import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toFinite } from "./toFinite";

describe("toFinite", () => {
  it("returns finite numbers as-is", () => {
    expect(toFinite(3.7)).toBe(3.7);
    expect(toFinite(-100)).toBe(-100);
  });

  it("[🎯] converts Infinity to MAX_VALUE", () => {
    expect(toFinite(Infinity)).toBe(Number.MAX_VALUE);
  });

  it("[🎯] converts -Infinity to -MAX_VALUE", () => {
    expect(toFinite(-Infinity)).toBe(-Number.MAX_VALUE);
  });

  it("[🎯] converts NaN to 0", () => {
    expect(toFinite(NaN)).toBe(0);
  });

  it("converts strings to numbers", () => {
    expect(toFinite("42")).toBe(42);
  });

  itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true })])(
    "[🎲] returns finite numbers unchanged",
    (n) => {
      expect(toFinite(n)).toBe(n);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] returns integers unchanged",
    (n) => {
      expect(toFinite(n)).toBe(n);
    }
  );
});
