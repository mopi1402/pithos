import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniqWith } from "./uniq-with";

describe("uniqWith", () => {
  it("removes duplicates with strict equality", () => {
    expect(uniqWith("aabbcc", (a, b) => a === b)).toBe("abc");
  });

  it("removes case-insensitive duplicates", () => {
    expect(
      uniqWith("AaBbCc", (a, b) => a.toLowerCase() === b.toLowerCase())
    ).toBe("ABC");
  });

  it("keeps first occurrence", () => {
    expect(uniqWith("abcabc", (a, b) => a === b)).toBe("abc");
  });

  it("handles empty string", () => {
    expect(uniqWith("", (a, b) => a === b)).toBe("");
  });

  it("handles no duplicates", () => {
    expect(uniqWith("abc", (a, b) => a === b)).toBe("abc");
  });

  it("handles all same characters", () => {
    expect(uniqWith("aaaa", (a, b) => a === b)).toBe("a");
  });

  it("uses custom comparator", () => {
    // Treat vowels as equal
    const isVowel = (c: string) => "aeiou".includes(c);
    expect(uniqWith("aeioux", (a, b) => isVowel(a) && isVowel(b))).toBe("ax");
  });

  it("[🎯] tests JSDoc example with strict equality", () => {
    expect(uniqWith("hello", (a, b) => a === b)).toBe("helo");
  });

  it("[🎯] tests JSDoc example with whitespace dedup", () => {
    expect(
      uniqWith("hello   world", (a, b) => /\s/.test(a) && /\s/.test(b))
    ).toBe("hello world");
  });

  it("[🎯] tests JSDoc example with case-insensitive", () => {
    expect(
      uniqWith("Hello", (a, b) => a.toLowerCase() === b.toLowerCase())
    ).toBe("Helo");
  });

  it("[🎯] handles single character", () => {
    expect(uniqWith("a", (a, b) => a === b)).toBe("a");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof uniqWith(str, (a, b) => a === b)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result length is <= input length", (str) => {
    const result = uniqWith(str, (a, b) => a === b);
    expect(result.length).toBeLessThanOrEqual(str.length);
  });

  itProp.prop([fc.string()])("[🎲] result has no duplicates with strict equality", (str) => {
    const result = uniqWith(str, (a, b) => a === b);
    const chars = [...result];
    const uniqueChars = new Set(chars);
    expect(chars.length).toBe(uniqueChars.size);
  });

  itProp.prop([fc.string()])("[🎲] idempotent: uniqWith(uniqWith(x)) === uniqWith(x)", (str) => {
    const comparator = (a: string, b: string) => a === b;
    const once = uniqWith(str, comparator);
    const twice = uniqWith(once, comparator);
    expect(twice).toBe(once);
  });
});
