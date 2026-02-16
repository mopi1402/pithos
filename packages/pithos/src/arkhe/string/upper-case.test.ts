import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { upperCase } from "./upper-case";

describe("upperCase", () => {
  it("converts to upper case with spaces", () => {
    expect(upperCase("--Foo-Bar--")).toBe("FOO BAR");
  });

  it("handles camelCase", () => {
    expect(upperCase("fooBar")).toBe("FOO BAR");
  });

  it("handles snake_case", () => {
    expect(upperCase("__foo_bar__")).toBe("FOO BAR");
  });

  it("handles string starting with uppercase", () => {
    expect(upperCase("Foo")).toBe("FOO");
    expect(upperCase("FooBar")).toBe("FOO BAR");
  });

  it("[🎯] returns empty string for null", () => {
    expect(upperCase(null)).toBe("");
  });

  it("[🎯] returns empty string for undefined", () => {
    expect(upperCase(undefined)).toBe("");
  });

  it("[🎯] returns empty string for empty string", () => {
    expect(upperCase("")).toBe("");
  });

  it("returns empty string for separator-only strings", () => {
    expect(upperCase("---___   ")).toBe("");
    expect(upperCase("_".repeat(200))).toBe("");
  });

  it("handles short Unicode/emoji strings (charCode fallback)", () => {
    expect(upperCase("hello🚀World")).toBe("HELLO 🚀 WORLD");
    expect(upperCase("café_résumé")).toBe("CAFÉ RÉSUMÉ");
    expect(upperCase("🎉")).toBe("🎉");
  });

  it("handles acronym at start of string", () => {
    expect(upperCase("HTTPRequest")).toBe("HTTP REQUEST");
    expect(upperCase("XMLParser")).toBe("XML PARSER");
  });

  it("handles long ASCII strings (regex path)", () => {
    const long = "camelCaseLongString".repeat(10);
    const result = upperCase(long);
    expect(result).toContain("CAMEL CASE LONG STRING");
    expect(result).toBe(result.toUpperCase());
  });

  it("handles long Unicode strings (regex path)", () => {
    const long = "héllo🚀Wörld_FOO-bàr ".repeat(10);
    const result = upperCase(long);
    expect(result).toBe(result.toUpperCase());
  });

  it("[👾] boundary chars: digits are kept as words", () => {
    expect(upperCase("foo123bar")).toBe("FOO123BAR");
    expect(upperCase("test0value")).toBe("TEST0VALUE");
    expect(upperCase("FOO123")).toBe("FOO 123");
    expect(upperCase("HTTP2")).toBe("HTTP 2");
  });

  it("[👾] boundary chars: separators at ASCII boundaries", () => {
    expect(upperCase("foo/bar")).toBe("FOO BAR");
    expect(upperCase("foo:bar")).toBe("FOO BAR");
    expect(upperCase("foo@bar")).toBe("FOO BAR");
    expect(upperCase("foo[bar")).toBe("FOO BAR");
    expect(upperCase("foo`bar")).toBe("FOO BAR");
    expect(upperCase("foo{bar")).toBe("FOO BAR");
    expect(upperCase("foo~bar")).toBe("FOO BAR");
  });

  it("[👾] boundary chars: 'A' (65) and 'Z' (90) are uppercase", () => {
    expect(upperCase("ATest")).toBe("A TEST");
    expect(upperCase("ZTest")).toBe("Z TEST");
    expect(upperCase("AZ")).toBe("AZ");
  });

  it("[👾] boundary chars: 'a' (97) and 'z' (122) are lowercase", () => {
    expect(upperCase("testA")).toBe("TEST A");
    expect(upperCase("az")).toBe("AZ");
    expect(upperCase("Faz")).toBe("FAZ");
  });

  it("[👾] acronym with digits: HTTP2Request", () => {
    expect(upperCase("HTTP2Request")).toBe("HTTP 2 REQUEST");
    expect(upperCase("ABC123DEF")).toBe("ABC 123 DEF");
  });

  it("[👾] words separated by spaces in output", () => {
    expect(upperCase("fooBar")).not.toBe("FOOBAR");
    expect(upperCase("FooBar")).toBe("FOO BAR");
    expect(upperCase("FOO_BAR_BAZ")).toBe("FOO BAR BAZ");
  });

  it("[👾] pure uppercase string at end", () => {
    expect(upperCase("testABC")).toBe("TEST ABC");
    expect(upperCase("ABC")).toBe("ABC");
  });

  it("[👾] single lowercase word", () => {
    expect(upperCase("hello")).toBe("HELLO");
  });

  it("[👾] string at exactly threshold length uses charCode path", () => {
    const atThreshold = "a".repeat(128);
    expect(upperCase(atThreshold)).toBe("A".repeat(128));
  });

  it("[👾] acronym NOT at start: space separator before acronym split", () => {
    expect(upperCase("fooHTTPBar")).toBe("FOO HTTP BAR");
    expect(upperCase("myXMLParser")).toBe("MY XML PARSER");
  });

  it("[👾] word ending with 'z' (122) boundary", () => {
    expect(upperCase("Buzz")).toBe("BUZZ");
    expect(upperCase("fooBarBaz")).toBe("FOO BAR BAZ");
    expect(upperCase("HTTPaz")).toBe("HTT PAZ");
  });

  it("[👾] word ending with 'a' (97) boundary", () => {
    expect(upperCase("HTTPa")).toBe("HTT PA");
    expect(upperCase("Fa")).toBe("FA");
    expect(upperCase("fooBarBa")).toBe("FOO BAR BA");
  });

  it("[👾] word with digit '0' (48) boundary", () => {
    expect(upperCase("foo0")).toBe("FOO0");
    expect(upperCase("Foo0")).toBe("FOO0");
    expect(upperCase("HTTP0s")).toBe("HTTP 0S");
  });

  it("[👾] word with digit '9' (57) boundary", () => {
    expect(upperCase("foo9")).toBe("FOO9");
    expect(upperCase("Foo9")).toBe("FOO9");
    expect(upperCase("HTTP9s")).toBe("HTTP 9S");
  });

  it("[👾] lowercase word followed by separator then more words", () => {
    expect(upperCase("foo-bar-baz")).toBe("FOO BAR BAZ");
    expect(upperCase("abc_def")).toBe("ABC DEF");
  });

  it("[👾] uppercase block at end after lowercase word", () => {
    expect(upperCase("fooABC")).toBe("FOO ABC");
    expect(upperCase("testXY")).toBe("TEST XY");
  });

  it("[👾] single uppercase letter word", () => {
    expect(upperCase("A")).toBe("A");
    expect(upperCase("Z")).toBe("Z");
  });

  it("[👾] mixed: lowercase digits then uppercase", () => {
    expect(upperCase("abc9Z")).toBe("ABC9 Z");
    expect(upperCase("test0ABC")).toBe("TEST0 ABC");
  });

  it("[👾] acronym followed by 'z' (122) as first lowercase", () => {
    expect(upperCase("HTTPz")).toBe("HTT PZ");
    expect(upperCase("ABCz")).toBe("AB CZ");
  });

  it("[👾] acronym+lower continuation: 'a' (97) boundary in while", () => {
    expect(upperCase("HTTPba")).toBe("HTT PBA");
    expect(upperCase("ABCda")).toBe("AB CDA");
  });

  it("[👾] acronym+lower continuation: 'z' (122) boundary in while", () => {
    expect(upperCase("HTTPbz")).toBe("HTT PBZ");
  });

  it("[👾] acronym+lower continuation: digit '0' (48) boundary in while", () => {
    expect(upperCase("HTTPb0")).toBe("HTT PB0");
  });

  it("[👾] acronym+lower continuation: digit '9' (57) boundary in while", () => {
    expect(upperCase("HTTPb9")).toBe("HTT PB9");
  });

  it("[👾] single-upper+lower continuation: 'a' (97) boundary in while", () => {
    expect(upperCase("Fba")).toBe("FBA");
    expect(upperCase("Xba")).toBe("XBA");
  });

  it("[👾] single-upper+lower continuation: 'z' (122) boundary in while", () => {
    expect(upperCase("Fbz")).toBe("FBZ");
  });

  it("[👾] single-upper+lower continuation: digit '0' (48) boundary in while", () => {
    expect(upperCase("Fb0")).toBe("FB0");
  });

  it("[👾] single-upper+lower continuation: digit '9' (57) boundary in while", () => {
    expect(upperCase("Fb9")).toBe("FB9");
  });

  it("[👾] acronym+lower continuation stops at separator", () => {
    expect(upperCase("HTTPba-x")).toBe("HTT PBA X");
    expect(upperCase("HTTPba_y")).toBe("HTT PBA Y");
    expect(upperCase("HTTPba.z")).toBe("HTT PBA Z");
  });

  it("[👾] acronym+lower continuation stops at char > 122", () => {
    expect(upperCase("HTTPba~x")).toBe("HTT PBA X");
    expect(upperCase("HTTPba{x")).toBe("HTT PBA X");
  });

  it("[👾] single-upper+lower continuation stops at char > 122", () => {
    expect(upperCase("Fb~x")).toBe("FB X");
    expect(upperCase("Fb{x")).toBe("FB X");
  });

  it("returns empty string for separator-only long strings (regex path)", () => {
    expect(upperCase("_".repeat(200))).toBe("");
  });

  itProp.prop([fc.string()])("[🎲] result contains only uppercase letters", (str) => {
    const result = upperCase(str);
    expect(result).toBe(result.toUpperCase());
  });

  itProp.prop([fc.stringMatching(/^[a-z ]+$/)])("[🎲] idempotent for already-formatted strings", (str) => {
    const once = upperCase(str);
    const twice = upperCase(once);
    expect(once).toBe(twice);
  });
});
