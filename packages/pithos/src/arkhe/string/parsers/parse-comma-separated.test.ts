import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parseCommaSeparated } from "./parse-comma-separated";

describe("parseCommaSeparated", () => {
  it("parses with identity", () => {
    expect(parseCommaSeparated("a,b,c", (x) => x)).toEqual(["a", "b", "c"]);
  });

  it("parses to numbers", () => {
    expect(parseCommaSeparated("1,2,3", Number)).toEqual([1, 2, 3]);
  });

  it("trims with custom parser", () => {
    expect(parseCommaSeparated("a, b, c", (x) => x.trim())).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("handles single value", () => {
    expect(parseCommaSeparated("a", (x) => x)).toEqual(["a"]);
  });

  it("handles empty string", () => {
    expect(parseCommaSeparated("", (x) => x)).toEqual([""]);
  });

  it("transforms to objects", () => {
    expect(parseCommaSeparated("a,b", (x) => ({ key: x }))).toEqual([
      { key: "a" },
      { key: "b" },
    ]);
  });

  it("[🎯] tests JSDoc example with Number parser", () => {
    expect(parseCommaSeparated("1,2,3", Number)).toEqual([1, 2, 3]);
  });

  it("[🎯] tests JSDoc example with toUpperCase", () => {
    expect(parseCommaSeparated("a,b,c", (x) => x.toUpperCase())).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("[🎯] tests JSDoc example with trim", () => {
    expect(parseCommaSeparated(" a , b ", (x) => x.trim())).toEqual(["a", "b"]);
  });

  it("[🎯] handles single character", () => {
    expect(parseCommaSeparated("x", (x) => x)).toEqual(["x"]);
  });

  itProp.prop([fc.string()])("[🎲] always returns an array", (str) => {
    expect(Array.isArray(parseCommaSeparated(str, (x) => x))).toBe(true);
  });

  itProp.prop([fc.string()])("[🎲] result length equals comma count + 1", (str) => {
    const result = parseCommaSeparated(str, (x) => x);
    const commaCount = (str.match(/,/g) || []).length;
    expect(result.length).toBe(commaCount + 1);
  });

  itProp.prop([fc.array(fc.string({ minLength: 1 }).filter((s) => !s.includes(",")), { minLength: 1 })])(
    "[🎲] roundtrip: join then parse returns original",
    (arr) => {
      const joined = arr.join(",");
      const parsed = parseCommaSeparated(joined, (x) => x);
      expect(parsed).toEqual(arr);
    }
  );

  itProp.prop([fc.string()])("[🎲] parser is applied to each element", (str) => {
    const result = parseCommaSeparated(str, (x) => x.length);
    const parts = str.split(",");
    expect(result).toEqual(parts.map((p) => p.length));
  });
});
