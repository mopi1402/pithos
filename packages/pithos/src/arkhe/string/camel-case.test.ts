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
