import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { startsWith } from "./startsWith";

describe("startsWith", () => {
  describe("basic functionality", () => {
    it("returns true when string starts with prefix", () => {
      expect(startsWith("hello", "he")).toBe(true);
      expect(startsWith("hello", "hello")).toBe(true);
      expect(startsWith("hello world", "hello")).toBe(true);
      expect(startsWith("abc", "a")).toBe(true);
    });

    it("returns false when string does not start with prefix", () => {
      expect(startsWith("hello", "world")).toBe(false);
      expect(startsWith("hello", "lo")).toBe(false);
      expect(startsWith("abc", "bc")).toBe(false);
    });

    it("handles exact matches", () => {
      expect(startsWith("hello", "hello")).toBe(true);
      expect(startsWith("a", "a")).toBe(true);
      expect(startsWith("", "")).toBe(true);
    });
  });

  describe("empty string handling", () => {
    it("[🎯] empty string starts with empty string", () => {
      expect(startsWith("", "")).toBe(true);
    });

    it("[🎯] non-empty string starts with empty string", () => {
      expect(startsWith("hello", "")).toBe(true);
      expect(startsWith("abc", "")).toBe(true);
      expect(startsWith("test", "")).toBe(true);
    });

    it("[🎯] empty string does not start with non-empty prefix", () => {
      expect(startsWith("", "hello")).toBe(false);
      expect(startsWith("", "a")).toBe(false);
      expect(startsWith("", "test")).toBe(false);
    });
  });

  describe("case sensitivity", () => {
    it("is case sensitive", () => {
      expect(startsWith("Hello", "he")).toBe(false);
      expect(startsWith("Hello", "He")).toBe(true);
      expect(startsWith("Hello", "hello")).toBe(false);
      expect(startsWith("HELLO", "hello")).toBe(false);
    });

    it("handles mixed case correctly", () => {
      expect(startsWith("JavaScript", "Java")).toBe(true);
      expect(startsWith("JavaScript", "java")).toBe(false);
      expect(startsWith("TypeScript", "Type")).toBe(true);
      expect(startsWith("TypeScript", "type")).toBe(false);
    });
  });

  describe("position parameter", () => {
    it("searches from specified position", () => {
      expect(startsWith("hello world", "world", 6)).toBe(true);
      expect(startsWith("hello world", "world", 5)).toBe(false);
      expect(startsWith("hello world", "hello", 0)).toBe(true);
    });

    it("handles position 0", () => {
      expect(startsWith("hello", "hello", 0)).toBe(true);
      expect(startsWith("hello", "he", 0)).toBe(true);
      expect(startsWith("hello", "lo", 0)).toBe(false);
    });

    it("handles position beyond string length", () => {
      expect(startsWith("hello", "o", 4)).toBe(true);
      expect(startsWith("hello", "o", 5)).toBe(false);
      expect(startsWith("hello", "", 10)).toBe(true);
    });

    it("handles negative position", () => {
      expect(startsWith("hello", "hello", -1)).toBe(true);
      expect(startsWith("hello", "he", -5)).toBe(true);
    });

    it("handles undefined position", () => {
      expect(startsWith("hello", "he", undefined)).toBe(true);
      expect(startsWith("hello", "lo", undefined)).toBe(false);
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null string", () => {
      expect(startsWith(null, "test")).toBe(false);
      expect(startsWith(null, "")).toBe(false);
      expect(startsWith(null, null)).toBe(false);
    });

    it("handles undefined string", () => {
      expect(startsWith(undefined, "test")).toBe(false);
      expect(startsWith(undefined, "")).toBe(false);
      expect(startsWith(undefined, undefined)).toBe(false);
    });

    it("handles null prefix", () => {
      expect(startsWith("test", null)).toBe(false);
      expect(startsWith("", null)).toBe(false);
    });

    it("handles undefined prefix", () => {
      expect(startsWith("test", undefined)).toBe(false);
      expect(startsWith("", undefined)).toBe(false);
    });

    it("handles both parameters null/undefined", () => {
      expect(startsWith(null, null)).toBe(false);
      expect(startsWith(undefined, undefined)).toBe(false);
      expect(startsWith(null, undefined)).toBe(false);
      expect(startsWith(undefined, null)).toBe(false);
    });
  });

  describe("unicode and special characters", () => {
    it("handles unicode characters", () => {
      expect(startsWith("café", "caf")).toBe(true);
      expect(startsWith("naïve", "naï")).toBe(true);
      expect(startsWith("москва", "мос")).toBe(true);
      expect(startsWith("🚀rocket", "🚀")).toBe(true);
    });

    it("handles special characters", () => {
      expect(startsWith("hello-world", "hello-")).toBe(true);
      expect(startsWith("test@example.com", "test@")).toBe(true);
      expect(startsWith("file.txt", "file.")).toBe(true);
      expect(startsWith("path/to/file", "path/")).toBe(true);
    });

    it("handles whitespace", () => {
      expect(startsWith(" hello", " ")).toBe(true);
      expect(startsWith("\thello", "\t")).toBe(true);
      expect(startsWith("\nhello", "\n")).toBe(true);
      expect(startsWith(" hello", "hello")).toBe(false);
    });
  });

  describe("real-world usage patterns", () => {
    it("validates URLs", () => {
      expect(startsWith("https://example.com/api", "https://")).toBe(true);
      expect(startsWith("http://example.com", "https://")).toBe(false);
      expect(startsWith("ftp://files.com", "https://")).toBe(false);
    });

    it("checks file extensions", () => {
      expect(startsWith("document.pdf", ".pdf")).toBe(false);
      expect(startsWith(".pdf", ".pdf")).toBe(true);
      expect(startsWith("file.txt", ".txt")).toBe(false);
      expect(startsWith(".txt", ".txt")).toBe(true);
    });

    it("validates protocols", () => {
      expect(startsWith("https://api.example.com", "https://api.")).toBe(true);
      expect(startsWith("https://www.example.com", "https://api.")).toBe(false);
    });

    it("checks absolute paths", () => {
      expect(startsWith("/home/user/documents/file.txt", "/")).toBe(true);
      expect(startsWith("relative/path/file.txt", "/")).toBe(false);
      expect(startsWith("C:\\Windows\\System32", "C:\\")).toBe(true);
    });

    it("validates commands", () => {
      expect(startsWith("npm install package", "npm ")).toBe(true);
      expect(startsWith("yarn add package", "npm ")).toBe(false);
      expect(startsWith("git commit -m", "git ")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles single character strings", () => {
      expect(startsWith("a", "a")).toBe(true);
      expect(startsWith("a", "b")).toBe(false);
      expect(startsWith("a", "")).toBe(true);
    });

    it("handles very long strings", () => {
      const longString = "a".repeat(10000);
      const prefix = "a".repeat(1000);
      expect(startsWith(longString, prefix)).toBe(true);
      expect(startsWith(longString, "b")).toBe(false);
    });

    it("handles very long prefixes", () => {
      const str = "hello";
      const longPrefix = "hello".repeat(1000);
      expect(startsWith(str, longPrefix)).toBe(false);
    });

    it("handles position at string boundary", () => {
      expect(startsWith("hello", "o", 4)).toBe(true);
      expect(startsWith("hello", "hello", 0)).toBe(true);
      expect(startsWith("hello", "", 5)).toBe(true);
    });
  });

  describe("type safety", () => {
    it("accepts correct types", () => {
      const str: string = "hello";
      const prefix: string = "he";
      const position: number = 0;
      expect(startsWith(str, prefix, position)).toBe(true);
    });

    it("handles mixed null/undefined types", () => {
      const str: string | null = null;
      const prefix: string | undefined = undefined;
      expect(startsWith(str, prefix)).toBe(false);
    });
  });

  describe("performance edge cases", () => {
    it("handles repeated characters efficiently", () => {
      expect(startsWith("aaaaaaaaaa", "aaaa")).toBe(true);
      expect(startsWith("aaaaaaaaaa", "bbbb")).toBe(false);
    });

    it("handles position optimization", () => {
      expect(startsWith("hello world", "world", 6)).toBe(true);
      expect(startsWith("hello world", "world", 7)).toBe(false);
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string()])("[🎲] any string starts with itself", (str) => {
      expect(startsWith(str, str)).toBe(true);
    });

    itProp.prop([fc.string()])("[🎲] any string starts with empty string", (str) => {
      expect(startsWith(str, "")).toBe(true);
    });

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] prefix + suffix starts with prefix",
      (prefix, suffix) => {
        expect(startsWith(prefix + suffix, prefix)).toBe(true);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.string({ minLength: 1 })])(
      "[🎲] consistent with native String.prototype.startsWith",
      (str, prefix) => {
        expect(startsWith(str, prefix)).toBe(str.startsWith(prefix));
      }
    );
  });
});
