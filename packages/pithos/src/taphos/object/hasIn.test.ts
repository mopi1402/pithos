import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { hasIn } from "./hasIn";

describe("hasIn", () => {
  it("returns true for own property", () => {
    expect(hasIn({ a: 1 }, "a")).toBe(true);
  });

  it("[🎯] returns true for inherited property", () => {
    expect(hasIn({ a: 1 }, "toString")).toBe(true);
  });

  it("returns false for missing property", () => {
    expect(hasIn({ a: 1 }, "b")).toBe(false);
  });

  it("[🎯] returns false for null", () => {
    expect(hasIn(null, "a")).toBe(false);
  });

  it("[🎯] returns false for undefined", () => {
    expect(hasIn(undefined, "a")).toBe(false);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] returns true for all own keys",
    (obj) => {
      for (const key of Object.keys(obj)) {
        expect(hasIn(obj, key)).toBe(true);
      }
    }
  );
});
