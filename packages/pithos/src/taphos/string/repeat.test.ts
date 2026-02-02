import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { repeat } from "./repeat";

describe("repeat", () => {
  describe("basic functionality", () => {
    it("repeats string multiple times", () => {
      expect(repeat("hello", 3)).toBe("hellohellohello");
      expect(repeat("abc", 2)).toBe("abcabc");
      expect(repeat("x", 5)).toBe("xxxxx");
    });

    it("handles single repetition", () => {
      expect(repeat("hello", 1)).toBe("hello");
      expect(repeat("test", 1)).toBe("test");
    });

    it("[🎯] handles zero repetition", () => {
      expect(repeat("hello", 0)).toBe("");
      expect(repeat("test", 0)).toBe("");
    });

    it("[🎯] handles negative count", () => {
      expect(repeat("hello", -1)).toBe("");
      expect(repeat("test", -5)).toBe("");
    });

    it("[🎯] handles empty string", () => {
      expect(repeat("", 5)).toBe("");
      expect(repeat("", 0)).toBe("");
      expect(repeat("", 10)).toBe("");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null string", () => {
      expect(repeat(null, 3)).toBe("");
      expect(repeat(null, 0)).toBe("");
      expect(repeat(null, null)).toBe("");
    });

    it("handles undefined string", () => {
      expect(repeat(undefined, 3)).toBe("");
      expect(repeat(undefined, 0)).toBe("");
      expect(repeat(undefined, undefined)).toBe("");
    });

    it("handles null count", () => {
      expect(repeat("hello", null)).toBe("");
      expect(repeat("test", null)).toBe("");
    });

    it("handles undefined count", () => {
      expect(repeat("hello", undefined)).toBe("");
      expect(repeat("test", undefined)).toBe("");
    });

    it("handles both parameters null/undefined", () => {
      expect(repeat(null, null)).toBe("");
      expect(repeat(undefined, undefined)).toBe("");
      expect(repeat(null, undefined)).toBe("");
      expect(repeat(undefined, null)).toBe("");
    });
  });

  describe("edge cases", () => {
    it("handles single character strings", () => {
      expect(repeat("a", 3)).toBe("aaa");
      expect(repeat(" ", 4)).toBe("    ");
      expect(repeat("-", 10)).toBe("----------");
    });

    it("handles whitespace strings", () => {
      expect(repeat(" ", 5)).toBe("     ");
      expect(repeat("\t", 3)).toBe("\t\t\t");
      expect(repeat("\n", 2)).toBe("\n\n");
    });

    it("handles special characters", () => {
      expect(repeat("!", 3)).toBe("!!!");
      expect(repeat("@", 2)).toBe("@@");
      expect(repeat("#$%", 2)).toBe("#$%#$%");
    });

    it("handles unicode characters", () => {
      expect(repeat("é", 3)).toBe("ééé");
      expect(repeat("🚀", 2)).toBe("🚀🚀");
      expect(repeat("αβ", 2)).toBe("αβαβ");
    });
  });

  describe("real-world usage patterns", () => {
    it("generates separators", () => {
      expect(repeat("-", 20)).toBe("--------------------");
      expect(repeat("=", 10)).toBe("==========");
    });

    it("generates indentation", () => {
      expect(repeat(" ", 4)).toBe("    ");
      expect(repeat("\t", 2)).toBe("\t\t");
    });

    it("generates loading indicators", () => {
      expect(repeat(".", 3)).toBe("...");
      expect(repeat("*", 5)).toBe("*****");
    });

    it("generates patterns", () => {
      expect(repeat("ab", 3)).toBe("ababab");
      expect(repeat("01", 4)).toBe("01010101");
    });
  });

  describe("large counts", () => {
    it("handles large repetition counts", () => {
      const result = repeat("a", 1000);
      expect(result).toHaveLength(1000);
      expect(result).toBe("a".repeat(1000));
    });

    it("handles very large counts", () => {
      const result = repeat("test", 10000);
      expect(result).toHaveLength(40000);
      expect(result).toBe("test".repeat(10000));
    });
  });

  describe("type safety", () => {
    it("accepts string types correctly", () => {
      const str: string = "hello";
      const count: number = 3;
      expect(repeat(str, count)).toBe("hellohellohello");
    });

    it("handles mixed null/undefined types", () => {
      const str: string | null = null;
      const count: number | undefined = undefined;
      expect(repeat(str, count)).toBe("");
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string(), fc.integer({ min: 0, max: 20 })])(
      "[🎲] result length equals string length times count",
      (str, count) => {
        const result = repeat(str, count);
        expect(result.length).toBe(str.length * count);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 10 })])(
      "[🎲] consistent with native String.prototype.repeat",
      (str, count) => {
        expect(repeat(str, count)).toBe(str.repeat(count));
      }
    );

    itProp.prop([fc.string(), fc.integer({ min: 2, max: 10 })])(
      "[🎲] result starts and ends with original string",
      (str, count) => {
        if (str.length === 0) return;
        const result = repeat(str, count);
        expect(result.startsWith(str)).toBe(true);
        expect(result.endsWith(str)).toBe(true);
      }
    );
  });
});
