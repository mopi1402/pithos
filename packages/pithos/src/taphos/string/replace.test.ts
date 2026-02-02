import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { replace } from "./replace";

describe("replace", () => {
  it("replaces string pattern", () => {
    expect(replace("hello world", "world", "there")).toBe("hello there");
  });

  it("replaces regex pattern", () => {
    expect(replace("foo bar foo", /foo/g, "baz")).toBe("baz bar baz");
  });

  it("[🎯] handles null string", () => {
    expect(replace(null, "a", "b")).toBe("");
  });

  it("[🎯] replaces first occurrence only with string", () => {
    expect(replace("aaa", "a", "b")).toBe("baa");
  });

  itProp.prop([fc.string(), fc.string({ minLength: 1 }), fc.string()])(
    "[🎲] result does not contain pattern when replaced globally",
    (str, pattern, replacement) => {
      if (replacement.includes(pattern)) return; // Skip if replacement contains pattern
      const result = replace(str, new RegExp(escapeRegex(pattern), "g"), replacement);
      expect(result.includes(pattern)).toBe(false);
    }
  );
});

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
