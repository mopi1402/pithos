import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { identity } from "./identity";

describe("identity", () => {
  it("returns first argument", () => {
    expect(identity(42)).toBe(42);
  });

  it("returns object by reference", () => {
    const obj = { a: 1 };
    expect(identity(obj)).toBe(obj);
  });

  it("[🎯] handles null", () => {
    expect(identity(null)).toBeNull();
  });

  it("[🎯] handles undefined", () => {
    expect(identity(undefined)).toBeUndefined();
  });

  itProp.prop([fc.anything()])(
    "[🎲] always returns input unchanged",
    (value) => {
      expect(identity(value)).toBe(value);
    }
  );
});
