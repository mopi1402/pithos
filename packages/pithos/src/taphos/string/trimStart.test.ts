import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { trimStart } from "./trimStart";

describe("trimStart", () => {
  it("removes leading whitespace", () => {
    expect(trimStart("  hello  ")).toBe("hello  ");
  });

  it("[🎯] handles null", () => {
    expect(trimStart(null)).toBe("");
  });

  it("[🎯] handles undefined", () => {
    expect(trimStart(undefined)).toBe("");
  });

  it("handles string with no leading whitespace", () => {
    expect(trimStart("hello")).toBe("hello");
  });

  itProp.prop([fc.string()])("[🎲] result equals native trimStart", (str) => {
    expect(trimStart(str)).toBe(str.trimStart());
  });

  itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
    const once = trimStart(str);
    const twice = trimStart(once);
    expect(once).toBe(twice);
  });

  itProp.prop([fc.string()])("[🎲] result does not start with space", (str) => {
    const result = trimStart(str);
    if (result.length > 0) {
      expect(result[0]).not.toBe(" ");
    }
  });
});
