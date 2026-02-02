import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parsePath } from "./path-parser";

describe("parsePath", () => {
  it("parses simple path", () => {
    expect(parsePath("a.b.c")).toEqual(["a", "b", "c"]);
  });

  it("parses single key", () => {
    expect(parsePath("a")).toEqual(["a"]);
  });

  it("handles empty string", () => {
    expect(parsePath("")).toEqual([]);
  });

  it("parses array indices as numbers", () => {
    expect(parsePath("items[0]")).toEqual(["items", 0]);
  });

  it("parses multiple array indices", () => {
    expect(parsePath("data[1][2]")).toEqual(["data", 1, 2]);
  });

  it("parses mixed dot and bracket notation", () => {
    expect(parsePath("users[0].profile.name")).toEqual([
      "users",
      0,
      "profile",
      "name",
    ]);
  });

  it("parses complex mixed notation", () => {
    expect(parsePath("users[0].profile.settings[1].theme")).toEqual([
      "users",
      0,
      "profile",
      "settings",
      1,
      "theme",
    ]);
  });

  it("parses large numeric indices", () => {
    expect(parsePath("data[123]")).toEqual(["data", 123]);
  });

  it("parses double-quoted keys", () => {
    expect(parsePath('a["b.c"]')).toEqual(["a", "b.c"]);
  });

  it("parses single-quoted keys", () => {
    expect(parsePath("a['b.c']")).toEqual(["a", "b.c"]);
  });

  it("preserves quoted numeric strings as strings", () => {
    expect(parsePath('a["0"]')).toEqual(["a", "0"]);
  });

  it("ignores consecutive dots", () => {
    expect(parsePath("a..b")).toEqual(["a", "b"]);
  });

  it("handles consecutive dots with brackets", () => {
    expect(parsePath("a..b[0]..c")).toEqual(["a", "b", 0, "c"]);
  });

  it("handles only brackets", () => {
    expect(parsePath("[0]")).toEqual([0]);
  });

  it("handles leading dot", () => {
    expect(parsePath(".a.b")).toEqual(["a", "b"]);
  });

  it("handles trailing dot", () => {
    expect(parsePath("a.b.")).toEqual(["a", "b"]);
  });

  it("handles keys with special characters in quotes", () => {
    expect(parsePath('a["key-with-dash"]')).toEqual(["a", "key-with-dash"]);
  });

  it("[🎯] quotes in middle of quoted key are preserved", () => {
    // Kills mutants on replace anchors
    expect(parsePath(`a["b'c"]`)).toEqual(["a", "b'c"]);
  });

  it("[👾] mutation: number detection in dot notation", () => {
    expect(parsePath("a.123.b")).toEqual(["a", 123, "b"]);
  });

  it("[👾] mutation: unquoted numeric strings become numbers", () => {
    expect(parsePath("a[456]")).toEqual(["a", 456]);
  });

  it("[👾] only leading quote triggers quoted mode", () => {
    // Kills mutant: /^["']/ → /["']/
    expect(parsePath("a.b'c.d")).toEqual(["a", "b'c", "d"]);
  });

  it("[👾] alphanumeric keys stay as strings", () => {
    // Kills mutant: /^\d+$/ → /\d+$/ (removes start anchor)
    expect(parsePath("a.abc123.b")).toEqual(["a", "abc123", "b"]);
    // Kills mutant: /^\d+$/ → /^\d+/ (removes end anchor)
    expect(parsePath("a.123abc.b")).toEqual(["a", "123abc", "b"]);
  });

  it("[🎯] handles single character key", () => {
    expect(parsePath("a")).toEqual(["a"]);
  });

  it("[🎯] tests JSDoc example with items[0].name", () => {
    expect(parsePath("items[0].name")).toEqual(["items", 0, "name"]);
  });

  it("[🎯] tests JSDoc example with data[1][2].value", () => {
    expect(parsePath("data[1][2].value")).toEqual(["data", 1, 2, "value"]);
  });

  itProp.prop([fc.string()])("[🎲] always returns an array", (str) => {
    expect(Array.isArray(parsePath(str))).toBe(true);
  });

  itProp.prop([fc.array(fc.string({ minLength: 1 }).filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)), { minLength: 1 })])(
    "[🎲] simple dot-joined paths parse correctly",
    (keys) => {
      const path = keys.join(".");
      const result = parsePath(path);
      expect(result).toEqual(keys);
    }
  );

  itProp.prop([fc.string()])("[🎲] result elements are strings or numbers", (str) => {
    const result = parsePath(str);
    result.forEach((element) => {
      expect(typeof element === "string" || typeof element === "number").toBe(true);
    });
  });
});
