import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pascalCase } from "./pascal-case";

describe("pascalCase", () => {
  it("converts kebab-case", () => {
    expect(pascalCase("foo-bar-baz")).toBe("FooBarBaz");
  });

  it("converts snake_case", () => {
    expect(pascalCase("foo_bar_baz")).toBe("FooBarBaz");
  });

  it("converts camelCase", () => {
    expect(pascalCase("fooBarBaz")).toBe("FooBarBaz");
  });

  it("handles single word", () => {
    expect(pascalCase("foo")).toBe("Foo");
  });

  it("handles empty string", () => {
    expect(pascalCase("")).toBe("");
  });

  it("handles already PascalCase", () => {
    expect(pascalCase("FooBar")).toBe("FooBar");
  });

  it("returns empty string when camelCase returns empty (only separators)", () => {
    // Tests the branch: if (camel.length === 0) return "";
    // This happens when the input contains only separators
    expect(pascalCase("---")).toBe("");
    expect(pascalCase("___")).toBe("");
    expect(pascalCase("   ")).toBe("");
    expect(pascalCase("--__--")).toBe("");
    expect(pascalCase("-_-")).toBe("");
  });

  it("[🎯] tests JSDoc example with kebab-case", () => {
    expect(pascalCase("hello-world")).toBe("HelloWorld");
  });

  it("[🎯] tests JSDoc example with snake_case", () => {
    expect(pascalCase("background_color")).toBe("BackgroundColor");
  });

  it("[🎯] tests JSDoc example with spaces", () => {
    expect(pascalCase("foo bar")).toBe("FooBar");
  });

  it("[🎯] handles single character", () => {
    expect(pascalCase("a")).toBe("A");
    expect(pascalCase("A")).toBe("A");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof pascalCase(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result starts with uppercase if non-empty", (str) => {
    const result = pascalCase(str);
    if (result.length > 0) {
      expect(result[0]).toBe(result[0].toUpperCase());
    }
  });

  itProp.prop([fc.string()])("[🎲] result contains no separators", (str) => {
    const result = pascalCase(str);
    expect(result).not.toMatch(/[_\-\s]/);
  });

  itProp.prop([fc.stringMatching(/^[a-z]+$/)])("[🎲] idempotent for lowercase input: pascalCase(pascalCase(x)) === pascalCase(x)", (str) => {
    const once = pascalCase(str);
    const twice = pascalCase(once);
    expect(twice).toBe(once);
  });
});
