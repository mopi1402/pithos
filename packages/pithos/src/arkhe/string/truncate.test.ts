import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { truncate } from "./truncate";

describe("truncate", () => {
  it("truncates with default options", () => {
    expect(truncate("hi-diddly-ho there, neighborino")).toBe(
      "hi-diddly-ho there, neighbo..."
    );
  });

  it("truncates to custom length", () => {
    expect(truncate("hi-diddly-ho there, neighborino", { length: 24 })).toBe(
      "hi-diddly-ho there, n..."
    );
  });

  it("truncates to separator string", () => {
    expect(
      truncate("hi-diddly-ho there, neighborino", {
        length: 24,
        separator: " ",
      })
    ).toBe("hi-diddly-ho there,...");
  });

  it("truncates to separator regex", () => {
    expect(
      truncate("hi-diddly-ho there, neighborino", {
        length: 24,
        separator: /,? +/,
      })
    ).toBe("hi-diddly-ho there...");
  });

  it("uses custom omission", () => {
    expect(
      truncate("hi-diddly-ho there, neighborino", {
        omission: " [...]",
      })
    ).toBe("hi-diddly-ho there, neig [...]");
  });

  it("returns original string if shorter than length", () => {
    expect(truncate("short", { length: 30 })).toBe("short");
  });

  it("returns original string if equal to length", () => {
    expect(truncate("hello", { length: 5 })).toBe("hello");
  });

  it("handles empty string", () => {
    expect(truncate("")).toBe("");
  });

  it("handles omission longer than length", () => {
    expect(truncate("hello world", { length: 2, omission: "..." })).toBe("..");
  });

  it("handles separator not found", () => {
    expect(truncate("hello world", { length: 8, separator: "," })).toBe(
      "hello..."
    );
  });

  it("handles regex separator with global flag", () => {
    expect(
      truncate("one two three four", {
        length: 15,
        separator: / /g,
      })
    ).toBe("one two...");
  });

  it("handles separator at position 0", () => {
    expect(
      truncate(" hello world", {
        length: 8,
        separator: " ",
      })
    ).toBe(" hell...");
  });

  it("[👾] handles length of 0", () => {
    expect(truncate("hello", { length: 0 })).toBe("");
  });

  it("[👾] handles length equal to omission length", () => {
    // When length === omission.length, maxLength === 0
    // With <= 0: returns omission.slice(0, length) = "..."
    // With < 0: would return "" + "..." = "..."
    expect(truncate("hello", { length: 4, omission: ">>>>" })).toBe(">>>>");
  });

  it("[👾] handles maxLength exactly zero with separator", () => {
    // When maxLength === 0, truncated should be "" and separator logic should be skipped
    expect(truncate("hello world", { length: 3, omission: "...", separator: " " })).toBe("...");
  });

  it("[👾] handles regex separator matching at position 0", () => {
    // Regex that matches at the start - should not truncate to empty
    expect(
      truncate("---hello world", {
        length: 10,
        separator: /-+/,
      })
    ).toBe("---hell...");
  });

  it("[🎯] default length is 30", () => {
    const str = "12345678901234567890123456789012345";
    expect(truncate(str)).toHaveLength(30);
    expect(truncate(str)).toBe("123456789012345678901234567...");
  });

  it("[🎯] default omission is '...'", () => {
    expect(truncate("hi-diddly-ho there, neighborino")).toMatch(/\.\.\.$/);
  });

  itProp.prop([fc.string(), fc.integer({ min: 1, max: 100 })])(
    "[🎲] result length never exceeds specified length",
    (str, length) => {
      const result = truncate(str, { length });
      expect(result.length).toBeLessThanOrEqual(length);
    }
  );

  itProp.prop([fc.string({ maxLength: 20 })])(
    "[🎲] short strings are returned unchanged",
    (str) => {
      const result = truncate(str, { length: 100 });
      expect(result).toBe(str);
    }
  );

  itProp.prop([fc.string()])("[🎲] idempotent for same options", (str) => {
    const once = truncate(str, { length: 20 });
    const twice = truncate(once, { length: 20 });
    expect(twice).toBe(once);
  });
});
