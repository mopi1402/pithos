import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { defaultTo } from "./default-to";

describe("defaultTo", () => {
  it("returns value when defined", () => {
    expect(defaultTo(1, 10)).toBe(1);
  });

  it("returns default for undefined", () => {
    expect(defaultTo(undefined, 10)).toBe(10);
  });

  it("returns default for null", () => {
    expect(defaultTo(null, 10)).toBe(10);
  });

  it("returns default for NaN", () => {
    expect(defaultTo(NaN, 10)).toBe(10);
  });

  it("works with objects", () => {
    const obj = { a: 1 };
    const defaultObj = { b: 2 };
    expect(defaultTo(obj, defaultObj)).toBe(obj);
    expect(defaultTo(null, defaultObj)).toBe(defaultObj);
  });

  it("works with arrays", () => {
    const arr = [1, 2, 3];
    const defaultArr = [4, 5, 6];
    expect(defaultTo(arr, defaultArr)).toBe(arr);
    expect(defaultTo(undefined, defaultArr)).toBe(defaultArr);
  });

  it("handles string type", () => {
    const result = defaultTo<string, string>(undefined, "default");
    expect(result).toBe("default");
  });

  it("[🎯] returns 0 as valid value (falsy but not nullish)", () => {
    expect(defaultTo(0, 10)).toBe(0);
  });

  it("[🎯] returns empty string as valid value (falsy but not nullish)", () => {
    expect(defaultTo("", "default")).toBe("");
  });

  it("[🎯] returns false as valid value (falsy but not nullish)", () => {
    expect(defaultTo(false, true)).toBe(false);
  });

  it("[🎯] differs from nullish coalescing for NaN (@note)", () => {
    expect(NaN ?? 10).toBeNaN();
    expect(defaultTo(NaN, 10)).toBe(10);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] returns value when value is a valid number",
    (value, defaultValue) => {
      expect(defaultTo(value, defaultValue)).toBe(value);
    }
  );

  itProp.prop([fc.string(), fc.string()])(
    "[🎲] returns value when value is a valid string",
    (value, defaultValue) => {
      expect(defaultTo(value, defaultValue)).toBe(value);
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] returns default for null",
    (defaultValue) => {
      expect(defaultTo(null, defaultValue)).toBe(defaultValue);
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] returns default for undefined",
    (defaultValue) => {
      expect(defaultTo(undefined, defaultValue)).toBe(defaultValue);
    }
  );

  itProp.prop([fc.anything()])(
    "[🎲] returns default for NaN",
    (defaultValue) => {
      expect(defaultTo(NaN, defaultValue)).toBe(defaultValue);
    }
  );
});
