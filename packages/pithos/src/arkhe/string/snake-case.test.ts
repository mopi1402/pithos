import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { snakeCase } from "./snake-case";

describe("snakeCase", () => {
  it("converts camelCase", () => {
    expect(snakeCase("fooBarBaz")).toBe("foo_bar_baz");
  });

  it("converts PascalCase", () => {
    expect(snakeCase("FooBarBaz")).toBe("foo_bar_baz");
  });

  it("handles consecutive uppercase (acronyms)", () => {
    expect(snakeCase("parseHTMLString")).toBe("parse_html_string");
  });

  it("handles single word", () => {
    expect(snakeCase("foo")).toBe("foo");
  });

  it("handles empty string", () => {
    expect(snakeCase("")).toBe("");
  });

  it("handles already lowercase", () => {
    expect(snakeCase("hello")).toBe("hello");
  });

  it("handles numbers", () => {
    expect(snakeCase("foo2Bar")).toBe("foo2_bar");
  });

  it("handles all uppercase", () => {
    expect(snakeCase("HTML")).toBe("html");
  });

  it("[🎯] tests JSDoc example with kebab-case", () => {
    expect(snakeCase("hello-world")).toBe("hello_world");
  });

  it("[🎯] tests JSDoc example with spaces", () => {
    expect(snakeCase("Hello World")).toBe("hello_world");
  });

  it("[🎯] tests JSDoc example with multiple separators", () => {
    expect(snakeCase("--foo--bar--")).toBe("foo_bar");
  });

  it("[🎯] handles single character", () => {
    expect(snakeCase("a")).toBe("a");
    expect(snakeCase("A")).toBe("a");
  });

  it("[🎯] handles multiple leading underscores", () => {
    expect(snakeCase("___foo")).toBe("foo");
  });

  it("[🎯] handles multiple trailing underscores", () => {
    expect(snakeCase("foo___")).toBe("foo");
  });

  it("[🎯] handles acronym at start followed by word", () => {
    // Tests ([A-Z]+)([A-Z][a-z]) pattern - XMLParser should become xml_parser not xm_l_parser
    expect(snakeCase("XMLParser")).toBe("xml_parser");
    expect(snakeCase("HTMLElement")).toBe("html_element");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof snakeCase(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result is lowercase", (str) => {
    const result = snakeCase(str);
    expect(result).toBe(result.toLowerCase());
  });

  itProp.prop([fc.string()])("[🎲] result contains no spaces or hyphens", (str) => {
    const result = snakeCase(str);
    // Special characters may pass through, but separators are converted
    expect(result).not.toMatch(/[\s-]/);
  });

  itProp.prop([fc.string()])("[🎲] idempotent: snakeCase(snakeCase(x)) === snakeCase(x)", (str) => {
    const once = snakeCase(str);
    const twice = snakeCase(once);
    expect(twice).toBe(once);
  });

  it("[👾] returns empty string when input has no matchable words", () => {
    expect(snakeCase("---")).toBe("");
  });
});
