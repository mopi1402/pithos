import { describe, it, expect } from "vitest";
import { isBigint } from "./is-bigint";

describe("isBigint", () => {
  it("should return true for bigint values", () => {
    expect(isBigint(BigInt(123))).toBe(true);
    expect(isBigint(0n)).toBe(true);
    expect(isBigint(-999n)).toBe(true);
  });

  it("[🎯] should return false for numbers", () => {
    expect(isBigint(123)).toBe(false);
    expect(isBigint(0)).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isBigint(null)).toBe(false);
    expect(isBigint("123")).toBe(false);
    expect(isBigint({})).toBe(false);
  });
});
