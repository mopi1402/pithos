import { describe, it, expect } from "vitest";
import { parseFloatDef } from "./parse-float-def";

describe("parseFloatDef", () => {
  it("parses valid float string", () => {
    expect(parseFloatDef("3.14", 0)).toBe(3.14);
  });

  it("returns default for null", () => {
    expect(parseFloatDef(null, 42)).toBe(42);
  });

  it("returns default for undefined", () => {
    expect(parseFloatDef(undefined, 42)).toBe(42);
  });

  it("[🎯] returns default for empty string", () => {
    expect(parseFloatDef("", 10)).toBe(10);
  });
});
