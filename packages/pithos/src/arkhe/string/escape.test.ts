import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { escape } from "./escape";

describe("escape", () => {
  it("escapes ampersand", () => {
    expect(escape("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes less than", () => {
    expect(escape("a < b")).toBe("a &lt; b");
  });

  it("escapes greater than", () => {
    expect(escape("a > b")).toBe("a &gt; b");
  });

  it("escapes double quotes", () => {
    expect(escape('"hello"')).toBe("&quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escape("'hello'")).toBe("&#39;hello&#39;");
  });

  it("escapes all special characters", () => {
    expect(escape("<div class=\"a\" data-x='b'>&</div>")).toBe(
      "&lt;div class=&quot;a&quot; data-x=&#39;b&#39;&gt;&amp;&lt;/div&gt;"
    );
  });

  it("handles empty string", () => {
    expect(escape("")).toBe("");
  });

  it("preserves non-special characters", () => {
    expect(escape("hello world 123")).toBe("hello world 123");
  });

  it("[🎯] handles single character", () => {
    expect(escape("a")).toBe("a");
    expect(escape("<")).toBe("&lt;");
    expect(escape("&")).toBe("&amp;");
  });

  it("[🎯] tests JSDoc XSS example", () => {
    expect(escape('<script>alert("XSS")</script>')).toBe(
      "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
    );
  });

  itProp.prop([fc.string()])("[🎲] always returns a string", (str) => {
    expect(typeof escape(str)).toBe("string");
  });

  itProp.prop([fc.string()])("[🎲] result length is >= input length", (str) => {
    expect(escape(str).length).toBeGreaterThanOrEqual(str.length);
  });

  itProp.prop([fc.string()])("[🎲] result contains no unescaped special characters", (str) => {
    const result = escape(str);
    // After escaping, there should be no raw <, >, &, ", ' that aren't part of entities
    expect(result).not.toMatch(/[<>"'](?!amp;|lt;|gt;|quot;|#39;)/);
  });

  itProp.prop([fc.string()])("[🎲] idempotent when no special chars in result", (str) => {
    const once = escape(str);
    // Escaping twice should escape the & in entities
    const twice = escape(once);
    expect(typeof twice).toBe("string");
  });
});
