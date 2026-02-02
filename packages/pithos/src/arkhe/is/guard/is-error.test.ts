import { describe, it, expect } from "vitest";
import { isError } from "./is-error";

describe("isError", () => {
  it("should return true for Error instances", () => {
    expect(isError(new Error("oops"))).toBe(true);
  });

  it("[🎯] should return true for Error subclasses", () => {
    expect(isError(new TypeError("bad"))).toBe(true);
  });

  it("[🎯] should return false for error-like objects", () => {
    expect(isError({ message: "fake" })).toBe(false);
  });

  it("[🎯] should return false for non-errors", () => {
    expect(isError("error string")).toBe(false);
    expect(isError(null)).toBe(false);
  });
});
