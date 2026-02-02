import { describe, it, expect } from "vitest";
import { toNumber } from "./to-number";

describe("toNumber", () => {
  it("returns number as-is", () => {
    expect(toNumber(42)).toBe(42);
  });

  it("returns default for NaN", () => {
    expect(toNumber(NaN, 10)).toBe(10);
  });

  it("returns default for null/undefined", () => {
    expect(toNumber(null, 5)).toBe(5);
    expect(toNumber(undefined, 5)).toBe(5);
  });

  it("converts boolean to 0/1", () => {
    expect(toNumber(true)).toBe(1);
    expect(toNumber(false)).toBe(0);
  });

  it("parses numeric string", () => {
    expect(toNumber("3.14")).toBe(3.14);
    expect(toNumber("abc", 99)).toBe(99);
  });

  it("extracts valueOf from objects", () => {
    expect(toNumber({ valueOf: () => 42 })).toBe(42);
  });

  it("returns default for non-convertible objects", () => {
    expect(toNumber({}, 10)).toBe(10);
  });

  it("defaults to 0 when no default provided", () => {
    expect(toNumber(null)).toBe(0);
  });

  it("returns default for symbol", () => {
    const sym = Symbol("test");
    expect(toNumber(sym, 5)).toBe(5);
    expect(toNumber(sym)).toBe(0); // default to 0
    expect(toNumber(Symbol.iterator, 10)).toBe(10);
  });

  it("[🎯] converts BigInt to number", () => {
    expect(toNumber(10n)).toBe(10);
    expect(toNumber(0n)).toBe(0);
    expect(toNumber(-5n)).toBe(-5);
  });
});
