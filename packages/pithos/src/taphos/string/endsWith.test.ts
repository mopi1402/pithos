import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { endsWith } from "./endsWith";

describe("endsWith", () => {
  describe("Basic functionality", () => {
    it("returns true when string ends with suffix", () => {
      expect(endsWith("hello", "lo")).toBe(true);
      expect(endsWith("hello world", "world")).toBe(true);
      expect(endsWith("hello", "hello")).toBe(true);
      expect(endsWith("test", "st")).toBe(true);
    });

    it("returns false when string does not end with suffix", () => {
      expect(endsWith("hello", "world")).toBe(false);
      expect(endsWith("hello", "hi")).toBe(false);
      expect(endsWith("test", "testing")).toBe(false);
      expect(endsWith("abc", "abcd")).toBe(false);
    });

    it("[🎯] handles empty strings correctly", () => {
      expect(endsWith("", "")).toBe(true);
      expect(endsWith("hello", "")).toBe(true);
      expect(endsWith("", "hello")).toBe(false);
    });

    it("handles single character strings", () => {
      expect(endsWith("a", "a")).toBe(true);
      expect(endsWith("a", "b")).toBe(false);
      expect(endsWith("hello", "o")).toBe(true);
      expect(endsWith("hello", "h")).toBe(false);
    });
  });

  describe("Case sensitivity", () => {
    it("is case sensitive", () => {
      expect(endsWith("Hello", "lo")).toBe(true); // "Hello" ends with "lo"
      expect(endsWith("Hello", "Lo")).toBe(false);
      expect(endsWith("Hello", "hello")).toBe(false);
      expect(endsWith("Hello", "Hello")).toBe(true);
    });

    it("handles mixed case correctly", () => {
      expect(endsWith("Hello World", "World")).toBe(true);
      expect(endsWith("Hello World", "world")).toBe(false);
      expect(endsWith("hello World", "World")).toBe(true);
      expect(endsWith("HELLO", "hello")).toBe(false);
    });
  });

  describe("Position parameter", () => {
    it("searches up to specified position", () => {
      expect(endsWith("hello world", "lo", 5)).toBe(true);
      expect(endsWith("hello world", "world", 5)).toBe(false);
      expect(endsWith("hello world", "hello", 5)).toBe(true);
      expect(endsWith("hello world", "he", 2)).toBe(true);
    });

    it("handles position at string boundaries", () => {
      expect(endsWith("hello", "hello", 5)).toBe(true);
      expect(endsWith("hello", "hello", 4)).toBe(false);
      expect(endsWith("hello", "", 0)).toBe(true);
      expect(endsWith("hello", "h", 1)).toBe(true);
    });

    it("handles position beyond string length", () => {
      expect(endsWith("hello", "hello", 10)).toBe(true);
      expect(endsWith("hello", "lo", 10)).toBe(true);
      expect(endsWith("hello", "world", 10)).toBe(false);
    });

    it("handles negative position", () => {
      expect(endsWith("hello", "hello", -1)).toBe(false);
      expect(endsWith("hello", "", -1)).toBe(true); // Empty string always matches
    });

    it("handles position zero", () => {
      expect(endsWith("hello", "", 0)).toBe(true);
      expect(endsWith("hello", "h", 0)).toBe(false);
      expect(endsWith("hello", "hello", 0)).toBe(false);
    });
  });

  describe("Null and undefined handling", () => {
    it("returns false for null string", () => {
      expect(endsWith(null, "test")).toBe(false);
      expect(endsWith(null, "")).toBe(false);
      expect(endsWith(null, null)).toBe(false);
    });

    it("returns false for undefined string", () => {
      expect(endsWith(undefined, "test")).toBe(false);
      expect(endsWith(undefined, "")).toBe(false);
      expect(endsWith(undefined, undefined)).toBe(false);
    });

    it("returns false for null suffix", () => {
      expect(endsWith("test", null)).toBe(false);
      expect(endsWith("", null)).toBe(false);
    });

    it("returns false for undefined suffix", () => {
      expect(endsWith("test", undefined)).toBe(false);
      expect(endsWith("", undefined)).toBe(false);
    });

    it("handles both null/undefined", () => {
      expect(endsWith(null, undefined)).toBe(false);
      expect(endsWith(undefined, null)).toBe(false);
    });
  });

  describe("Unicode support", () => {
    it("handles accented characters", () => {
      expect(endsWith("café", "fé")).toBe(true);
      expect(endsWith("naïve", "ïve")).toBe(true);
      expect(endsWith("résumé", "sumé")).toBe(true);
      expect(endsWith("café", "fe")).toBe(false);
    });

    it("handles Cyrillic characters", () => {
      expect(endsWith("москва", "сква")).toBe(true);
      expect(endsWith("петербург", "бург")).toBe(true);
      expect(endsWith("москва", "сква")).toBe(true);
    });

    it("handles Chinese characters", () => {
      expect(endsWith("北京", "京")).toBe(true);
      expect(endsWith("上海", "海")).toBe(true);
      expect(endsWith("北京", "北")).toBe(false);
    });

    it("handles Japanese characters", () => {
      expect(endsWith("東京", "京")).toBe(true);
      expect(endsWith("大阪", "阪")).toBe(true);
      expect(endsWith("東京", "東")).toBe(false);
    });

    it("handles Korean characters", () => {
      expect(endsWith("서울", "울")).toBe(true);
      expect(endsWith("부산", "산")).toBe(true);
      expect(endsWith("서울", "서")).toBe(false);
    });

    it("handles emoji characters", () => {
      expect(endsWith("hello🚀", "🚀")).toBe(true);
      expect(endsWith("world🎯", "🎯")).toBe(true);
      expect(endsWith("test🌟", "🌟")).toBe(true);
      expect(endsWith("hello🚀", "hello")).toBe(false);
    });

    it("handles mixed Unicode and Latin", () => {
      expect(endsWith("hello世界", "世界")).toBe(true);
      expect(endsWith("приветworld", "world")).toBe(true);
      expect(endsWith("مرحباhello", "hello")).toBe(true);
    });
  });

  describe("Real-world scenarios", () => {
    it("validates file extensions", () => {
      expect(endsWith("document.pdf", ".pdf")).toBe(true);
      expect(endsWith("photo.jpg", ".jpg")).toBe(true);
      expect(endsWith("image.png", ".png")).toBe(true);
      expect(endsWith("file.txt", ".pdf")).toBe(false);
      expect(endsWith("document.pdf", "pdf")).toBe(true); // "document.pdf" ends with "pdf"
    });

    it("validates URL endpoints", () => {
      expect(endsWith("https://example.com/api", "/api")).toBe(true);
      expect(endsWith("https://example.com/users", "/users")).toBe(true);
      expect(endsWith("https://example.com/api", "/users")).toBe(false);
      expect(endsWith("https://example.com/api", "api")).toBe(true); // URL ends with "api"
    });

    it("validates email domains", () => {
      expect(endsWith("user@example.com", "@example.com")).toBe(true);
      expect(endsWith("user@gmail.com", "@gmail.com")).toBe(true);
      expect(endsWith("user@example.com", "@gmail.com")).toBe(false);
      expect(endsWith("user@example.com", "example.com")).toBe(true); // Email ends with "example.com"
    });

    it("validates file paths", () => {
      expect(
        endsWith("/home/user/documents/file.txt", "/documents/file.txt")
      ).toBe(true);
      expect(endsWith("/var/log/app.log", "/log/app.log")).toBe(true);
      expect(
        endsWith("/home/user/documents/file.txt", "/documents/file.pdf")
      ).toBe(false);
    });

    it("validates configuration values", () => {
      expect(endsWith("development", "ment")).toBe(true);
      expect(endsWith("production", "tion")).toBe(true);
      expect(endsWith("staging", "ing")).toBe(true);
      expect(endsWith("development", "prod")).toBe(false);
    });

    it("validates version strings", () => {
      expect(endsWith("1.2.3", ".3")).toBe(true);
      expect(endsWith("v2.1.0", ".0")).toBe(true);
      expect(endsWith("1.2.3", ".4")).toBe(false);
      expect(endsWith("1.2.3", "2.3")).toBe(true); // "1.2.3" ends with "2.3"
    });
  });

  describe("Edge cases", () => {
    it("[🎯] handles very long strings", () => {
      const longString = "a".repeat(10000) + "end";
      expect(endsWith(longString, "end")).toBe(true);
      expect(endsWith(longString, "start")).toBe(false);
      expect(endsWith(longString, "a")).toBe(false);
    });

    it("handles strings with repeated patterns", () => {
      expect(endsWith("ababab", "ab")).toBe(true);
      expect(endsWith("ababab", "bab")).toBe(true);
      expect(endsWith("ababab", "aba")).toBe(false);
    });

    it("handles strings with special characters", () => {
      expect(endsWith("test@#$", "@#$")).toBe(true);
      expect(endsWith("hello!@#", "!@#")).toBe(true);
      expect(endsWith("test@#$", "@#")).toBe(false);
    });

    it("handles strings with whitespace", () => {
      expect(endsWith("hello world", " world")).toBe(true);
      expect(endsWith("hello\tworld", "\tworld")).toBe(true);
      expect(endsWith("hello\nworld", "\nworld")).toBe(true);
      expect(endsWith("hello world", "world ")).toBe(false);
    });

    it("handles strings with control characters", () => {
      expect(endsWith("hello\x00", "\x00")).toBe(true);
      expect(endsWith("hello\x01", "\x01")).toBe(true);
      expect(endsWith("hello\x1F", "\x1F")).toBe(true);
      expect(endsWith("hello\x00", "\x01")).toBe(false);
    });

    it("[🎯] handles strings with null bytes", () => {
      expect(endsWith("hello\0", "\0")).toBe(true);
      expect(endsWith("hello\0world", "\0world")).toBe(true);
      expect(endsWith("hello\0", "hello")).toBe(false);
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string()])("[🎲] any string ends with itself", (str) => {
      expect(endsWith(str, str)).toBe(true);
    });

    itProp.prop([fc.string()])("[🎲] any string ends with empty string", (str) => {
      expect(endsWith(str, "")).toBe(true);
    });

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] string + suffix ends with suffix",
      (prefix, suffix) => {
        expect(endsWith(prefix + suffix, suffix)).toBe(true);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.string({ minLength: 1 })])(
      "[🎲] consistent with native String.prototype.endsWith",
      (str, suffix) => {
        expect(endsWith(str, suffix)).toBe(str.endsWith(suffix));
      }
    );
  });

  describe("Type safety", () => {
    it("returns boolean type", () => {
      const result = endsWith("hello", "lo");
      expect(typeof result).toBe("boolean");
      expect(result).toBe(true);
    });

    it("handles string objects", () => {
      const strObj = new String("hello");
      const result = endsWith(strObj as any, "lo");
      expect(result).toBe(true);
    });

    it("handles number to string conversion", () => {
      expect(endsWith("123", "3")).toBe(true);
      expect(endsWith("123", "23")).toBe(true);
      expect(endsWith("123", "123")).toBe(true);
    });
  });

  describe("Function behavior", () => {
    it("does not modify input parameters", () => {
      const str = "hello";
      const suffix = "lo";
      endsWith(str, suffix);
      expect(str).toBe("hello");
      expect(suffix).toBe("lo");
    });

    it("returns consistent results", () => {
      const str = "hello";
      const suffix = "lo";
      const result1 = endsWith(str, suffix);
      const result2 = endsWith(str, suffix);
      expect(result1).toBe(result2);
    });

    it("handles function calls with different parameters", () => {
      expect(endsWith("hello", "lo")).toBe(true);
      expect(endsWith("world", "ld")).toBe(true);
      expect(endsWith("test", "st")).toBe(true);
    });
  });

  describe("Comparison with native method", () => {
    it("behaves consistently with String.prototype.endsWith", () => {
      const testCases = [
        ["hello", "lo"],
        ["hello world", "world"],
        ["", ""],
        ["hello", ""],
        ["", "hello"],
        ["Hello", "lo"],
        ["hello", "world"],
      ];

      testCases.forEach(([str, suffix]) => {
        const nativeResult = str.endsWith(suffix);
        const utilResult = endsWith(str, suffix);
        expect(utilResult).toBe(nativeResult);
      });
    });

    it("handles position parameter consistently", () => {
      const testCases = [
        ["hello world", "lo", 5],
        ["hello world", "world", 5],
        ["hello world", "hello", 5],
        ["hello", "hello", 5],
        ["hello", "lo", 10],
      ];

      testCases.forEach(([str, suffix, position]) => {
        const nativeResult = (str as string).endsWith(
          suffix as string,
          position as number
        );
        const utilResult = endsWith(
          str as string,
          suffix as string,
          position as number
        );
        expect(utilResult).toBe(nativeResult);
      });
    });

    it("provides null safety that native method lacks", () => {
      // Native method would throw for null string
      expect(() => (null as any).endsWith("test")).toThrow();
      // Native method does not throw for null suffix, it returns false
      expect(("test" as any).endsWith(null)).toBe(false);

      // Utility function handles safely
      expect(endsWith(null, "test")).toBe(false);
      expect(endsWith("test", null)).toBe(false);
    });
  });

  describe("Boundary conditions", () => {
    it("handles position at string start", () => {
      expect(endsWith("hello", "", 0)).toBe(true);
      expect(endsWith("hello", "h", 0)).toBe(false);
      expect(endsWith("hello", "hello", 0)).toBe(false);
    });

    it("handles position at string end", () => {
      expect(endsWith("hello", "hello", 5)).toBe(true);
      expect(endsWith("hello", "lo", 5)).toBe(true);
      expect(endsWith("hello", "world", 5)).toBe(false);
    });

    it("handles position beyond string length", () => {
      expect(endsWith("hello", "hello", 10)).toBe(true);
      expect(endsWith("hello", "lo", 10)).toBe(true);
      expect(endsWith("hello", "world", 10)).toBe(false);
    });

    it("[🎯] handles suffix longer than string", () => {
      expect(endsWith("hello", "hello world")).toBe(false);
      expect(endsWith("hi", "hello")).toBe(false);
      expect(endsWith("", "hello")).toBe(false);
    });

    it("[🎯] handles suffix equal to string", () => {
      expect(endsWith("hello", "hello")).toBe(true);
      expect(endsWith("", "")).toBe(true);
      expect(endsWith("a", "a")).toBe(true);
    });
  });
});
