import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { inRange } from "./in-range";

describe("inRange", () => {
  it("returns true when value is within range", () => {
    expect(inRange(5, 0, 10)).toBe(true);
  });

  it("returns false when value is below min", () => {
    expect(inRange(-1, 0, 10)).toBe(false);
  });

  it("returns false when value equals max (exclusive)", () => {
    expect(inRange(10, 0, 10)).toBe(false);
  });

  it("returns true when value equals min (inclusive)", () => {
    expect(inRange(0, 0, 10)).toBe(true);
  });

  it("uses 0 as min when two arguments provided", () => {
    expect(inRange(5, 10)).toBe(true);
    expect(inRange(-1, 10)).toBe(false);
  });

  it("returns false when min >= max", () => {
    expect(inRange(5, 10, 10)).toBe(false);
    expect(inRange(5, 10, 5)).toBe(false);
  });

  it("[👾] returns false when min === max (empty range)", () => {
    // This test specifically kills the mutant: min >= max → min > max
    // When min === max, the range is empty, so should return false
    expect(inRange(5, 5, 5)).toBe(false);
    expect(inRange(0, 0, 0)).toBe(false);
  });

  it("[👾] returns false when min > max (inverted range)", () => {
    // Kills the BlockStatement mutant that removes the return false
    expect(inRange(5, 10, 0)).toBe(false);
  });

  it("[🎯] returns false for NaN value", () => {
    expect(inRange(NaN, 0, 10)).toBe(false);
  });

  itProp.prop([
    fc.integer({ min: 0, max: 100 }),
    fc.integer({ min: 0, max: 100 }),
  ])("[🎲] value within range returns true", (offset1, offset2) => {
    const min = Math.min(offset1, offset2);
    const max = Math.max(offset1, offset2);
    if (min < max) {
      const value = min + Math.floor((max - min) / 2);
      expect(inRange(value, min, max)).toBe(true);
    }
  });

  itProp.prop([
    fc.integer({ min: 0, max: 100 }),
    fc.integer({ min: 0, max: 100 }),
  ])("[🎲] min value is inclusive", (offset1, offset2) => {
    const min = Math.min(offset1, offset2);
    const max = Math.max(offset1, offset2);
    if (min < max) {
      expect(inRange(min, min, max)).toBe(true);
    }
  });

  itProp.prop([
    fc.integer({ min: 0, max: 100 }),
    fc.integer({ min: 0, max: 100 }),
  ])("[🎲] max value is exclusive", (offset1, offset2) => {
    const min = Math.min(offset1, offset2);
    const max = Math.max(offset1, offset2);
    if (min < max) {
      expect(inRange(max, min, max)).toBe(false);
    }
  });
});
