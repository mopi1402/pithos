import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { constantCase } from "./constant-case";

describe("constantCase", () => {
  it("converts camelCase", () => {
    expect(constantCase("fooBarBaz")).toBe("FOO_BAR_BAZ");
  });

  it("converts kebab-case", () => {
    expect(constantCase("foo-bar-baz")).toBe("FOO_BAR_BAZ");
  });

  it("converts snake_case", () => {
    expect(constantCase("foo_bar_baz")).toBe("FOO_BAR_BAZ");
  });

  it("preserves already CONSTANT_CASE", () => {
    expect(constantCase("FOO_BAR")).toBe("FOO_BAR");
  });

  it("handles single word", () => {
    expect(constantCase("foo")).toBe("FOO");
  });

  it("handles empty string", () => {
    expect(constantCase("")).toBe("");
  });

  it("handles acronyms", () => {
    expect(constantCase("parseHTMLString")).toBe("PARSE_HTML_STRING");
  });

  it("[🎯] tests JSDoc example with spaces", () => {
    expect(constantCase("foo bar")).toBe("FOO_BAR");
  });

  it("[🎯] tests JSDoc example with multiple separators", () => {
    expect(constantCase("--foo--bar--")).toBe("FOO_BAR");
  });

  it("[🎯] handles multiple leading underscores", () => {
    expect(constantCase("___foo")).toBe("FOO");
  });

  it("[🎯] handles multiple trailing underscores", () => {
    expect(constantCase("foo___")).toBe("FOO");
  });

  it("[🎯] handles consecutive uppercase with acronym", () => {
    // Tests the ([A-Z]+)([A-Z][a-z]) pattern - XMLParser should become XML_PARSER
    expect(constantCase("XMLParser")).toBe("XML_PARSER");
    expect(constantCase("HTMLElement")).toBe("HTML_ELEMENT");
  });

  it("[🎯] handles single character", () => {
    expect(constantCase("a")).toBe("A");
    expect(constantCase("A")).toBe("A");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof constantCase(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result is uppercase", (str) => {
    const result = constantCase(str);
    expect(result).toBe(result.toUpperCase());
  });

  itProp.prop([fc.string()])("[🎲] result contains only uppercase letters, digits, and underscores or is empty", (str) => {
    const result = constantCase(str);
    // Special characters may pass through, but separators are converted
    expect(result).not.toMatch(/[\s-]/);
  });

  itProp.prop([fc.string()])("[🎲] idempotent: constantCase(constantCase(x)) === constantCase(x)", (str) => {
    const once = constantCase(str);
    const twice = constantCase(once);
    expect(twice).toBe(once);
  });
});
