import { describe, it, expect } from "vitest";
import { createGeneratorContext, increaseIndent } from "../context";
import { debugSectionComment, wrapWithDebugComment, debugComment, escapeString } from "./code";

describe("[🎯] debugSectionComment", () => {
  it("returns empty string when not in debug mode", () => {
    const ctx = createGeneratorContext();
    expect(debugSectionComment(ctx, "Section")).toBe("");
  });

  it("returns comment with leading newline in debug mode", () => {
    const ctx = createGeneratorContext({ debug: true });
    expect(debugSectionComment(ctx, "Section A")).toBe("\n// Section A");
  });

  it("includes indentation in debug mode", () => {
    const ctx = increaseIndent(createGeneratorContext({ debug: true }));
    expect(debugSectionComment(ctx, "Nested")).toBe("\n  // Nested");
  });
});

describe("[🎯] wrapWithDebugComment", () => {
  it("returns lines unchanged when not in debug mode", () => {
    const ctx = createGeneratorContext();
    const lines = ["line1", "line2"];
    expect(wrapWithDebugComment(ctx, "desc", lines)).toEqual(lines);
  });

  it("returns empty array unchanged even in debug mode", () => {
    const ctx = createGeneratorContext({ debug: true });
    expect(wrapWithDebugComment(ctx, "desc", [])).toEqual([]);
  });

  it("prepends debug comment in debug mode with non-empty lines", () => {
    const ctx = createGeneratorContext({ debug: true });
    const lines = ['if (x) return "err";'];
    const result = wrapWithDebugComment(ctx, "Validate x", lines);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe("// Validate x");
    expect(result[1]).toBe(lines[0]);
  });
});

describe("[🎯] escapeString", () => {
  it("escapes backslashes, quotes, and whitespace chars", () => {
    expect(escapeString('a\\b"c\n\r\t')).toBe('a\\\\b\\"c\\n\\r\\t');
  });
});

describe("[🎯] debugComment", () => {
  it("returns empty string when not in debug mode", () => {
    const ctx = createGeneratorContext();
    expect(debugComment(ctx, "test")).toBe("");
  });

  it("returns indented comment in debug mode", () => {
    const ctx = increaseIndent(createGeneratorContext({ debug: true }));
    expect(debugComment(ctx, "check")).toBe("  // check");
  });
});
