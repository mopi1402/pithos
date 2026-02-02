import { describe, it, expect } from "vitest";
import { parseFloat } from "./parse-float";

describe("parseFloat", () => {
  it("parses valid float string", () => {
    expect(parseFloat("3.14", 0)).toBe(3.14);
  });

  it("returns default for non-numeric string", () => {
    expect(parseFloat("abc", 42)).toBe(42);
  });

  it("returns default for Infinity", () => {
    expect(parseFloat("Infinity", 0)).toBe(0);
  });

  it("returns default for empty string", () => {
    expect(parseFloat("", 10)).toBe(10);
  });

  it("[🎯] returns default for NaN string", () => {
    expect(parseFloat("NaN", 100)).toBe(100);
  });

  it("[🎯] returns default for -Infinity", () => {
    expect(parseFloat("-Infinity", 0)).toBe(0);
  });
});
