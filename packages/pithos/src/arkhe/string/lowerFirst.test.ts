import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lowerFirst } from "./lowerFirst";

describe("lowerFirst", () => {
  it("lowercases first character", () => {
    expect(lowerFirst("Hello")).toBe("hello");
  });

  it("preserves rest of string", () => {
    expect(lowerFirst("HELLO")).toBe("hELLO");
  });

  it("handles single character", () => {
    expect(lowerFirst("A")).toBe("a");
  });

  it("handles empty string", () => {
    expect(lowerFirst("")).toBe("");
  });

  it("handles already lowercase", () => {
    expect(lowerFirst("hello")).toBe("hello");
  });

  it("[🎯] handles Unicode characters", () => {
    expect(lowerFirst("Été")).toBe("été");
    expect(lowerFirst("Москва")).toBe("москва");
  });

  it("[🎯] handles single character", () => {
    expect(lowerFirst("A")).toBe("a");
    expect(lowerFirst("a")).toBe("a");
  });

  itProp.prop([fc.string()])("[🎲] always returns same length string", (str) => {
    expect(lowerFirst(str)).toHaveLength(str.length);
  });

  itProp.prop([fc.string({ minLength: 1 })])("[🎲] first character is lowercase if alphabetic", (str) => {
    const result = lowerFirst(str);
    const firstChar = result[0];
    if (/[a-zA-Z]/i.test(firstChar)) {
      expect(firstChar).toBe(firstChar.toLowerCase());
    }
  });

  itProp.prop([fc.string({ minLength: 1 })])("[🎲] rest of string is unchanged", (str) => {
    const result = lowerFirst(str);
    expect(result.slice(1)).toBe(str.slice(1));
  });

  itProp.prop([fc.string()])("[🎲] idempotent: lowerFirst(lowerFirst(x)) === lowerFirst(x)", (str) => {
    const once = lowerFirst(str);
    const twice = lowerFirst(once);
    expect(twice).toBe(once);
  });
});
