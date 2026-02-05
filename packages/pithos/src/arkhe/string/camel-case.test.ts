import { describe, expect, it } from "vitest";
import { fc, it as itProp } from "@fast-check/vitest";
import { camelCase } from "./camel-case";

describe("camelCase", () => {
  it("converts kebab-case", () => {
    expect(camelCase("background-color")).toBe("backgroundColor");
  });

  it("converts snake_case", () => {
    expect(camelCase("font_size")).toBe("fontSize");
  });

  it("converts space-separated strings", () => {
    expect(camelCase("Hello World")).toBe("helloWorld");
  });

  it("converts PascalCase", () => {
    expect(camelCase("PascalCase")).toBe("pascalCase");
  });

  it("handles acronyms", () => {
    expect(camelCase("HTTPRequest")).toBe("httprequest");
  });

  it("handles multiple consecutive separators", () => {
    expect(camelCase("--foo--bar--")).toBe("fooBar");
  });

  it("[🎯] returns empty string for empty input", () => {
    expect(camelCase("")).toBe("");
  });

  it("[🎯] handles single character", () => {
    expect(camelCase("A")).toBe("a");
    expect(camelCase("a")).toBe("a");
  });

  it("[🎯] handles Unicode whitespace in range U+2000–U+200A", () => {
    // U+2002 = EN SPACE (charCode 8194, within 8192–8202)
    expect(camelCase("foo\u2002bar")).toBe("fooBar");
  });

  it("[🎯] Unicode whitespace at start does not trigger wordStart", () => {
    expect(camelCase("\u2002foo")).toBe("foo");
  });

  it("[👾] handles NBSP (U+00A0, code 160) as separator", () => {
    expect(camelCase("foo\u00A0bar")).toBe("fooBar");
  });

  it("[👾] handles Ogham space (U+1680, code 5760) as separator", () => {
    expect(camelCase("foo\u1680bar")).toBe("fooBar");
  });

  it("[👾] handles EN QUAD (U+2000, code 8192) as separator", () => {
    expect(camelCase("foo\u2000bar")).toBe("fooBar");
  });

  it("[👾] handles HAIR SPACE (U+200A, code 8202) as separator", () => {
    expect(camelCase("foo\u200Abar")).toBe("fooBar");
  });

  it("[👾] handles LINE SEPARATOR (U+2028, code 8232) as separator", () => {
    expect(camelCase("foo\u2028bar")).toBe("fooBar");
  });

  it("[👾] handles PARAGRAPH SEPARATOR (U+2029, code 8233) as separator", () => {
    expect(camelCase("foo\u2029bar")).toBe("fooBar");
  });

  it("[👾] handles NARROW NO-BREAK SPACE (U+202F, code 8239) as separator", () => {
    expect(camelCase("foo\u202Fbar")).toBe("fooBar");
  });

  it("[👾] handles MEDIUM MATHEMATICAL SPACE (U+205F, code 8287) as separator", () => {
    expect(camelCase("foo\u205Fbar")).toBe("fooBar");
  });

  it("[👾] handles IDEOGRAPHIC SPACE (U+3000, code 12288) as separator", () => {
    expect(camelCase("foo\u3000bar")).toBe("fooBar");
  });

  it("[👾] handles BOM (U+FEFF, code 65279) as separator", () => {
    expect(camelCase("foo\uFEFFbar")).toBe("fooBar");
  });

  it("[👾] uppercase Z (code 90) is lowercased as first char", () => {
    expect(camelCase("Zoo")).toBe("zoo");
  });

  it("[👾] uppercase A (code 65) detected as prev uppercase for continuation", () => {
    // "AZ" → 'A' first output lowercase 'a', 'Z' prev is 'A'(65) → continuation → lowercase 'z'
    expect(camelCase("AZ")).toBe("az");
  });

  it("[👾] uppercase Z (code 90) detected as prev uppercase for continuation", () => {
    // "ZA" → 'Z' first output lowercase 'z', 'A' prev is 'Z'(90) → continuation → lowercase 'a'
    expect(camelCase("ZA")).toBe("za");
  });

  it("[👾] hasOutput tracks uppercase-only first output for word boundaries", () => {
    // "ABC DEF" → without hasOutput bug: "abcDef"
    expect(camelCase("ABC DEF")).toBe("abcDef");
  });

  it("[👾] lowercase a (code 97) is handled as lowercase", () => {
    expect(camelCase("test-a")).toBe("testA");
  });

  it("[👾] lowercase z (code 122) is handled as lowercase", () => {
    expect(camelCase("test-z")).toBe("testZ");
  });

  it("[👾] digits are preserved in output", () => {
    expect(camelCase("foo-123-bar")).toBe("foo123Bar");
    expect(camelCase("test2go")).toBe("test2go");
  });

  it("[👾] digit sets hasOutput so separator triggers wordStart", () => {
    // If digit branch is emptied: "1" not output, hasOutput stays false,
    // "-" doesn't set wordStart, "b" stays lowercase → "b" instead of "1B"
    expect(camelCase("1-b")).toBe("1B");
  });

  it("[👾] chars above U+200A but below U+2028 are not treated as separators", () => {
    // U+200B (8203) is ZERO WIDTH SPACE — NOT in the 8192-8202 range
    // If code <= 8202 mutates to true, this char would be wrongly treated as separator
    expect(camelCase("foo\u200Bbar")).toBe("foo\u200Bbar");
  });

  it("[👾] chars above code 122 are not treated as lowercase letters", () => {
    // '{' has code 123, just above 'z' (122)
    // If code <= 122 mutates to true, '{' enters lowercase branch and gets
    // uppercased at word boundary: fromCharCode(123-32) = '[' instead of '{'
    expect(camelCase("foo-{")).toBe("foo{");
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof camelCase(str)).toBe("string");
  });

  itProp.prop([fc.string()])(
    "[🎲] result never starts with uppercase",
    (str) => {
      const result = camelCase(str);
      if (result.length > 0) {
        expect(result[0]).toBe(result[0]?.toLowerCase());
      }
    }
  );

  itProp.prop([fc.string()])("[🎲] result contains no separators", (str) => {
    const result = camelCase(str);
    expect(result).not.toMatch(/[_\-\s]/);
  });
});
