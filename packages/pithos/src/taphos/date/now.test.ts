import { describe, it, expect } from "vitest";
import { now } from "./now";

describe("now", () => {
  it("returns a number", () => {
    expect(typeof now()).toBe("number");
  });

  it("[🎯] returns current timestamp", () => {
    const before = Date.now();
    const result = now();
    const after = Date.now();
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });

  it("[🎯] always returns a positive integer", () => {
    const result = now();
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThan(0);
  });

  it("[🎯] is equivalent to Date.now()", () => {
    const before = Date.now();
    const result = now();
    const after = Date.now();
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });
});
