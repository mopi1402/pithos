import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flattenDepth } from "./flattenDepth";

describe("flattenDepth", () => {
  describe("basic functionality", () => {
    it("should flatten array one level deep by default", () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const result = flattenDepth(nested);
      expect(result).toEqual([1, 2, 3, 4, [5, 6]]);
    });

    it("should flatten array to specified depth", () => {
      const nested = [1, [2, [3, [4]]]];
      const result1 = flattenDepth(nested, 1);
      expect(result1).toEqual([1, 2, [3, [4]]]);

      const result2 = flattenDepth(nested, 2);
      expect(result2).toEqual([1, 2, 3, [4]]);

      const result3 = flattenDepth(nested, 3);
      expect(result3).toEqual([1, 2, 3, 4]);
    });

    it("should handle already flat arrays", () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flattenDepth(flat, 2);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty arrays", () => {
      const result = flattenDepth([], 2);
      expect(result).toEqual([]);
    });

    it("should handle arrays with empty nested arrays", () => {
      const nested = [1, [], [2, 3], []];
      const result = flattenDepth(nested, 1);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle single element arrays", () => {
      const single = [[42]];
      const result = flattenDepth(single, 1);
      expect(result).toEqual([42]);
    });
  });

  describe("depth parameter behavior", () => {
    it("should handle depth 0 (no flattening)", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, 0);
      expect(result).toEqual([1, [2, [3, [4]]]]);
    });

    it("should handle negative depth (no flattening)", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, -1);
      expect(result).toEqual([1, [2, [3, [4]]]]);
    });

    it("should handle depth greater than nesting level", () => {
      const nested = [1, [2, [3]]];
      const result = flattenDepth(nested, 10);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle depth equal to nesting level", () => {
      const nested = [1, [2, [3]]];
      const result = flattenDepth(nested, 2);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle depth less than nesting level", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, 2);
      expect(result).toEqual([1, 2, 3, [4]]);
    });
  });

  describe("different data types", () => {
    it("should work with numbers", () => {
      const numbers = [1, [2, [3, [4, 5]]]];
      const result = flattenDepth(numbers, 2);
      expect(result).toEqual([1, 2, 3, [4, 5]]);
    });

    it("should work with strings", () => {
      const strings = ["a", ["b", ["c", ["d", "e"]]]];
      const result = flattenDepth(strings, 2);
      expect(result).toEqual(["a", "b", "c", ["d", "e"]]);
    });

    it("should work with mixed types", () => {
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
      ];
      const result = flattenDepth(mixed, 2);
      expect(result).toEqual([1, "hello", 2]);
    });

    it("should work with objects", () => {
      const objects = [{ id: 1 }, [{ id: 2 }, [{ id: 3 }, [{ id: 4 }]]]];
      const result = flattenDepth(objects, 2);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, [{ id: 4 }]]);
    });

    it("should work with booleans", () => {
      const booleans = [true, [false, [true, [false]]]];
      const result = flattenDepth(booleans, 2);
      expect(result).toEqual([true, false, true, [false]]);
    });
  });

  describe("edge cases", () => {
    it("should handle arrays with undefined values", () => {
      const withUndefined: (number | (number | undefined)[])[] = [
        1,
        [undefined, 2],
      ];
      const result = flattenDepth(withUndefined, 2);
      expect(result).toEqual([1, undefined, 2]);
    });

    it("should handle arrays with null values", () => {
      const withNull: (number | (number | null)[])[] = [1, [null, 2]];
      const result = flattenDepth(withNull, 2);
      expect(result).toEqual([1, null, 2]);
    });

    it("should handle arrays with NaN values", () => {
      const withNaN: (number | number[])[] = [1, [NaN, 2]];
      const result = flattenDepth(withNaN, 2);
      expect(result).toEqual([1, NaN, 2]);
    });

    it("should handle arrays with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const func3 = () => "third";
      const withFunctions = [func1, [func2, [func3]]];
      const result = flattenDepth(withFunctions, 2);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(func1);
      expect(result[1]).toBe(func2);
      expect(result[2]).toBe(func3);
    });

    it("should handle arrays with arrays of different nesting depths", () => {
      const differentDepths = [1, [2], [3, [4, [5]]], [6, [7]]];
      const result = flattenDepth(differentDepths, 2);
      expect(result).toEqual([1, 2, 3, 4, [5], 6, 7]);
    });

    it("should handle very deeply nested arrays", () => {
      const veryDeep = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const result = flattenDepth(veryDeep, 3);
      expect(result).toEqual([1, 2, 3, 4, [5, [6, [7, [8, [9, [10]]]]]]]);
    });
  });

  describe("immutability", () => {
    it("should not modify the original array", () => {
      const original = [1, [2, [3, [4, 5]]]];
      const originalCopy = JSON.parse(JSON.stringify(original));
      flattenDepth(original, 2);
      expect(original).toEqual(originalCopy);
    });

    it("should return a new array instance", () => {
      const original = [1, [2, [3, [4, 5]]]];
      const result = flattenDepth(original, 2);
      expect(result).not.toBe(original);
    });

    it("should not modify nested arrays", () => {
      const nested = [1, [2, [3, [4, 5]]]];
      const nestedCopy = JSON.parse(JSON.stringify(nested));
      flattenDepth(nested, 2);
      expect(nested).toEqual(nestedCopy);
    });
  });

  describe("consistency with native Array.flat", () => {
    it("should behave identically to native Array.flat(depth)", () => {
      // Test with depth 1
      const nested1 = [1, [2, [3, [4]]]];
      const customResult1 = flattenDepth(nested1, 1);
      const nativeResult1 = nested1.flat(1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with depth 2
      const nested2 = [1, [2, [3, [4]]]];
      const customResult2 = flattenDepth(nested2, 2);
      const nativeResult2 = nested2.flat(2);
      expect(customResult2).toEqual(nativeResult2);

      // Test with depth 0
      const nested3 = [1, [2, [3, [4]]]];
      const customResult3 = flattenDepth(nested3, 0);
      const nativeResult3 = nested3.flat(0);
      expect(customResult3).toEqual(nativeResult3);

      // Test with default depth (1)
      const nested4 = [1, [2, [3, [4]]]];
      const customResult4 = flattenDepth(nested4);
      const nativeResult4 = nested4.flat(1);
      expect(customResult4).toEqual(nativeResult4);

      // Test with empty array
      const empty: number[] = [];
      const customResult5 = flattenDepth(empty, 2);
      const nativeResult5 = empty.flat(2);
      expect(customResult5).toEqual(nativeResult5);

      // Test with flat array
      const flat = [1, 2, 3, 4, 5];
      const customResult6 = flattenDepth(flat, 3);
      const nativeResult6 = flat.flat(3);
      expect(customResult6).toEqual(nativeResult6);

      // Test with mixed types
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
      ];
      const customResult7 = flattenDepth(mixed, 2);
      const nativeResult7 = mixed.flat(2);
      expect(customResult7).toEqual(nativeResult7);

      // Test with undefined
      const withUndefined: (number | (number | undefined)[])[] = [
        1,
        [undefined, 2],
      ];
      const customResult8 = flattenDepth(withUndefined, 2);
      const nativeResult8 = withUndefined.flat(2);
      expect(customResult8).toEqual(nativeResult8);

      // Test with null
      const withNull: (number | (number | null)[])[] = [1, [null, 2]];
      const customResult9 = flattenDepth(withNull, 2);
      const nativeResult9 = withNull.flat(2);
      expect(customResult9).toEqual(nativeResult9);

      // Test with NaN
      const withNaN: (number | number[])[] = [1, [NaN, 2]];
      const customResult10 = flattenDepth(withNaN, 2);
      const nativeResult10 = withNaN.flat(2);
      expect(customResult10).toEqual(nativeResult10);
    });

    it("should handle sparse arrays like native flat(depth)", () => {
      const sparse = [1, , [2, [3]], , [4, [5]]];
      const customResult = flattenDepth(sparse, 2);
      const nativeResult = sparse.flat(2);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("examples from documentation", () => {
    it("should match the first example from documentation", () => {
      const nested = [1, [2, [3, [4]]]];
      const result1 = flattenDepth(nested, 1);
      expect(result1).toEqual([1, 2, [3, [4]]]);

      const result2 = flattenDepth(nested, 2);
      expect(result2).toEqual([1, 2, 3, [4]]);

      const result3 = flattenDepth(nested, 3);
      expect(result3).toEqual([1, 2, 3, 4]);
    });

    it("should match the second example from documentation", () => {
      const data = [
        { users: [{ name: "John" }, { name: "Jane" }] },
        { users: [{ name: "Bob" }] },
      ];
      const users = flattenDepth(
        data.map((item) => item.users),
        1
      );
      expect(users).toEqual([
        { name: "John" },
        { name: "Jane" },
        { name: "Bob" },
      ]);
    });

    it("should be equivalent to nested.flat(depth)", () => {
      const nested = [1, [2, [3, [4]]]];
      const customResult = flattenDepth(nested, 2);
      const nativeResult = nested.flat(2);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve types correctly", () => {
      const numbers: (number | number[])[] = [1, [2, 3]];
      const result = flattenDepth(numbers, 2);
      expect(result).toEqual([1, 2, 3]);
      expect(result.every((item) => typeof item === "number")).toBe(true);
    });

    it("should handle mixed types correctly", () => {
      const mixed: (string | number | (string | number)[])[] = [
        "hello",
        [1, 2],
      ];
      const result = flattenDepth(mixed, 2);
      expect(result).toEqual(["hello", 1, 2]);
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => [
        i,
        [i + 1, [i + 2, [i + 3]]],
      ]);
      const result = flattenDepth(largeArray, 2);
      expect(result).toHaveLength(300);
      expect(result[0]).toBe(0);
      expect(result[299]).toEqual([101, [102]]);
    });

    it("should handle arrays with many nested levels", () => {
      const deeplyNested = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const result = flattenDepth(deeplyNested, 5);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, [7, [8, [9, [10]]]]]);
    });
  });

  describe("special array types", () => {
    it("should handle typed arrays", () => {
      const typedArray: (number | number[])[] = [1, [4, 5]];
      const result = flattenDepth(typedArray, 2);
      expect(result).toEqual([1, 4, 5]);
    });

    it("should handle arrays with symbols", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const sym3 = Symbol("test3");
      const withSymbols = [sym1, [sym2, [sym3]]];
      const result = flattenDepth(withSymbols, 2);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(sym1);
      expect(result[1]).toBe(sym2);
      expect(result[2]).toBe(sym3);
    });

    it("should handle arrays with bigints", () => {
      const withBigInts = [1n, [2n, [3n, [4n]]]];
      const result = flattenDepth(withBigInts, 2);
      expect(result).toEqual([1n, 2n, 3n, [4n]]);
    });
  });

  describe("depth edge cases", () => {
    it("should handle very large depth values", () => {
      const nested = [1, [2, [3]]];
      const result = flattenDepth(nested, 1000);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle depth with floating point numbers", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, 2.5);
      expect(result).toEqual([1, 2, 3, [4]]);
    });

    it("should handle depth with NaN", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, NaN);
      expect(result).toEqual([1, [2, [3, [4]]]]);
    });

    it("should handle depth with Infinity", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested, Infinity);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("default parameter behavior", () => {
    it("should use default depth of 1 when no depth is provided", () => {
      const nested = [1, [2, [3, [4]]]];
      const result = flattenDepth(nested);
      expect(result).toEqual([1, 2, [3, [4]]]);
    });

    it("should be equivalent to flattenDepth(nested, 1)", () => {
      const nested = [1, [2, [3, [4]]]];
      const result1 = flattenDepth(nested);
      const result2 = flattenDepth(nested, 1);
      expect(result1).toEqual(result2);
    });
  });

  itProp.prop([
    fc.array(fc.oneof(fc.integer(), fc.array(fc.integer()))),
    fc.integer({ min: 0, max: 5 }),
  ])("[🎲] equivalent to arr.flat(depth)", (arr, depth) => {
    expect(flattenDepth(arr, depth)).toEqual(arr.flat(depth));
  });

  itProp.prop([fc.array(fc.oneof(fc.integer(), fc.array(fc.integer())))])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = JSON.parse(JSON.stringify(arr));
      flattenDepth(arr, 2);
      expect(arr).toEqual(copy);
    }
  );
});
