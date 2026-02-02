import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isNumber } from "./is-number";

describe("isNumber", () => {
  it("should return true for numbers", () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
  });

  it("[🎯] should return true for NaN", () => {
    expect(isNumber(NaN)).toBe(true);
  });

  it("[🎯] should return true for Infinity", () => {
    expect(isNumber(Infinity)).toBe(true);
    expect(isNumber(-Infinity)).toBe(true);
  });

  it("should return false for numeric strings", () => {
    expect(isNumber("42")).toBe(false);
  });

  it("[🎯] should return false for non-number types", () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(42n)).toBe(false);
  });

  itProp.prop([fc.float()])("[🎲] all floats return true", (num) => {
    expect(isNumber(num)).toBe(true);
  });
});
