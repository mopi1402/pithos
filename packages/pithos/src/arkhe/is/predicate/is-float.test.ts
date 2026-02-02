import { describe, it, expect } from "vitest";
import { isFloat } from "./is-float";

describe("isFloat", () => {
  it("should return true for float values", () => {
    expect(isFloat(1.5)).toBe(true);
    expect(isFloat(0.1)).toBe(true);
    expect(isFloat(-3.14)).toBe(true);
    expect(isFloat(0.0001)).toBe(true);
  });

  it("should return false for integer values", () => {
    expect(isFloat(1)).toBe(false);
    expect(isFloat(0)).toBe(false);
    expect(isFloat(-5)).toBe(false);
    expect(isFloat(1.0)).toBe(false);
  });

  it("should return false for non-finite numbers", () => {
    expect(isFloat(Infinity)).toBe(false);
    expect(isFloat(-Infinity)).toBe(false);
    expect(isFloat(NaN)).toBe(false);
  });

  it("should return false for non-number values", () => {
    expect(isFloat("1.5")).toBe(false);
    expect(isFloat(null)).toBe(false);
    expect(isFloat(undefined)).toBe(false);
    expect(isFloat({})).toBe(false);
    expect(isFloat([])).toBe(false);
    expect(isFloat(true)).toBe(false);
  });

  it("[👾] typeof check: non-numbers fail early", () => {
    // If typeof check is removed/mutated, non-numbers would reach Number.isFinite
    expect(isFloat("3.14")).toBe(false);
    expect(isFloat(null)).toBe(false);
  });

  it("[👾] isFinite check: infinite numbers fail", () => {
    // If isFinite check is removed, Infinity would pass
    expect(isFloat(Infinity)).toBe(false);
    expect(isFloat(-Infinity)).toBe(false);
  });

  it("[👾] isInteger check: integers fail (negation matters)", () => {
    // If negation is removed, integers would return true
    expect(isFloat(5)).toBe(false);
    expect(isFloat(0)).toBe(false);
  });
});
