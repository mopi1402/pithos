import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toString } from "./toString";

describe("toString", () => {
  it("converts numbers to strings", () => {
    expect(toString(42)).toBe("42");
  });

  it("[🎯] returns empty string for null", () => {
    expect(toString(null)).toBe("");
  });

  it("[🎯] returns empty string for undefined", () => {
    expect(toString(undefined)).toBe("");
  });

  it("converts arrays", () => {
    expect(toString([1, 2])).toBe("1,2");
  });

  it("converts booleans", () => {
    expect(toString(true)).toBe("true");
  });

  itProp.prop([fc.integer()])(
    "[🎲] converts integers to string representation",
    (n) => {
      expect(toString(n)).toBe(String(n));
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] returns strings unchanged",
    (s) => {
      expect(toString(s)).toBe(s);
    }
  );
});
