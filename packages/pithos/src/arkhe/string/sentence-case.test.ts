import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { sentenceCase } from "./sentence-case";

describe("sentenceCase", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(sentenceCase("hello world")).toBe("Hello world");
  });

  it("converts all uppercase", () => {
    expect(sentenceCase("HELLO WORLD")).toBe("Hello world");
  });

  it("handles single character", () => {
    expect(sentenceCase("a")).toBe("A");
  });

  it("handles empty string", () => {
    expect(sentenceCase("")).toBe("");
  });

  it("handles mixed case", () => {
    expect(sentenceCase("hELLO wORLD")).toBe("Hello world");
  });

  it("[🎯] handles single character", () => {
    expect(sentenceCase("a")).toBe("A");
    expect(sentenceCase("A")).toBe("A");
  });

  it("[🎯] handles Unicode characters", () => {
    expect(sentenceCase("éTÉ")).toBe("Été");
    expect(sentenceCase("МОСКВА")).toBe("Москва");
  });

  itProp.prop([fc.string()])("[🎲] always returns same length string", (str) => {
    expect(sentenceCase(str)).toHaveLength(str.length);
  });

  itProp.prop([fc.string({ minLength: 1 })])("[🎲] first character is uppercase if alphabetic", (str) => {
    const result = sentenceCase(str);
    const firstChar = result[0];
    if (/[a-zA-Z]/i.test(firstChar)) {
      expect(firstChar).toBe(firstChar.toUpperCase());
    }
  });

  itProp.prop([fc.string()])("[🎲] idempotent: sentenceCase(sentenceCase(x)) === sentenceCase(x)", (str) => {
    const once = sentenceCase(str);
    const twice = sentenceCase(once);
    expect(twice).toBe(once);
  });
});
