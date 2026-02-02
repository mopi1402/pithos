import { describe, it, expect } from "vitest";
import { isDate } from "./is-date";

describe("isDate", () => {
  it("should return true for Date instances", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date("2024-01-01"))).toBe(true);
    expect(isDate(new Date("invalid"))).toBe(true);
  });

  it("[🎯] should return false for date-like values", () => {
    expect(isDate(Date.now())).toBe(false);
    expect(isDate("2024-01-01")).toBe(false);
    expect(isDate(1704067200000)).toBe(false);
  });

  it("[🎯] should return false for other types", () => {
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate({})).toBe(false);
  });
});
