import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parseInteger } from "./parseInteger";

describe("parseInteger", () => {
  it("parses decimal by default", () => {
    expect(parseInteger("42")).toBe(42);
  });

  it("parses binary", () => {
    expect(parseInteger("10", 2)).toBe(2);
  });

  it("parses hexadecimal", () => {
    expect(parseInteger("ff", 16)).toBe(255);
  });

  it("[🎯] returns NaN for invalid input", () => {
    expect(parseInteger("abc")).toBeNaN();
  });

  it("[🎯] handles null", () => {
    expect(parseInteger(null)).toBeNaN();
  });

  itProp.prop([fc.integer({ min: -1000000, max: 1000000 })])(
    "[🎲] parses stringified integers correctly",
    (n) => {
      expect(parseInteger(String(n))).toBe(n);
    }
  );

  itProp.prop([fc.integer({ min: 0, max: 255 })])(
    "[🎲] parses hex strings correctly",
    (n) => {
      expect(parseInteger(n.toString(16), 16)).toBe(n);
    }
  );
});
