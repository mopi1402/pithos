import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { kebabCase } from "./kebab-case";

describe("kebabCase", () => {
  it("converts camelCase", () => {
    expect(kebabCase("fooBarBaz")).toBe("foo-bar-baz");
  });

  it("converts PascalCase", () => {
    expect(kebabCase("FooBarBaz")).toBe("foo-bar-baz");
  });

  it("handles consecutive uppercase (acronyms)", () => {
    expect(kebabCase("parseHTMLString")).toBe("parse-html-string");
  });

  it("handles single word", () => {
    expect(kebabCase("foo")).toBe("foo");
  });

  it("handles empty string", () => {
    expect(kebabCase("")).toBe("");
  });

  it("handles numbers", () => {
    expect(kebabCase("foo2Bar")).toBe("foo2-bar");
  });

  it("handles all uppercase", () => {
    expect(kebabCase("HTML")).toBe("html");
  });

  it("[🎯] tests JSDoc example with spaces", () => {
    expect(kebabCase("hello world")).toBe("hello-world");
  });

  it("[🎯] tests JSDoc example with snake_case", () => {
    expect(kebabCase("foo_bar")).toBe("foo-bar");
  });

  it("[🎯] tests JSDoc example with multiple separators", () => {
    expect(kebabCase("--foo--bar--")).toBe("foo-bar");
  });

  it("[🎯] handles single character", () => {
    expect(kebabCase("a")).toBe("a");
    expect(kebabCase("A")).toBe("a");
  });

  it("[🎯] handles multiple leading hyphens", () => {
    expect(kebabCase("---foo")).toBe("foo");
  });

  it("[🎯] handles multiple trailing hyphens", () => {
    expect(kebabCase("foo---")).toBe("foo");
  });

  it("[🎯] handles acronym at start followed by word", () => {
    // Tests ([A-Z]+)([A-Z][a-z]) pattern - XMLParser should become xml-parser not xm-l-parser
    expect(kebabCase("XMLParser")).toBe("xml-parser");
    expect(kebabCase("HTMLElement")).toBe("html-element");
  });

  it("[👾] returns empty string when input has no matchable words", () => {
    expect(kebabCase("---")).toBe("");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof kebabCase(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result is lowercase", (str) => {
    const result = kebabCase(str);
    expect(result).toBe(result.toLowerCase());
  });

  itProp.prop([fc.string()])("[🎲] result contains no spaces or underscores", (str) => {
    const result = kebabCase(str);
    // Special characters may pass through, but separators are converted
    expect(result).not.toMatch(/[\s_]/);
  });

  itProp.prop([fc.string()])("[🎲] idempotent: kebabCase(kebabCase(x)) === kebabCase(x)", (str) => {
    const once = kebabCase(str);
    const twice = kebabCase(once);
    expect(twice).toBe(once);
  });
});
