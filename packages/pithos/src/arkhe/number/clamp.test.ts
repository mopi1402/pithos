import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { clamp } from "./clamp";

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when value is below", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when value is above", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("throws RangeError when min is greater than max", () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
    expect(() => clamp(5, 10, 0)).toThrow("min must be <= max");
  });

  it("[🎯] returns min when value equals min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("[🎯] returns max when value equals max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("[🎯] clamps to single value when min equals max", () => {
    expect(clamp(5, 7, 7)).toBe(7);
    expect(clamp(10, 7, 7)).toBe(7);
  });

  itProp.prop([
    fc.integer(),
    fc.integer({ min: 0, max: 1000 }),
    fc.integer({ min: 0, max: 1000 }),
  ])("[🎲] result is always between min and max", (value, offset1, offset2) => {
    const min = Math.min(offset1, offset2);
    const max = Math.max(offset1, offset2);
    const result = clamp(value, min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  itProp.prop([
    fc.integer(),
    fc.integer({ min: 0, max: 1000 }),
    fc.integer({ min: 0, max: 1000 }),
  ])(
    "[🎲] idempotent: clamp(clamp(x)) === clamp(x)",
    (value, offset1, offset2) => {
      const min = Math.min(offset1, offset2);
      const max = Math.max(offset1, offset2);
      const once = clamp(value, min, max);
      const twice = clamp(once, min, max);
      expect(twice).toBe(once);
    }
  );
});
