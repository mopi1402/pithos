import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unescape } from "./unescape";
import { escape } from "./escape";

describe("unescape", () => {
  it("unescapes &lt; and &gt;", () => {
    expect(unescape("&lt;div&gt;")).toBe("<div>");
  });

  it("unescapes &amp;", () => {
    expect(unescape("a &amp; b")).toBe("a & b");
  });

  it("unescapes &quot;", () => {
    expect(unescape("&quot;hello&quot;")).toBe('"hello"');
  });

  it("unescapes &#39;", () => {
    expect(unescape("&#39;quoted&#39;")).toBe("'quoted'");
  });

  it("handles multiple entities", () => {
    expect(unescape("&lt;a href=&quot;url&quot;&gt;")).toBe('<a href="url">');
  });

  it("returns empty string for empty input", () => {
    expect(unescape("")).toBe("");
  });

  it("returns original string when no entities", () => {
    expect(unescape("hello world")).toBe("hello world");
  });

  it("roundtrips with escape", () => {
    const original = '<script>alert("XSS")</script>';
    expect(unescape(escape(original))).toBe(original);
  });

  it("handles partial entity-like strings", () => {
    expect(unescape("&unknown;")).toBe("&unknown;");
    expect(unescape("& lt;")).toBe("& lt;");
  });

  it("handles consecutive entities", () => {
    expect(unescape("&lt;&gt;&amp;")).toBe("<>&");
  });

  it("handles mixed content", () => {
    expect(unescape("Hello &amp; Welcome &lt;User&gt;")).toBe(
      "Hello & Welcome <User>"
    );
  });

  it("[🎯] handles single character", () => {
    expect(unescape("a")).toBe("a");
    expect(unescape("&")).toBe("&");
  });

  it("[🎯] tests JSDoc roundtrip example", () => {
    const original = '<script>alert("XSS")</script>';
    expect(unescape(escape(original))).toBe(original);
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof unescape(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result length is <= input length", (str) => {
    expect(unescape(str).length).toBeLessThanOrEqual(str.length);
  });

  itProp.prop([fc.string()])("[🎲] roundtrip: unescape(escape(x)) === x", (str) => {
    expect(unescape(escape(str))).toBe(str);
  });

  itProp.prop([fc.string()])("[🎲] idempotent when no entities", (str) => {
    // Filter out strings that look like entities
    const clean = str.replace(/&(?:amp|lt|gt|quot|#39);/g, "");
    const once = unescape(clean);
    const twice = unescape(once);
    expect(twice).toBe(once);
  });
});
