import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toNumber } from "./toNumber";

describe("toNumber", () => {
  it("converts strings to numbers", () => {
    expect(toNumber("42")).toBe(42);
    expect(toNumber("3.14")).toBe(3.14);
  });

  it("converts booleans", () => {
    expect(toNumber(true)).toBe(1);
    expect(toNumber(false)).toBe(0);
  });

  it("[🎯] converts null to 0", () => {
    expect(toNumber(null)).toBe(0);
  });

  it("[🎯] returns NaN for invalid strings", () => {
    expect(toNumber("abc")).toBeNaN();
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns integers unchanged",
    (n) => {
      expect(toNumber(n)).toBe(n);
    }
  );

  itProp.prop([fc.double()])(
    "[🎲] returns doubles unchanged",
    (n) => {
      if (Number.isNaN(n)) {
        expect(toNumber(n)).toBeNaN();
      } else {
        expect(toNumber(n)).toBe(n);
      }
    }
  );
});
