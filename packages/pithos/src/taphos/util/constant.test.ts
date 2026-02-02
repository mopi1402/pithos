import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { constant } from "./constant";

describe("constant", () => {
  it("returns function that returns value", () => {
    const fn = constant(42);
    expect(fn()).toBe(42);
  });

  it("[🎯] returns same value on multiple calls", () => {
    const fn = constant({ a: 1 });
    expect(fn()).toBe(fn());
  });

  it("[🎯] handles null value", () => {
    const fn = constant(null);
    expect(fn()).toBeNull();
  });

  itProp.prop([fc.anything()])(
    "[🎲] always returns the same value",
    (value) => {
      const fn = constant(value);
      expect(fn()).toBe(value);
      expect(fn()).toBe(fn());
    }
  );
});
