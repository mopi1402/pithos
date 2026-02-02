import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { random } from "./random";

describe("random", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns value between min and max", () => {
    vi.mocked(Math.random).mockReturnValue(0.5);
    expect(random(10, 20)).toBe(15);
  });

  it("uses 0 as min when single argument", () => {
    vi.mocked(Math.random).mockReturnValue(0.5);
    expect(random(10)).toBe(5);
  });

  it("returns min when min equals max", () => {
    expect(random(5, 5)).toBe(5);
  });

  it("swaps bounds when min > max", () => {
    vi.mocked(Math.random).mockReturnValue(0.5);
    expect(random(20, 10)).toBe(15);
  });

  it("[👾] returns min without calling Math.random when min === max", () => {
    // This kills the BlockStatement mutant that empties the if block
    vi.mocked(Math.random).mockReturnValue(0.5);
    expect(random(7, 7)).toBe(7);
    // Math.random should not be called when min === max
    expect(Math.random).not.toHaveBeenCalled();
  });

  it("[👾] correctly swaps bounds (different from no swap)", () => {
    // This kills mutants: min > max → min >= max, min > max → min <= max
    // When min > max, bounds should be swapped to get correct result
    vi.mocked(Math.random).mockReturnValue(0);
    // random(10, 5) with min > max should swap to (5, 10)
    // With Math.random() = 0: result = 0 * (10-5) + 5 = 5
    expect(random(10, 5)).toBe(5);
  });

  it("[👾] swapping bounds produces different result than not swapping", () => {
    // When Math.random = 0, without swap: 0 * (5-10) + 10 = 10
    // With swap: 0 * (10-5) + 5 = 5
    vi.mocked(Math.random).mockReturnValue(0);
    expect(random(10, 5)).toBe(5); // Should be min after swap, not max before swap
  });
});
