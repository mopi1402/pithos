import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parseKeyValuePairs } from "./parse-key-value-pairs";

describe("parseKeyValuePairs", () => {
  it("parses simple pairs", () => {
    expect(parseKeyValuePairs("a=1,b=2")).toEqual({ a: "1", b: "2" });
  });

  it("trims whitespace", () => {
    expect(parseKeyValuePairs(" a = 1 , b = 2 ")).toEqual({ a: "1", b: "2" });
  });

  it("uses custom separators", () => {
    expect(parseKeyValuePairs("a:1;b:2", ";", ":")).toEqual({ a: "1", b: "2" });
  });

  it("handles empty input", () => {
    expect(parseKeyValuePairs("")).toEqual({});
  });

  it("handles undefined input", () => {
    expect(parseKeyValuePairs()).toEqual({});
  });

  it("filters out entries without value", () => {
    expect(parseKeyValuePairs("a=1,b=,c=3")).toEqual({ a: "1", c: "3" });
  });

  it("filters out entries without key", () => {
    expect(parseKeyValuePairs("a=1,=2,c=3")).toEqual({ a: "1", c: "3" });
  });

  it("handles single pair", () => {
    expect(parseKeyValuePairs("a=1")).toEqual({ a: "1" });
  });

  it("last value wins for duplicate keys", () => {
    expect(parseKeyValuePairs("a=1,a=2")).toEqual({ a: "2" });
  });

  it("[🎯] default pairSeparator is ','", () => {
    expect(parseKeyValuePairs("a=1,b=2")).toEqual({ a: "1", b: "2" });
  });

  it("[🎯] default keyValueSeparator is '='", () => {
    expect(parseKeyValuePairs("a=1,b=2")).toEqual({ a: "1", b: "2" });
  });

  it("[🎯] tests JSDoc example with & separator", () => {
    expect(parseKeyValuePairs("key=value&other=data", "&")).toEqual({
      key: "value",
      other: "data",
    });
  });

  it("[🎯] handles single character key and value", () => {
    expect(parseKeyValuePairs("a=b")).toEqual({ a: "b" });
  });

  itProp.prop([fc.string()])("[🎲] always returns an object", (str) => {
    const result = parseKeyValuePairs(str);
    expect(typeof result).toBe("object");
    expect(result).not.toBeNull();
  });

  itProp.prop([
    fc.dictionary(
      fc.string({ minLength: 1 }).filter((s) => !s.includes("=") && !s.includes(",") && s.trim().length > 0),
      fc.string({ minLength: 1 }).filter((s) => !s.includes("=") && !s.includes(",") && s.trim().length > 0)
    ),
  ])("[🎲] roundtrip: format then parse returns trimmed original", (obj) => {
    const formatted = Object.entries(obj)
      .map(([k, v]) => `${k}=${v}`)
      .join(",");
    const parsed = parseKeyValuePairs(formatted);
    const expected = Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k.trim(), v.trim()])
    );
    expect(parsed).toEqual(expected);
  });

  itProp.prop([fc.string()])("[🎲] result keys and values are strings", (str) => {
    const result = parseKeyValuePairs(str);
    Object.entries(result).forEach(([key, value]) => {
      expect(typeof key).toBe("string");
      expect(typeof value).toBe("string");
    });
  });
});
