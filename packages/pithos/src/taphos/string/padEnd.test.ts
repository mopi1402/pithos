import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { padEnd } from "./padEnd";

describe("padEnd", () => {
  describe("basic functionality", () => {
    it("pads string with spaces by default", () => {
      expect(padEnd("hello", 10)).toBe("hello     ");
      expect(padEnd("test", 8)).toBe("test    ");
      expect(padEnd("a", 5)).toBe("a    ");
    });

    it("pads string with custom pad string", () => {
      expect(padEnd("hello", 10, "0")).toBe("hello00000");
      expect(padEnd("John", 10)).toBe("John      ");
      expect(padEnd("test", 8, "-")).toBe("test----");
    });

    it("returns original string when no padding needed", () => {
      expect(padEnd("hello", 5)).toBe("hello");
      expect(padEnd("hello world", 5)).toBe("hello world");
      expect(padEnd("test", 4)).toBe("test");
    });

    it("handles empty string", () => {
      expect(padEnd("", 5)).toBe("     ");
      expect(padEnd("", 3, "0")).toBe("000");
      expect(padEnd("", 0)).toBe("");
    });

    it("handles single character strings", () => {
      expect(padEnd("a", 3)).toBe("a  ");
      expect(padEnd("a", 3, "0")).toBe("a00");
      expect(padEnd("a", 1)).toBe("a");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null string", () => {
      expect(padEnd(null, 5)).toBe("     ");
      expect(padEnd(null, 3, "0")).toBe("000");
      expect(padEnd(null, 0)).toBe("");
    });

    it("[🎯] handles undefined string", () => {
      expect(padEnd(undefined, 5)).toBe("     ");
      expect(padEnd(undefined, 3, "0")).toBe("000");
      expect(padEnd(undefined, 0)).toBe("");
    });

    it("handles null length", () => {
      expect(padEnd("hello", null)).toBe("hello");
      expect(padEnd("test", null, "0")).toBe("test");
    });

    it("handles undefined length", () => {
      expect(padEnd("hello", undefined)).toBe("hello");
      expect(padEnd("test", undefined, "0")).toBe("test");
    });

    it("handles both null/undefined", () => {
      expect(padEnd(null, null)).toBe("");
      expect(padEnd(undefined, undefined)).toBe("");
      expect(padEnd(null, undefined, "0")).toBe("");
      expect(padEnd(undefined, null, "0")).toBe("");
    });
  });

  describe("edge cases", () => {
    it("[🎯] handles negative length", () => {
      expect(padEnd("hello", -1)).toBe("hello");
      expect(padEnd("test", -5, "0")).toBe("test");
      expect(padEnd("", -1)).toBe("");
    });

    it("handles zero length", () => {
      expect(padEnd("hello", 0)).toBe("hello");
      expect(padEnd("test", 0, "0")).toBe("test");
      expect(padEnd("", 0)).toBe("");
    });

    it("[🎯] handles empty pad string", () => {
      expect(padEnd("hello", 10, "")).toBe("hello");
      expect(padEnd("test", 8, "")).toBe("test");
      expect(padEnd("", 5, "")).toBe("");
    });

    it("[🎯] handles multi-character pad string", () => {
      expect(padEnd("hello", 10, "ab")).toBe("helloababa");
      expect(padEnd("test", 8, "12")).toBe("test1212");
      expect(padEnd("a", 5, "xyz")).toBe("axyzx");
    });

    it("handles unicode characters", () => {
      expect(padEnd("hello", 8, "🚀")).toBe("hello🚀\ud83d");
      expect(padEnd("test", 6, "α")).toBe("testαα");
      expect(padEnd("café", 8, "ñ")).toBe("caféññññ");
    });

    it("handles very long strings", () => {
      const longString = "hello".repeat(1000);
      const result = padEnd(longString, longString.length + 5);
      expect(result).toBe(longString + "     ");
    });

    it("handles very large length", () => {
      expect(padEnd("a", 1000, "0")).toBe("a" + "0".repeat(999));
      expect(padEnd("test", 10000, "x")).toBe("test" + "x".repeat(9996));
    });
  });

  describe("real-world usage patterns", () => {
    it("aligns text to the left", () => {
      expect(padEnd("hello", 10)).toBe("hello     ");
      expect(padEnd("world", 12)).toBe("world       ");
      expect(padEnd("test", 8)).toBe("test    ");
    });

    it("creates visual separators", () => {
      expect(padEnd("test", 8, "-")).toBe("test----");
      expect(padEnd("file", 10, ".")).toBe("file......");
      expect(padEnd("name", 12, " ")).toBe("name        ");
    });

    it("formats table columns", () => {
      expect(padEnd("Name", 10)).toBe("Name      ");
      expect(padEnd("Age", 10)).toBe("Age       ");
      expect(padEnd("City", 10)).toBe("City      ");
    });

    it("creates progress indicators", () => {
      expect(padEnd("█", 5, "░")).toBe("█░░░░");
      expect(padEnd("██", 8, "░")).toBe("██░░░░░░");
      expect(padEnd("███", 10, "░")).toBe("███░░░░░░░");
    });

    it("formats file names", () => {
      expect(padEnd("file.js", 12)).toBe("file.js     ");
      expect(padEnd("script.ts", 15)).toBe("script.ts      ");
      expect(padEnd("readme.md", 20)).toBe("readme.md           ");
    });

    it("creates status indicators", () => {
      expect(padEnd("Loading", 15, ".")).toBe("Loading........");
      expect(padEnd("Processing", 20, "-")).toBe("Processing----------");
      expect(padEnd("Complete", 12, " ")).toBe("Complete    ");
    });

    it("formats log entries", () => {
      expect(padEnd("[INFO]", 15)).toBe("[INFO]         ");
      expect(padEnd("[ERROR]", 15)).toBe("[ERROR]        ");
      expect(padEnd("[DEBUG]", 15)).toBe("[DEBUG]        ");
    });

    it("creates menu items", () => {
      expect(padEnd("File", 12)).toBe("File        ");
      expect(padEnd("Edit", 12)).toBe("Edit        ");
      expect(padEnd("View", 12)).toBe("View        ");
    });
  });

  describe("performance edge cases", () => {
    it("handles repeated padding efficiently", () => {
      expect(padEnd("a", 100, "0")).toBe("a" + "0".repeat(99));
      expect(padEnd("test", 1000, "x")).toBe("test" + "x".repeat(996));
    });

    it("handles many small paddings", () => {
      const results = [];
      for (let i = 0; i < 1000; i++) {
        results.push(padEnd("a", 5, "0"));
      }
      expect(results.every((r) => r === "a0000")).toBe(true);
    });

    it("handles alternating padding", () => {
      expect(padEnd("hello", 10, "ab")).toBe("helloababa");
      expect(padEnd("test", 8, "12")).toBe("test1212");
    });
  });

  describe("type safety", () => {
    it("accepts correct types", () => {
      const str: string | null | undefined = "hello";
      const length: number | null | undefined = 10;
      const padString: string = "0";
      expect(padEnd(str, length, padString)).toBe("hello00000");
    });

    it("handles mixed null/undefined types", () => {
      expect(padEnd("hello", null, "0")).toBe("hello");
      expect(padEnd(null, 5, "0")).toBe("00000");
      expect(padEnd(undefined, undefined, "0")).toBe("");
    });

    it("handles default padString parameter", () => {
      expect(padEnd("hello", 10)).toBe("hello     ");
      expect(padEnd("test", 8)).toBe("test    ");
    });
  });

  describe("boundary conditions", () => {
    it("handles length equal to string length", () => {
      expect(padEnd("hello", 5)).toBe("hello");
      expect(padEnd("test", 4)).toBe("test");
      expect(padEnd("a", 1)).toBe("a");
    });

    it("handles length one greater than string length", () => {
      expect(padEnd("hello", 6)).toBe("hello ");
      expect(padEnd("test", 5)).toBe("test ");
      expect(padEnd("a", 2)).toBe("a ");
    });

    it("handles very small lengths", () => {
      expect(padEnd("hello", 1)).toBe("hello");
      expect(padEnd("test", 2)).toBe("test");
      expect(padEnd("a", 0)).toBe("a");
    });

    it("handles single character padding", () => {
      expect(padEnd("hello", 6, "x")).toBe("hellox");
      expect(padEnd("test", 5, "y")).toBe("testy");
      expect(padEnd("a", 2, "z")).toBe("az");
    });
  });

  describe("special characters and encoding", () => {
    it("handles special ASCII characters", () => {
      expect(padEnd("hello", 8, "!")).toBe("hello!!!");
      expect(padEnd("test", 6, "@")).toBe("test@@");
      expect(padEnd("a", 3, "#")).toBe("a##");
    });

    it("handles whitespace characters", () => {
      expect(padEnd("hello", 8, "\t")).toBe("hello\t\t\t");
      expect(padEnd("test", 6, "\n")).toBe("test\n\n");
      expect(padEnd("a", 3, " ")).toBe("a  ");
    });

    it("handles control characters", () => {
      expect(padEnd("hello", 8, "\0")).toBe("hello\0\0\0");
      expect(padEnd("test", 6, "\x01")).toBe("test\x01\x01");
    });

    it("handles mixed character sets", () => {
      expect(padEnd("hello", 8, "α")).toBe("helloααα");
      expect(padEnd("test", 6, "🚀")).toBe("test🚀");
      expect(padEnd("café", 8, "ñ")).toBe("caféññññ");
    });
  });

  describe("deprecation notice", () => {
    it("works as expected despite being deprecated", () => {
      expect(padEnd("hello", 10)).toBe("hello     ");
      expect(padEnd("hello", 10, "0")).toBe("hello00000");
    });

    it("maintains compatibility with native padEnd", () => {
      const testCases = [
        ["hello", 10],
        ["hello", 10, "0"],
        ["John", 10],
        ["test", 8, "-"],
      ];

      testCases.forEach(([str, length, padString]) => {
        const nativeResult = (str as string).padEnd(
          length as number,
          padString as string
        );
        const utilResult = padEnd(
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
        const result = padEnd(str, length);
        expect(result.length).toBeGreaterThanOrEqual(Math.max(str.length, length));
      }
    );

    itProp.prop([fc.string(), fc.integer({ min: 0, max: 100 })])(
      "[🎲] result starts with original string",
      (str, length) => {
        const result = padEnd(str, length);
        expect(result.startsWith(str)).toBe(true);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 50 })])(
      "[🎲] consistent with native String.prototype.padEnd",
      (str, length) => {
        expect(padEnd(str, length)).toBe(str.padEnd(length));
      }
    );
  });
});
