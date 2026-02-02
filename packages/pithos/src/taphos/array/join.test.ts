import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { join } from "./join";

describe("join", () => {
  describe("should join array elements with separator", () => {
    it("should join numbers with default separator", () => {
      const numbers = [1, 2, 3, 4, 5];
      expect(join(numbers)).toBe("1,2,3,4,5");
    });

    it("should join numbers with custom separator", () => {
      const numbers = [1, 2, 3, 4, 5];
      expect(join(numbers, "-")).toBe("1-2-3-4-5");
    });

    it("should join strings with separator", () => {
      const strings = ["hello", "world", "test"];
      expect(join(strings, " ")).toBe("hello world test");
    });

    it("should join mixed types", () => {
      const mixed = [1, "hello", true, null];
      expect(join(mixed, "|")).toBe("1|hello|true|");
    });

    it("should join with empty separator", () => {
      const numbers = [1, 2, 3];
      expect(join(numbers, "")).toBe("123");
    });

    it("should join with multi-character separator", () => {
      const words = ["a", "b", "c"];
      expect(join(words, " -> ")).toBe("a -> b -> c");
    });
  });

  describe("should handle edge cases", () => {
    it("should handle empty array", () => {
      expect(join([])).toBe("");
      expect(join([], "-")).toBe("");
    });

    it("should handle single element array", () => {
      expect(join([42])).toBe("42");
      expect(join([42], "-")).toBe("42");
    });

    it("should handle array with undefined elements", () => {
      const arr = [1, undefined, 3];
      expect(join(arr, ",")).toBe("1,,3");
    });

    it("should handle array with null elements", () => {
      const arr = [1, null, 3];
      expect(join(arr, ",")).toBe("1,,3");
    });

    it("should handle array with empty string elements", () => {
      const arr = ["a", "", "c"];
      expect(join(arr, ",")).toBe("a,,c");
    });

    it("should handle array with objects", () => {
      const arr = [{ a: 1 }, { b: 2 }];
      expect(join(arr, ",")).toBe("[object Object],[object Object]");
    });

    it("should handle array with functions", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const arr = [fn1, fn2];
      const result = join(arr, ",");
      expect(result).toContain("() => {");
      expect(result).toContain("}");
    });

    it("should handle array with arrays", () => {
      const arr = [
        [1, 2],
        [3, 4],
      ];
      expect(join(arr, ",")).toBe("1,2,3,4");
    });

    it("should handle array with symbols", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const arr = [sym1, sym2];
      // Symbols cannot be converted to string in join, this will throw
      expect(() => join(arr, ",")).toThrow(
        "Cannot convert a Symbol value to a string"
      );
    });

    it("should handle array with bigint", () => {
      const arr = [BigInt(123), BigInt(456)];
      expect(join(arr, ",")).toBe("123,456");
    });
  });

  describe("should handle special separators", () => {
    it("should handle newline separator", () => {
      const words = ["line1", "line2", "line3"];
      expect(join(words, "\n")).toBe("line1\nline2\nline3");
    });

    it("should handle tab separator", () => {
      const words = ["col1", "col2", "col3"];
      expect(join(words, "\t")).toBe("col1\tcol2\tcol3");
    });

    it("should handle special characters", () => {
      const words = ["a", "b", "c"];
      expect(join(words, "&")).toBe("a&b&c");
      expect(join(words, "#")).toBe("a#b#c");
      expect(join(words, "@")).toBe("a@b@c");
    });

    it("should handle unicode separators", () => {
      const words = ["a", "b", "c"];
      expect(join(words, "→")).toBe("a→b→c");
      expect(join(words, "★")).toBe("a★b★c");
    });
  });

  describe("should handle large arrays", () => {
    it("should handle large array efficiently", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const result = join(largeArray, ",");
      expect(result).toContain("0,1,2");
      expect(result).toContain("998,999");
      expect(result.split(",")).toHaveLength(1000);
    });

    it("should handle array with long strings", () => {
      const longStrings = ["a".repeat(100), "b".repeat(100), "c".repeat(100)];
      const result = join(longStrings, "|");
      expect(result).toContain("a".repeat(100));
      expect(result).toContain("b".repeat(100));
      expect(result).toContain("c".repeat(100));
    });
  });

  describe("should preserve original array", () => {
    it("should not modify original array", () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      join(original, "-");
      expect(original).toEqual(originalCopy);
    });
  });

  describe("should handle typed arrays", () => {
    it("should work with typed arrays", () => {
      const typedArray = new Int32Array([1, 2, 3]);
      expect(join(Array.from(typedArray), ",")).toBe("1,2,3");
    });

    it("should work with Uint8Array", () => {
      const uint8Array = new Uint8Array([65, 66, 67]); // ASCII for 'A', 'B', 'C'
      expect(join(Array.from(uint8Array), ",")).toBe("65,66,67");
    });
  });

  describe("should handle sparse arrays", () => {
    it("should handle sparse array", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      expect(join(sparse, ",")).toBe("1,,3");
    });

    it("should handle array with holes", () => {
      const arr = new Array(3);
      arr[0] = "a";
      arr[2] = "c";
      expect(join(arr, ",")).toBe("a,,c");
    });
  });

  describe("should handle array-like objects", () => {
    it("should work with arguments object", () => {
      function testFunction(a?: any, b?: any, c?: any) {
        // Convert arguments to array first since join expects a real array
        return join(Array.from(arguments), ",");
      }
      expect(testFunction(1, 2, 3)).toBe("1,2,3");
    });

    it("should work with NodeList-like object", () => {
      const nodeListLike = {
        0: "a",
        1: "b",
        2: "c",
        length: 3,
      };
      // Convert to array first since join expects a real array
      expect(join(Array.from(nodeListLike), ",")).toBe("a,b,c");
    });
  });

  describe("type safety", () => {
    it("should maintain type safety", () => {
      const numbers: number[] = [1, 2, 3];
      const result: string = join(numbers, "-");
      expect(typeof result).toBe("string");
    });

    it("should work with generic types", () => {
      const strings: string[] = ["a", "b", "c"];
      const result = join(strings, "|");
      expect(result).toBe("a|b|c");
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.string()])(
    "[🎲] equivalent to arr.join(separator)",
    (arr, separator) => {
      expect(join(arr, separator)).toBe(arr.join(separator));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] join with default separator equals arr.join()",
    (arr) => {
      expect(join(arr)).toBe(arr.join());
    }
  );
});
