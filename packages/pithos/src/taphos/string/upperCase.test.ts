import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { upperCase } from "./upperCase";

describe("upperCase", () => {
  it("converts to upper case with spaces", () => {
    expect(upperCase("--Foo-Bar--")).toBe("FOO BAR");
  });

  it("handles camelCase", () => {
    expect(upperCase("fooBar")).toBe("FOO BAR");
  });

  it("handles snake_case", () => {
    expect(upperCase("__foo_bar__")).toBe("FOO BAR");
  });

  it("handles string starting with uppercase", () => {
    expect(upperCase("Foo")).toBe("FOO");
    expect(upperCase("FooBar")).toBe("FOO BAR");
  });

  it("[🎯] returns empty string for null", () => {
    expect(upperCase(null)).toBe("");
  });

  it("[🎯] returns empty string for undefined", () => {
    expect(upperCase(undefined)).toBe("");
  });

  itProp.prop([fc.string()])("[🎲] result contains only uppercase letters", (str) => {
    const result = upperCase(str);
    expect(result).toBe(result.toUpperCase());
  });

  itProp.prop([fc.stringMatching(/^[a-z ]+$/)])("[🎲] idempotent for already-formatted strings", (str) => {
    const once = upperCase(str);
    const twice = upperCase(once);
    expect(once).toBe(twice);
  });
});
