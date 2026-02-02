import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isSymbol } from "./is-symbol";

describe("isSymbol", () => {
  it("should return true for symbols", () => {
    expect(isSymbol(Symbol("id"))).toBe(true);
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol.iterator)).toBe(true);
    expect(isSymbol(Symbol.for("key"))).toBe(true);
  });

  it("should return false for strings", () => {
    expect(isSymbol("symbol")).toBe(false);
    expect(isSymbol("Symbol()")).toBe(false);
  });

  it("should return false for objects containing symbols", () => {
    expect(isSymbol({ sym: Symbol() })).toBe(false);
    expect(isSymbol([Symbol()])).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
    expect(isSymbol(123)).toBe(false);
  });

  itProp.prop([fc.anything()])("[🎲] only symbols return true", (value) => {
    expect(isSymbol(value)).toBe(typeof value === "symbol");
  });
});
