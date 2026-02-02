import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { fromPairs } from "./fromPairs";

describe("fromPairs", () => {
  describe("basic functionality", () => {
    it("should create object from array of key-value pairs", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should handle empty array", () => {
      const result = fromPairs([]);
      expect(result).toEqual({});
    });

    it("should handle single pair", () => {
      const pairs: [string, string][] = [["key", "value"]];
      const result = fromPairs(pairs);
      expect(result).toEqual({ key: "value" });
    });

    it("should handle duplicate keys (last wins)", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["a", 3],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 3, b: 2 });
    });
  });

  describe("different data types", () => {
    it("should work with string keys and number values", () => {
      const pairs: [string, string | number | boolean][] = [
        ["name", "John"],
        ["age", 30],
        ["active", true],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ name: "John", age: 30, active: true });
    });

    it("should work with number keys", () => {
      const pairs: [number, string][] = [
        [1, "first"],
        [2, "second"],
        [3, "third"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ 1: "first", 2: "second", 3: "third" });
    });

    it("should work with symbol keys", () => {
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const pairs: [symbol, string][] = [
        [sym1, "value1"],
        [sym2, "value2"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ [sym1]: "value1", [sym2]: "value2" });
    });

    it("should work with mixed key types", () => {
      const sym = Symbol("symbol");
      const pairs: [string | number | symbol, string | number][] = [
        ["string", 1],
        [42, "number"],
        [sym, "symbol"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        string: 1,
        42: "number",
        [sym]: "symbol",
      });
    });

    it("should work with object values", () => {
      const pairs: [string, { name: string; age: number }][] = [
        ["user1", { name: "John", age: 30 }],
        ["user2", { name: "Jane", age: 25 }],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        user1: { name: "John", age: 30 },
        user2: { name: "Jane", age: 25 },
      });
    });

    it("should work with array values", () => {
      const pairs: [string, number[] | string[]][] = [
        ["numbers", [1, 2, 3]],
        ["strings", ["a", "b", "c"]],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        numbers: [1, 2, 3],
        strings: ["a", "b", "c"],
      });
    });

    it("should work with function values", () => {
      const func1 = () => "hello";
      const func2 = () => "world";
      const pairs: [string, () => string][] = [
        ["greet", func1],
        ["say", func2],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ greet: func1, say: func2 });
    });
  });

  describe("edge cases", () => {
    it("should handle undefined values", () => {
      const pairs: [string, number | undefined][] = [
        ["a", undefined],
        ["b", 2],
        ["c", undefined],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: undefined, b: 2, c: undefined });
    });

    it("should handle null values", () => {
      const pairs: [string, number | null][] = [
        ["a", null],
        ["b", 2],
        ["c", null],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: null, b: 2, c: null });
    });

    it("should handle NaN values", () => {
      const pairs: [string, number][] = [
        ["a", NaN],
        ["b", 2],
        ["c", NaN],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: NaN, b: 2, c: NaN });
    });

    it("should handle empty string keys", () => {
      const pairs: [string, string | number][] = [
        ["", "empty"],
        ["b", 2],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ "": "empty", b: 2 });
    });

    it("should handle zero keys", () => {
      const pairs: [number | string, string | number][] = [
        [0, "zero"],
        ["b", 2],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ 0: "zero", b: 2 });
    });

    it("should handle boolean keys", () => {
      const pairs: [string, string][] = [
        ["true", "true"],
        ["false", "false"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ true: "true", false: "false" });
    });

    it("should handle nested objects", () => {
      const pairs: [string, any][] = [
        ["config", { theme: "dark", lang: "en" }],
        ["user", { name: "John", settings: { notifications: true } }],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        config: { theme: "dark", lang: "en" },
        user: { name: "John", settings: { notifications: true } },
      });
    });
  });

  describe("consistency with native Object.fromEntries", () => {
    it("should behave identically to native Object.fromEntries", () => {
      // Test with string keys
      const pairs1: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const customResult1 = fromPairs(pairs1);
      const nativeResult1 = Object.fromEntries(pairs1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with number keys
      const pairs2: [number, string][] = [
        [1, "first"],
        [2, "second"],
        [3, "third"],
      ];
      const customResult2 = fromPairs(pairs2);
      const nativeResult2 = Object.fromEntries(pairs2);
      expect(customResult2).toEqual(nativeResult2);

      // Test with symbol keys
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const pairs3: [symbol, string][] = [
        [sym1, "value1"],
        [sym2, "value2"],
      ];
      const customResult3 = fromPairs(pairs3);
      const nativeResult3 = Object.fromEntries(pairs3);
      expect(customResult3).toEqual(nativeResult3);

      // Test with empty array
      const pairs4: [string, number][] = [];
      const customResult4 = fromPairs(pairs4);
      const nativeResult4 = Object.fromEntries(pairs4);
      expect(customResult4).toEqual(nativeResult4);

      // Test with duplicate keys
      const pairs5: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["a", 3],
      ];
      const customResult5 = fromPairs(pairs5);
      const nativeResult5 = Object.fromEntries(pairs5);
      expect(customResult5).toEqual(nativeResult5);

      // Test with mixed types
      const pairs6: [string | number | symbol, string | number][] = [
        ["string", 1],
        [42, "number"],
        [Symbol("symbol"), "symbol"],
      ];
      const customResult6 = fromPairs(pairs6);
      const nativeResult6 = Object.fromEntries(pairs6);
      expect(customResult6).toEqual(nativeResult6);

      // Test with undefined values
      const pairs7: [string, number | undefined][] = [
        ["a", undefined],
        ["b", 2],
        ["c", undefined],
      ];
      const customResult7 = fromPairs(pairs7);
      const nativeResult7 = Object.fromEntries(pairs7);
      expect(customResult7).toEqual(nativeResult7);

      // Test with null values
      const pairs8: [string, number | null][] = [
        ["a", null],
        ["b", 2],
        ["c", null],
      ];
      const customResult8 = fromPairs(pairs8);
      const nativeResult8 = Object.fromEntries(pairs8);
      expect(customResult8).toEqual(nativeResult8);

      // Test with NaN values
      const pairs9: [string, number][] = [
        ["a", NaN],
        ["b", 2],
        ["c", NaN],
      ];
      const customResult9 = fromPairs(pairs9);
      const nativeResult9 = Object.fromEntries(pairs9);
      expect(customResult9).toEqual(nativeResult9);
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should be equivalent to Object.fromEntries(pairs)", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const customResult = fromPairs(pairs);
      const nativeResult = Object.fromEntries(pairs);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve types correctly", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
      expect(typeof result.a).toBe("number");
      expect(typeof result.b).toBe("number");
      expect(typeof result.c).toBe("number");
    });

    it("should handle union types correctly", () => {
      const pairs: [string, string | number][] = [
        ["name", "John"],
        ["age", 30],
        ["active", "true"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({ name: "John", age: 30, active: "true" });
    });

    it("should handle symbol keys correctly", () => {
      const sym = Symbol("test");
      const pairs: [symbol, string][] = [[sym, "value"]];
      const result = fromPairs(pairs);
      expect(result).toEqual({ [sym]: "value" });
      expect(result[sym]).toBe("value");
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const pairs = Array.from(
        { length: 1000 },
        (_, i) => [`key${i}`, i] as [string, number]
      );
      const result = fromPairs(pairs);
      expect(Object.keys(result)).toHaveLength(1000);
      expect(result.key0).toBe(0);
      expect(result.key999).toBe(999);
    });

    it("should handle arrays with many different key types", () => {
      const pairs: [string | number | symbol, string | number][] = [
        ...Array.from(
          { length: 100 },
          (_, i) => [`str${i}`, i] as [string, number]
        ),
        ...Array.from(
          { length: 100 },
          (_, i) => [i, `num${i}`] as [number, string]
        ),
        ...Array.from(
          { length: 10 },
          (_, i) => [Symbol(`sym${i}`), `sym${i}`] as [symbol, string]
        ),
      ];
      const result = fromPairs(pairs);
      expect(Object.keys(result)).toHaveLength(200);
      expect(Object.getOwnPropertySymbols(result)).toHaveLength(10);
    });
  });

  describe("special cases", () => {
    it("should handle arrays with non-pair elements", () => {
      const pairs = [
        ["a", 1],
        ["b"], // Missing value
        ["c", 3],
      ] as [string, number][];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 1, b: undefined, c: 3 });
    });

    it("should handle arrays with extra elements", () => {
      const pairs = [
        ["a", 1, "extra"],
        ["b", 2],
        ["c", 3],
      ] as [string, number][];
      const result = fromPairs(pairs);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("should handle arrays with nested arrays as keys", () => {
      const pairs: [string, string][] = [
        ["nested,key", "value"],
        ["simple", "value2"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        "nested,key": "value",
        simple: "value2",
      });
    });

    it("should handle arrays with objects as keys", () => {
      const pairs: [string, string][] = [
        ["[object Object]", "value"],
        ["simple", "value2"],
      ];
      const result = fromPairs(pairs);
      expect(result).toEqual({
        "[object Object]": "value",
        simple: "value2",
      });
    });
  });

  describe("deprecation behavior", () => {
    it("should behave identically to Object.fromEntries", () => {
      const testCases: [string | number | symbol, any][][] = [
        [
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ],
        [
          ["name", "John"],
          ["age", 30],
        ],
        [
          [1, "first"],
          [2, "second"],
        ],
        [[Symbol("key"), "value"]],
        [
          ["a", undefined],
          ["b", null],
          ["c", NaN],
        ],
        [
          ["", "empty"],
          [0, "zero"],
        ],
        [
          ["true", "true"],
          ["false", "false"],
        ],
      ];

      testCases.forEach((pairs) => {
        const customResult = fromPairs(pairs);
        const nativeResult = Object.fromEntries(pairs);
        expect(customResult).toEqual(nativeResult);
      });
    });
  });

  itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
    "[🎲] equivalent to Object.fromEntries(pairs)",
    (pairs) => {
      expect(fromPairs(pairs)).toEqual(Object.fromEntries(pairs));
    }
  );
});
