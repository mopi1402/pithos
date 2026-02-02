import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { propertyOf } from "./propertyOf";

describe("propertyOf", () => {
  it("returns value at key", () => {
    const getValue = propertyOf({ a: 1, b: 2 });
    expect(getValue("a")).toBe(1);
    expect(getValue("b")).toBe(2);
  });

  it("handles object with different types", () => {
    const obj = { str: "hello", num: 42 };
    const getValue = propertyOf(obj);
    expect(getValue("str")).toBe("hello");
    expect(getValue("num")).toBe(42);
  });

  itProp.prop([fc.string(), fc.anything()])(
    "[🎲] retrieves property value correctly",
    (key, value) => {
      const obj = { [key]: value };
      const fn = propertyOf(obj);
      expect(fn(key)).toBe(value);
    }
  );
});
