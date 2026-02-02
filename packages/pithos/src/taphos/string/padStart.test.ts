import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { padStart } from "./padStart";

describe("padStart", () => {
  describe("basic functionality", () => {
    it("pads string with spaces by default", () => {
      expect(padStart("hello", 10)).toBe("     hello");
      expect(padStart("test", 8)).toBe("    test");
      expect(padStart("a", 5)).toBe("    a");
    });

    it("pads string with custom pad string", () => {
      expect(padStart("hello", 10, "0")).toBe("00000hello");
      expect(padStart("42", 5, "0")).toBe("00042");
      expect(padStart("test", 8, "-")).toBe("----test");
    });

    it("returns original string when no padding needed", () => {
      expect(padStart("hello", 5)).toBe("hello");
      expect(padStart("hello world", 5)).toBe("hello world");
      expect(padStart("test", 4)).toBe("test");
    });

    it("handles empty string", () => {
      expect(padStart("", 5)).toBe("     ");
      expect(padStart("", 3, "0")).toBe("000");
      expect(padStart("", 0)).toBe("");
    });

    it("handles single character strings", () => {
      expect(padStart("a", 3)).toBe("  a");
      expect(padStart("a", 3, "0")).toBe("00a");
      expect(padStart("a", 1)).toBe("a");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null string", () => {
      expect(padStart(null, 5)).toBe("     ");
      expect(padStart(null, 3, "0")).toBe("000");
      expect(padStart(null, 0)).toBe("");
    });

    it("[🎯] handles undefined string", () => {
      expect(padStart(undefined, 5)).toBe("     ");
      expect(padStart(undefined, 3, "0")).toBe("000");
      expect(padStart(undefined, 0)).toBe("");
    });

    it("handles null length", () => {
      expect(padStart("hello", null)).toBe("hello");
      expect(padStart("test", null, "0")).toBe("test");
    });

    it("handles undefined length", () => {
      expect(padStart("hello", undefined)).toBe("hello");
      expect(padStart("test", undefined, "0")).toBe("test");
    });

    it("handles both null/undefined", () => {
      expect(padStart(null, null)).toBe("");
      expect(padStart(undefined, undefined)).toBe("");
      expect(padStart(null, undefined, "0")).toBe("");
      expect(padStart(undefined, null, "0")).toBe("");
    });
  });

  describe("edge cases", () => {
    it("[🎯] handles negative length", () => {
      expect(padStart("hello", -1)).toBe("hello");
      expect(padStart("test", -5, "0")).toBe("test");
      expect(padStart("", -1)).toBe("");
    });

    it("handles zero length", () => {
      expect(padStart("hello", 0)).toBe("hello");
      expect(padStart("test", 0, "0")).toBe("test");
      expect(padStart("", 0)).toBe("");
    });

    it("[🎯] handles empty pad string", () => {
      expect(padStart("hello", 10, "")).toBe("hello");
      expect(padStart("test", 8, "")).toBe("test");
      expect(padStart("", 5, "")).toBe("");
    });

    it("[🎯] handles multi-character pad string", () => {
      expect(padStart("hello", 10, "ab")).toBe("ababahello");
      expect(padStart("test", 8, "12")).toBe("1212test");
      expect(padStart("a", 5, "xyz")).toBe("xyzxa");
    });

    it("handles unicode characters", () => {
      expect(padStart("hello", 8, "🚀")).toBe("🚀\ud83dhello");
      expect(padStart("test", 6, "α")).toBe("ααtest");
      expect(padStart("café", 8, "ñ")).toBe("ññññcafé");
    });

    it("handles very long strings", () => {
      const longString = "hello".repeat(1000);
      const result = padStart(longString, longString.length + 5);
      expect(result).toBe("     " + longString);
    });

    it("handles very large length", () => {
      expect(padStart("a", 1000, "0")).toBe("0".repeat(999) + "a");
      expect(padStart("test", 10000, "x")).toBe("x".repeat(9996) + "test");
    });
  });

  describe("real-world usage patterns", () => {
    it("formats numbers with leading zeros", () => {
      expect(padStart("42", 5, "0")).toBe("00042");
      expect(padStart("123", 6, "0")).toBe("000123");
      expect(padStart("7", 3, "0")).toBe("007");
    });

    it("formats IDs with leading zeros", () => {
      expect(padStart("1", 4, "0")).toBe("0001");
      expect(padStart("99", 4, "0")).toBe("0099");
      expect(padStart("1000", 4, "0")).toBe("1000");
    });

    it("aligns text to the right", () => {
      expect(padStart("hello", 10)).toBe("     hello");
      expect(padStart("world", 12)).toBe("       world");
      expect(padStart("test", 8)).toBe("    test");
    });

    it("creates visual separators", () => {
      expect(padStart("test", 8, "-")).toBe("----test");
      expect(padStart("file", 10, ".")).toBe("......file");
      expect(padStart("name", 12, " ")).toBe("        name");
    });

    it("formats file extensions", () => {
      expect(padStart(".js", 6, " ")).toBe("   .js");
      expect(padStart(".ts", 8, " ")).toBe("     .ts");
      expect(padStart(".md", 10, " ")).toBe("       .md");
    });

    it("creates progress indicators", () => {
      expect(padStart("█", 5, "░")).toBe("░░░░█");
      expect(padStart("██", 8, "░")).toBe("░░░░░░██");
      expect(padStart("███", 10, "░")).toBe("░░░░░░░███");
    });

    it("formats timestamps", () => {
      expect(padStart("9", 2, "0")).toBe("09");
      expect(padStart("15", 2, "0")).toBe("15");
      expect(padStart("3", 2, "0")).toBe("03");
    });

    it("creates table-like formatting", () => {
      expect(padStart("Name", 10)).toBe("      Name");
      expect(padStart("Age", 10)).toBe("       Age");
      expect(padStart("City", 10)).toBe("      City");
    });
  });

  describe("performance edge cases", () => {
    it("handles repeated padding efficiently", () => {
      expect(padStart("a", 100, "0")).toBe("0".repeat(99) + "a");
      expect(padStart("test", 1000, "x")).toBe("x".repeat(996) + "test");
    });

    it("handles many small paddings", () => {
      const results = [];
      for (let i = 0; i < 1000; i++) {
        results.push(padStart("a", 5, "0"));
      }
      expect(results.every((r) => r === "0000a")).toBe(true);
    });

    it("handles alternating padding", () => {
      expect(padStart("hello", 10, "ab")).toBe("ababahello");
      expect(padStart("test", 8, "12")).toBe("1212test");
    });
  });

  describe("type safety", () => {
    it("accepts correct types", () => {
      const str: string | null | undefined = "hello";
      const length: number | null | undefined = 10;
      const padString: string = "0";
      expect(padStart(str, length, padString)).toBe("00000hello");
    });

    it("handles mixed null/undefined types", () => {
      expect(padStart("hello", null, "0")).toBe("hello");
      expect(padStart(null, 5, "0")).toBe("00000");
      expect(padStart(undefined, undefined, "0")).toBe("");
    });

    it("handles default padString parameter", () => {
      expect(padStart("hello", 10)).toBe("     hello");
      expect(padStart("test", 8)).toBe("    test");
    });
  });

  describe("boundary conditions", () => {
    it("handles length equal to string length", () => {
      expect(padStart("hello", 5)).toBe("hello");
      expect(padStart("test", 4)).toBe("test");
      expect(padStart("a", 1)).toBe("a");
    });

    it("handles length one greater than string length", () => {
      expect(padStart("hello", 6)).toBe(" hello");
      expect(padStart("test", 5)).toBe(" test");
      expect(padStart("a", 2)).toBe(" a");
    });

    it("handles very small lengths", () => {
      expect(padStart("hello", 1)).toBe("hello");
      expect(padStart("test", 2)).toBe("test");
      expect(padStart("a", 0)).toBe("a");
    });

    it("handles single character padding", () => {
      expect(padStart("hello", 6, "x")).toBe("xhello");
      expect(padStart("test", 5, "y")).toBe("ytest");
      expect(padStart("a", 2, "z")).toBe("za");
    });
  });

  describe("special characters and encoding", () => {
    it("handles special ASCII characters", () => {
      expect(padStart("hello", 8, "!")).toBe("!!!hello");
      expect(padStart("test", 6, "@")).toBe("@@test");
      expect(padStart("a", 3, "#")).toBe("##a");
    });

    it("handles whitespace characters", () => {
      expect(padStart("hello", 8, "\t")).toBe("\t\t\thello");
      expect(padStart("test", 6, "\n")).toBe("\n\ntest");
      expect(padStart("a", 3, " ")).toBe("  a");
    });

    it("handles control characters", () => {
      expect(padStart("hello", 8, "\0")).toBe("\0\0\0hello");
      expect(padStart("test", 6, "\x01")).toBe("\x01\x01test");
    });

    it("handles mixed character sets", () => {
      expect(padStart("hello", 8, "α")).toBe("αααhello");
      expect(padStart("test", 6, "🚀")).toBe("🚀test");
      expect(padStart("café", 8, "ñ")).toBe("ññññcafé");
    });
  });

  describe("deprecation notice", () => {
    it("works as expected despite being deprecated", () => {
      expect(padStart("hello", 10)).toBe("     hello");
      expect(padStart("42", 5, "0")).toBe("00042");
    });

    it("maintains compatibility with native padStart", () => {
      const testCases = [
        ["hello", 10],
        ["hello", 10, "0"],
        ["42", 5, "0"],
        ["test", 8, "-"],
      ];

      testCases.forEach(([str, length, padString]) => {
        const nativeResult = (str as string).padStart(
          length as number,
          padString as string
        );
        const utilResult = padStart(
          str as string,
          length as number,
          padString as string
        );
        expect(utilResult).toBe(nativeResult);
      });
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
      "[🎲] result length is at least max(original, target)",
      (str, length) => {
        const result = padStart(str, length);
        expect(result.length).toBeGreaterThanOrEqual(Math.max(str.length, length));
      }
    );

    itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
      "[🎲] result ends with original string",
      (str, length) => {
        const result = padStart(str, length);
        expect(result.endsWith(str)).toBe(true);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 50 })])(
      "[🎲] consistent with native String.prototype.padStart",
      (str, length) => {
        expect(padStart(str, length)).toBe(str.padStart(length));
      }
    );
  });
});
