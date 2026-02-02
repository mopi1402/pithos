import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { words } from "./words";

describe("words", () => {
  it("splits string into words", () => {
    expect(words("fred, barney, & pebbles")).toEqual([
      "fred",
      "barney",
      "pebbles",
    ]);
  });

  it("supports custom pattern", () => {
    expect(words("fred, barney, & pebbles", /[^, ]+/g)).toEqual([
      "fred",
      "barney",
      "&",
      "pebbles",
    ]);
  });

  it("handles camelCase", () => {
    expect(words("camelCase")).toEqual(["camel", "Case"]);
  });

  it("handles PascalCase", () => {
    expect(words("PascalCase")).toEqual(["Pascal", "Case"]);
  });

  it("handles snake_case", () => {
    expect(words("snake_case")).toEqual(["snake", "case"]);
  });

  it("handles kebab-case", () => {
    expect(words("kebab-case")).toEqual(["kebab", "case"]);
  });

  it("handles XMLHttpRequest style", () => {
    expect(words("XMLHttpRequest")).toEqual(["XML", "Http", "Request"]);
  });

  it("returns empty array for empty string", () => {
    expect(words("")).toEqual([]);
  });

  it("handles numbers", () => {
    expect(words("version123")).toEqual(["version", "123"]);
  });

  it("handles string pattern", () => {
    expect(words("a-b-c", "-")).toEqual(["-", "-"]);
  });

  it("handles pattern without global flag", () => {
    expect(words("one two three", / /)).toEqual([" ", " "]);
  });

  it("handles single word", () => {
    expect(words("hello")).toEqual(["hello"]);
  });

  it("handles uppercase string", () => {
    expect(words("HELLO")).toEqual(["HELLO"]);
  });

  it("handles mixed case with numbers", () => {
    expect(words("iPhone12Pro")).toEqual(["i", "Phone", "12", "Pro"]);
  });

  it("returns empty array when custom pattern has no match", () => {
    expect(words("hello", /xyz/)).toEqual([]);
  });

  it("returns empty array for string with only special characters", () => {
    expect(words("---")).toEqual([]);
    expect(words("!@#$%")).toEqual([]);
    expect(words("   ")).toEqual([]);
  });

  it("[🎯] tests JSDoc example with fred, barney, & pebbles", () => {
    expect(words("fred, barney, & pebbles")).toEqual([
      "fred",
      "barney",
      "pebbles",
    ]);
  });

  it("[🎯] tests JSDoc example with custom pattern including &", () => {
    expect(words("fred, barney, & pebbles", /[^, ]+/g)).toEqual([
      "fred",
      "barney",
      "&",
      "pebbles",
    ]);
  });

  it("[🎯] handles single character", () => {
    expect(words("a")).toEqual(["a"]);
    expect(words("A")).toEqual(["A"]);
  });

  it("[🎯] differentiates string pattern from regex pattern", () => {
    // String pattern is converted to regex - "." matches any char
    // Regex pattern /\./ matches literal dot
    expect(words("a.b.c", ".")).toEqual(["a", ".", "b", ".", "c"]);
    expect(words("a.b.c", /\./g)).toEqual([".", "."]);
  });

  it("[👾] handles consecutive uppercase separated by numbers", () => {
    // Tests [A-Z]+ pattern - "AB" and "CD" should be matched as groups, not individual letters
    expect(words("AB1CD2")).toEqual(["AB", "1", "CD", "2"]);
  });

  itProp.prop([fc.string()])("[🎲] always returns an array", (str) => {
    expect(Array.isArray(words(str))).toBe(true);
  });

  itProp.prop([fc.string()])("[🎲] all elements are non-empty strings", (str) => {
    const result = words(str);
    result.forEach((word) => {
      expect(typeof word).toBe("string");
      expect(word.length).toBeGreaterThan(0);
    });
  });

  itProp.prop([fc.string()])("[🎲] total characters in words <= input length", (str) => {
    const result = words(str);
    const totalChars = result.reduce((sum, word) => sum + word.length, 0);
    expect(totalChars).toBeLessThanOrEqual(str.length);
  });
});
