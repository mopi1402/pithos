import { describe, it, expect } from "vitest";
import { parseIntDef } from "./parse-int-def";

describe("parseIntDef", () => {
  it("parses valid integer string", () => {
    expect(parseIntDef("42")).toBe(42);
  });

  it("parses with custom radix", () => {
    expect(parseIntDef("ff", 0, 16)).toBe(255);
  });

  it("returns default for null", () => {
    expect(parseIntDef(null, 10)).toBe(10);
  });

  it("returns default for undefined", () => {
    expect(parseIntDef(undefined, 10)).toBe(10);
  });

  it("returns default for non-numeric string", () => {
    expect(parseIntDef("abc", 99)).toBe(99);
  });

  it("[🎯] returns null as default when not specified", () => {
    expect(parseIntDef(null)).toBeNull();
  });
});
