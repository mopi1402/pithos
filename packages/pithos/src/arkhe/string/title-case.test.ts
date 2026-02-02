import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { titleCase } from "./title-case";

describe("titleCase", () => {
  it("capitalizes first letter of each word", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  it("handles uppercase input", () => {
    expect(titleCase("HELLO WORLD")).toBe("Hello World");
  });

  it("handles hyphenated words", () => {
    expect(titleCase("foo-bar-baz")).toBe("Foo-Bar-Baz");
  });

  it("handles underscored words", () => {
    expect(titleCase("foo_bar_baz")).toBe("Foo_Bar_Baz");
  });

  it("handles mixed separators", () => {
    expect(titleCase("foo-bar_baz qux")).toBe("Foo-Bar_Baz Qux");
  });

  it("handles accented characters", () => {
    expect(titleCase("éléphant àbricot")).toBe("Éléphant Àbricot");
  });

  it("handles single word", () => {
    expect(titleCase("hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(titleCase("")).toBe("");
  });

  it("handles single character", () => {
    expect(titleCase("a")).toBe("A");
  });

  it("[🎯] tests JSDoc example with Unicode", () => {
    expect(titleCase("café résumé")).toBe("Café Résumé");
  });

  it("[🎯] handles single character", () => {
    expect(titleCase("a")).toBe("A");
    expect(titleCase("A")).toBe("A");
  });

  itProp.prop([fc.string()])("[🎲] always returns same length string", (str) => {
    expect(titleCase(str)).toHaveLength(str.length);
  });

  itProp.prop([fc.string({ minLength: 1 })])("[🎲] first character is uppercase if alphabetic", (str) => {
    const result = titleCase(str);
    const firstChar = result[0];
    if (/[a-zA-Z]/i.test(firstChar)) {
      expect(firstChar).toBe(firstChar.toUpperCase());
    }
  });

  itProp.prop([fc.string()])("[🎲] idempotent: titleCase(titleCase(x)) === titleCase(x)", (str) => {
    const once = titleCase(str);
    const twice = titleCase(once);
    expect(twice).toBe(once);
  });
});
