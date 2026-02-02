import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { trimEnd } from "./trimEnd";

describe("trimEnd", () => {
  it("removes trailing whitespace", () => {
    expect(trimEnd("  hello  ")).toBe("  hello");
  });

  it("[🎯] handles null", () => {
    expect(trimEnd(null)).toBe("");
  });

  it("[🎯] handles undefined", () => {
    expect(trimEnd(undefined)).toBe("");
  });

  it("handles string with no trailing whitespace", () => {
    expect(trimEnd("hello")).toBe("hello");
  });

  itProp.prop([fc.string()])("[🎲] result equals native trimEnd", (str) => {
    expect(trimEnd(str)).toBe(str.trimEnd());
  });

  itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
    const once = trimEnd(str);
    const twice = trimEnd(once);
    expect(once).toBe(twice);
  });

  itProp.prop([fc.string()])("[🎲] result does not end with space", (str) => {
    const result = trimEnd(str);
    if (result.length > 0) {
      expect(result[result.length - 1]).not.toBe(" ");
    }
  });
});
