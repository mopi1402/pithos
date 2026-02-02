import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { isOneOf } from "./is-one-of";

const statuses = ["pending", "active", "done"] as const;

describe("isOneOf", () => {
  it("should return true when value exists in source", () => {
    expect(isOneOf("pending", statuses)).toBe(true);
    expect(isOneOf("done", statuses)).toBe(true);
  });

  it("should return false when value is not in source", () => {
    expect(isOneOf("invalid", statuses)).toBe(false);
  });

  it("[🎯] should return false for null or undefined", () => {
    expect(isOneOf(null, statuses)).toBe(false);
    expect(isOneOf(undefined, statuses)).toBe(false);
  });

  it("[🎯] should return false for empty string", () => {
    expect(isOneOf("", statuses)).toBe(false);
  });

  it("[🎯] should return false for empty source array", () => {
    expect(isOneOf("pending", [])).toBe(false);
  });

  it("should handle single-element source array", () => {
    expect(isOneOf("only", ["only"] as const)).toBe(true);
    expect(isOneOf("other", ["only"] as const)).toBe(false);
  });

  itProp.prop([fc.array(fc.string({ minLength: 1 }), { minLength: 1 })])(
    "[🎲] first element is always in array",
    (arr) => {
      expect(isOneOf(arr[0], arr)).toBe(true);
    }
  );
});
