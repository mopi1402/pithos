import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lowerCase } from "./lower-case";

describe("lowerCase", () => {
  it("converts to lower case with spaces", () => {
    expect(lowerCase("--Foo-Bar--")).toBe("foo bar");
  });

  it("handles camelCase", () => {
    expect(lowerCase("fooBar")).toBe("foo bar");
  });

  it("handles snake_case", () => {
    expect(lowerCase("__FOO_BAR__")).toBe("foo bar");
  });

  it("handles string starting with uppercase", () => {
    expect(lowerCase("Foo")).toBe("foo");
    expect(lowerCase("FooBar")).toBe("foo bar");
  });

  it("[🎯] returns empty string for null", () => {
    expect(lowerCase(null)).toBe("");
  });

  it("[🎯] returns empty string for undefined", () => {
    expect(lowerCase(undefined)).toBe("");
  });

  it("[🎯] returns empty string for empty string", () => {
    expect(lowerCase("")).toBe("");
  });

  it("returns empty string for separator-only strings", () => {
    expect(lowerCase("---___   ")).toBe("");
    expect(lowerCase("_".repeat(200))).toBe("");
  });

  it("handles short Unicode/emoji strings (charCode fallback)", () => {
    expect(lowerCase("hello🚀World")).toBe("hello 🚀 world");
    expect(lowerCase("café_résumé")).toBe("café résumé");
    expect(lowerCase("🎉")).toBe("🎉");
  });

  it("handles acronym at start of string", () => {
    expect(lowerCase("HTTPRequest")).toBe("http request");
    expect(lowerCase("XMLParser")).toBe("xml parser");
  });

  it("handles long ASCII strings (regex path)", () => {
    const long = "camelCaseLongString".repeat(10);
    const result = lowerCase(long);
    expect(result).toContain("camel case long string");
    expect(result).toBe(result.toLowerCase());
  });

  it("handles long Unicode strings (regex path)", () => {
    const long = "héllo🚀Wörld_FOO-bàr ".repeat(10);
    const result = lowerCase(long);
    expect(result).toBe(result.toLowerCase());
  });

  it("[👾] boundary chars: digits are kept as words", () => {
    // Digits continue the current word in charCode path
    expect(lowerCase("foo123bar")).toBe("foo123bar");
    expect(lowerCase("test0value")).toBe("test0value");
    // Digits after uppercase are separate
    expect(lowerCase("FOO123")).toBe("foo 123");
    expect(lowerCase("HTTP2")).toBe("http 2");
  });

  it("[👾] boundary chars: separators at ASCII boundaries", () => {
    // '/' is 47 (last char in <= 47 range)
    expect(lowerCase("foo/bar")).toBe("foo bar");
    // ':' is 58, '@' is 64 (range 58-64)
    expect(lowerCase("foo:bar")).toBe("foo bar");
    expect(lowerCase("foo@bar")).toBe("foo bar");
    // '[' is 91, '`' is 96 (range 91-96)
    expect(lowerCase("foo[bar")).toBe("foo bar");
    expect(lowerCase("foo`bar")).toBe("foo bar");
    // '{' is 123 (>= 123 range)
    expect(lowerCase("foo{bar")).toBe("foo bar");
    expect(lowerCase("foo~bar")).toBe("foo bar");
  });

  it("[👾] boundary chars: 'A' (65) and 'Z' (90) are uppercase", () => {
    expect(lowerCase("ATest")).toBe("a test");
    expect(lowerCase("ZTest")).toBe("z test");
    expect(lowerCase("AZ")).toBe("az");
  });

  it("[👾] boundary chars: 'a' (97) and 'z' (122) are lowercase", () => {
    expect(lowerCase("testA")).toBe("test a");
    expect(lowerCase("az")).toBe("az");
    expect(lowerCase("Faz")).toBe("faz");
  });

  it("[👾] acronym with digits: HTTP2Request", () => {
    expect(lowerCase("HTTP2Request")).toBe("http 2 request");
    expect(lowerCase("ABC123DEF")).toBe("abc 123 def");
  });

  it("[👾] words separated by spaces in output", () => {
    expect(lowerCase("fooBar")).not.toBe("foobar");
    expect(lowerCase("FooBar")).toBe("foo bar");
    expect(lowerCase("FOO_BAR_BAZ")).toBe("foo bar baz");
  });

  it("[👾] pure uppercase string at end", () => {
    expect(lowerCase("testABC")).toBe("test abc");
    expect(lowerCase("ABC")).toBe("abc");
  });

  it("[👾] single lowercase word", () => {
    expect(lowerCase("hello")).toBe("hello");
  });

  it("[👾] string at exactly threshold length uses charCode path", () => {
    // 128 chars = exactly at threshold, should use charCode path
    const atThreshold = "a".repeat(128);
    expect(lowerCase(atThreshold)).toBe("a".repeat(128));
  });

  it("[👾] acronym NOT at start: space separator before acronym split", () => {
    // Kills line 67: result += " " → result += ""
    expect(lowerCase("fooHTTPBar")).toBe("foo http bar");
    expect(lowerCase("myXMLParser")).toBe("my xml parser");
  });

  it("[👾] word ending with 'z' (122) boundary", () => {
    // Kills nc <= 122 → nc <= 121 (would exclude 'z' from word)
    expect(lowerCase("Buzz")).toBe("buzz");
    expect(lowerCase("fooBarBaz")).toBe("foo bar baz");
    expect(lowerCase("HTTPaz")).toBe("htt paz");
  });

  it("[👾] word ending with 'a' (97) boundary", () => {
    // Kills nc >= 97 → nc >= 98 (would exclude 'a' from word)
    expect(lowerCase("HTTPa")).toBe("htt pa");
    expect(lowerCase("Fa")).toBe("fa");
    expect(lowerCase("fooBarBa")).toBe("foo bar ba");
  });

  it("[👾] word with digit '0' (48) boundary", () => {
    // Kills nc >= 48 → nc >= 49 (would exclude '0' from word)
    expect(lowerCase("foo0")).toBe("foo0");
    expect(lowerCase("Foo0")).toBe("foo0");
    expect(lowerCase("HTTP0s")).toBe("http 0s");
  });

  it("[👾] word with digit '9' (57) boundary", () => {
    // Kills nc <= 57 → nc <= 56 (would exclude '9' from word)
    expect(lowerCase("foo9")).toBe("foo9");
    expect(lowerCase("Foo9")).toBe("foo9");
    expect(lowerCase("HTTP9s")).toBe("http 9s");
  });

  it("[👾] lowercase word followed by separator then more words", () => {
    // Kills line 99: result += " " → result += "" in else (lowercase-start) branch
    expect(lowerCase("foo-bar-baz")).toBe("foo bar baz");
    expect(lowerCase("abc_def")).toBe("abc def");
  });

  it("[👾] uppercase block at end after lowercase word", () => {
    // Kills space separator in pure-uppercase-at-end branch (line 89)
    expect(lowerCase("fooABC")).toBe("foo abc");
    expect(lowerCase("testXY")).toBe("test xy");
  });

  it("[👾] single uppercase letter word", () => {
    expect(lowerCase("A")).toBe("a");
    expect(lowerCase("Z")).toBe("z");
  });

  it("[👾] mixed: lowercase digits then uppercase", () => {
    // Tests digit continuation in lowercase-start path then transition
    expect(lowerCase("abc9Z")).toBe("abc9 z");
    expect(lowerCase("test0ABC")).toBe("test0 abc");
  });

  it("[👾] acronym followed by 'z' (122) as first lowercase", () => {
    // Kills line 71: <= 122 → < 122 (would miss 'z' as lowercase trigger)
    expect(lowerCase("HTTPz")).toBe("htt pz");
    expect(lowerCase("ABCz")).toBe("ab cz");
  });

  it("[👾] acronym+lower continuation: 'a' (97) boundary in while", () => {
    // Kills line 80: nc >= 97 → nc > 97 (would exclude 'a' from word continuation)
    expect(lowerCase("HTTPba")).toBe("htt pba");
    expect(lowerCase("ABCda")).toBe("ab cda");
  });

  it("[👾] acronym+lower continuation: 'z' (122) boundary in while", () => {
    // Kills line 80: nc <= 122 → nc < 122 (would exclude 'z' from word continuation)
    expect(lowerCase("HTTPbz")).toBe("htt pbz");
  });

  it("[👾] acronym+lower continuation: digit '0' (48) boundary in while", () => {
    // Kills line 80: nc >= 48 → nc > 48 (would exclude '0' from word continuation)
    expect(lowerCase("HTTPb0")).toBe("htt pb0");
  });

  it("[👾] acronym+lower continuation: digit '9' (57) boundary in while", () => {
    // Kills line 80: nc <= 57 → nc < 57 (would exclude '9' from word continuation)
    expect(lowerCase("HTTPb9")).toBe("htt pb9");
  });

  it("[👾] single-upper+lower continuation: 'a' (97) boundary in while", () => {
    // Kills line 89: nc >= 97 → nc > 97 (would exclude 'a' from word continuation)
    expect(lowerCase("Fba")).toBe("fba");
    expect(lowerCase("Xba")).toBe("xba");
  });

  it("[👾] single-upper+lower continuation: 'z' (122) boundary in while", () => {
    // Kills line 89: nc <= 122 → nc < 122 (would exclude 'z' from word continuation)
    expect(lowerCase("Fbz")).toBe("fbz");
  });

  it("[👾] single-upper+lower continuation: digit '0' (48) boundary in while", () => {
    // Kills line 89: nc >= 48 → nc > 48 (would exclude '0' from word continuation)
    expect(lowerCase("Fb0")).toBe("fb0");
  });

  it("[👾] single-upper+lower continuation: digit '9' (57) boundary in while", () => {
    // Kills line 89: nc <= 57 → nc < 57 (would exclude '9' from word continuation)
    expect(lowerCase("Fb9")).toBe("fb9");
  });

  it("[👾] acronym+lower continuation stops at separator", () => {
    // Kills line 80: true/||/&& mutations that would not stop at separators
    expect(lowerCase("HTTPba-x")).toBe("htt pba x");
    expect(lowerCase("HTTPba_y")).toBe("htt pba y");
    expect(lowerCase("HTTPba.z")).toBe("htt pba z");
  });

  it("[👾] acronym+lower continuation stops at char > 122", () => {
    // Kills line 80: nc >= 97 && true / nc <= 122 → true (would include chars 123-127)
    expect(lowerCase("HTTPba~x")).toBe("htt pba x");
    expect(lowerCase("HTTPba{x")).toBe("htt pba x");
  });

  it("[👾] single-upper+lower continuation stops at char > 122", () => {
    // Kills line 89: nc >= 97 && true (would include chars 123-127 like ~, {, |)
    expect(lowerCase("Fb~x")).toBe("fb x");
    expect(lowerCase("Fb{x")).toBe("fb x");
  });

  itProp.prop([fc.string()])("[🎲] result contains only lowercase letters", (str) => {
    const result = lowerCase(str);
    expect(result).toBe(result.toLowerCase());
  });

  itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
    const once = lowerCase(str);
    const twice = lowerCase(once);
    expect(once).toBe(twice);
  });
});
