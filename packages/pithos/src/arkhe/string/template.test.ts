import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { template } from "./template";

describe("template", () => {
  it("replaces simple placeholders", () => {
    expect(template("Hello {name}", { name: "World" })).toBe("Hello World");
  });

  it("replaces multiple placeholders", () => {
    expect(template("{a} and {b}", { a: "1", b: "2" })).toBe("1 and 2");
  });

  it("handles nested properties", () => {
    expect(template("{user.name}", { user: { name: "Alice" } })).toBe("Alice");
  });

  it("handles deeply nested properties", () => {
    const data = { a: { b: { c: "deep" } } };
    expect(template("{a.b.c}", data)).toBe("deep");
  });

  it("returns empty string for missing keys", () => {
    expect(template("{missing}", {})).toBe("");
  });

  it("returns empty string for missing nested keys", () => {
    expect(template("{a.b.c}", { a: {} })).toBe("");
  });

  it("escapes double braces", () => {
    expect(template("{{escaped}}")).toBe("{escaped}");
  });

  it("converts numbers to string", () => {
    expect(template("{count}", { count: 42 })).toBe("42");
  });

  it("handles null values", () => {
    expect(template("{val}", { val: null })).toBe("");
  });

  it("handles undefined values", () => {
    expect(template("{val}", { val: undefined })).toBe("");
  });

  it("handles empty data", () => {
    expect(template("Hello {name}")).toBe("Hello ");
  });

  it("preserves text without placeholders", () => {
    expect(template("Hello World", {})).toBe("Hello World");
  });

  it("[🎯] tests JSDoc example with nested email", () => {
    expect(
      template("{user.name} <{user.email}>", {
        user: { name: "John", email: "john@example.com" },
      })
    ).toBe("John <john@example.com>");
  });

  it("[👾] handles whitespace in placeholder keys", () => {
    expect(template("{ name }", { name: "World" })).toBe("World");
    expect(template("{  spaced  }", { spaced: "value" })).toBe("value");
  });

  it("[👾] handles non-object in nested path", () => {
    // When trying to access nested property on a primitive
    expect(template("{a.b}", { a: "string" })).toBe("");
    expect(template("{a.b}", { a: 42 })).toBe("");
    expect(template("{a.b.c}", { a: { b: "not-object" } })).toBe("");
  });

  it("[👾] handles null in nested path", () => {
    // Specifically test null vs undefined in path traversal
    expect(template("{a.b}", { a: null })).toBe("");
    expect(template("{a.b.c}", { a: { b: null } })).toBe("");
  });

  it("[👾] handles undefined in nested path", () => {
    expect(template("{a.b}", { a: undefined })).toBe("");
    expect(template("{a.b.c}", { a: { b: undefined } })).toBe("");
  });

  itProp.prop([fc.string()])(
    "[🎲] text without placeholders is returned unchanged",
    (str) => {
      // Filter out strings with '{' to avoid placeholder syntax
      const text = str.replace(/{/g, "").replace(/}/g, "");
      expect(template(text, {})).toBe(text);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.string())])(
    "[🎲] missing keys result in empty strings",
    (data) => {
      const result = template("{nonexistent}", data);
      expect(result).toBe("");
    }
  );

  itProp.prop([
    fc.string(),
    fc.dictionary(fc.string(), fc.oneof(fc.string(), fc.integer())),
  ])("[🎲] always returns a string", (tmpl, data) => {
    const result = template(tmpl, data);
    expect(typeof result).toBe("string");
  });
});
