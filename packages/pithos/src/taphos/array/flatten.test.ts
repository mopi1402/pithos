import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flatten } from "./flatten";

describe("flatten", () => {
  describe("basic functionality", () => {
    it("should flatten array one level deep", () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, 3, 4, [5, 6]]);
    });

    it("should handle already flat arrays", () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flatten(flat);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty arrays", () => {
      const result = flatten([]);
      expect(result).toEqual([]);
    });

    it("should handle arrays with empty nested arrays", () => {
      const nested = [1, [], [2, 3], []];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle single element arrays", () => {
      const single = [[42]];
      const result = flatten(single);
      expect(result).toEqual([42]);
    });
  });

  describe("different data types", () => {
    it("should work with numbers", () => {
      const numbers = [1, [2, 3], [4, 5]];
      const result = flatten(numbers);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work with strings", () => {
      const strings = ["a", ["b", "c"], ["d", "e"]];
      const result = flatten(strings);
      expect(result).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("should work with mixed types", () => {
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
        ["world", 3],
      ];
      const result = flatten(mixed);
      expect(result).toEqual([1, "hello", 2, "world", 3]);
    });

    it("should work with objects", () => {
      const objects = [{ id: 1 }, [{ id: 2 }, { id: 3 }], [{ id: 4 }]];
      const result = flatten(objects);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });

    it("should work with booleans", () => {
      const booleans = [true, [false, true], [false]];
      const result = flatten(booleans);
      expect(result).toEqual([true, false, true, false]);
    });
  });

  describe("edge cases", () => {
    it("should handle arrays with undefined values", () => {
      const withUndefined = [1, [undefined, 2], [3]];
      const result = flatten(withUndefined);
      expect(result).toEqual([1, undefined, 2, 3]);
    });

    it("should handle arrays with null values", () => {
      const withNull = [1, [null, 2], [3]];
      const result = flatten(withNull);
      expect(result).toEqual([1, null, 2, 3]);
    });

    it("should handle arrays with NaN values", () => {
      const withNaN = [1, [NaN, 2], [3]];
      const result = flatten(withNaN);
      expect(result).toEqual([1, NaN, 2, 3]);
    });

    it("should handle deeply nested arrays (only one level)", () => {
      const deeplyNested = [1, [2, [3, [4, 5]]], [6]];
      const result = flatten(deeplyNested);
      expect(result).toEqual([1, 2, [3, [4, 5]], 6]);
    });

    it("should handle arrays with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const func3 = () => "third";
      const withFunctions = [func1, [func2], [func3]];
      const result = flatten(withFunctions);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(func1);
      expect(result[1]).toBe(func2);
      expect(result[2]).toBe(func3);
    });

    it("should handle arrays with arrays of different lengths", () => {
      const differentLengths = [1, [2], [3, 4, 5], [6, 7]];
      const result = flatten(differentLengths);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe("immutability", () => {
    it("should not modify the original array", () => {
      const original = [1, [2, 3], [4, 5]];
      const originalCopy = JSON.parse(JSON.stringify(original));
      flatten(original);
      expect(original).toEqual(originalCopy);
    });

    it("should return a new array instance", () => {
      const original = [1, [2, 3], [4, 5]];
      const result = flatten(original);
      expect(result).not.toBe(original);
    });

    it("should not modify nested arrays", () => {
      const nested = [1, [2, 3], [4, 5]];
      const nestedCopy = JSON.parse(JSON.stringify(nested));
      flatten(nested);
      expect(nested).toEqual(nestedCopy);
    });
  });

  describe("consistency with native Array.flat", () => {
    it("should behave identically to native Array.flat()", () => {
      // Test with numbers
      const numbers = [1, [2, 3], [4, [5, 6]]];
      const customResult1 = flatten(numbers);
      const nativeResult1 = numbers.flat();
      expect(customResult1).toEqual(nativeResult1);

      // Test with flat array
      const flat = [1, 2, 3, 4, 5];
      const customResult2 = flatten(flat);
      const nativeResult2 = flat.flat();
      expect(customResult2).toEqual(nativeResult2);

      // Test with empty array
      const empty: number[] = [];
      const customResult3 = flatten(empty);
      const nativeResult3 = empty.flat();
      expect(customResult3).toEqual(nativeResult3);

      // Test with empty nested arrays
      const withEmpty = [1, [], [2, 3], []];
      const customResult4 = flatten(withEmpty);
      const nativeResult4 = withEmpty.flat();
      expect(customResult4).toEqual(nativeResult4);

      // Test with single element
      const single = [[42]];
      const customResult5 = flatten(single);
      const nativeResult5 = single.flat();
      expect(customResult5).toEqual(nativeResult5);

      // Test with strings
      const strings = ["a", ["b", "c"], ["d", "e"]];
      const customResult6 = flatten(strings);
      const nativeResult6 = strings.flat();
      expect(customResult6).toEqual(nativeResult6);

      // Test with mixed types
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
        ["world", 3],
      ];
      const customResult7 = flatten(mixed);
      const nativeResult7 = mixed.flat();
      expect(customResult7).toEqual(nativeResult7);

      // Test with undefined
      const withUndefined = [1, [undefined, 2], [3]];
      const customResult8 = flatten(withUndefined);
      const nativeResult8 = withUndefined.flat();
      expect(customResult8).toEqual(nativeResult8);

      // Test with null
      const withNull = [1, [null, 2], [3]];
      const customResult9 = flatten(withNull);
      const nativeResult9 = withNull.flat();
      expect(customResult9).toEqual(nativeResult9);

      // Test with NaN
      const withNaN = [1, [NaN, 2], [3]];
      const customResult10 = flatten(withNaN);
      const nativeResult10 = withNaN.flat();
      expect(customResult10).toEqual(nativeResult10);

      // Test with deeply nested
      const deeplyNested = [1, [2, [3, [4, 5]]], [6]];
      const customResult11 = flatten(deeplyNested);
      const nativeResult11 = deeplyNested.flat();
      expect(customResult11).toEqual(nativeResult11);
    });

    it("should handle sparse arrays like native flat()", () => {
      const sparse = [1, , [2, 3], , [4, 5]];
      const customResult = flatten(sparse);
      const nativeResult = sparse.flat();
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, 3, 4, [5, 6]]);
    });

    it("should be equivalent to nested.flat()", () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const customResult = flatten(nested);
      const nativeResult = nested.flat();
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve types correctly", () => {
      const numbers: (number | number[])[] = [1, [2, 3], [4, 5]];
      const result = flatten(numbers);
      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(result.every((item) => typeof item === "number")).toBe(true);
    });

    it("should handle mixed types correctly", () => {
      const mixed: (string | number | (string | number)[])[] = [
        "hello",
        [1, 2],
        ["world", 3],
      ];
      const result = flatten(mixed);
      expect(result).toEqual(["hello", 1, 2, "world", 3]);
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => [i, i + 1]);
      const result = flatten(largeArray);
      expect(result).toHaveLength(2000);
      expect(result[0]).toBe(0);
      expect(result[1999]).toBe(1000);
    });

    it("should handle arrays with many nested levels (only flattens one level)", () => {
      const deeplyNested = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const result = flatten(deeplyNested);
      expect(result).toEqual([1, 2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]);
    });
  });

  describe("special array types", () => {
    it("should handle typed arrays", () => {
      const typedArray = [1, new Uint8Array([2, 3]), [4, 5]];
      const result = flatten(typedArray);
      expect(result).toEqual([1, new Uint8Array([2, 3]), 4, 5]);
    });

    it("should handle arrays with symbols", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const sym3 = Symbol("test3");
      const withSymbols = [sym1, [sym2], [sym3]];
      const result = flatten(withSymbols);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(sym1);
      expect(result[1]).toBe(sym2);
      expect(result[2]).toBe(sym3);
    });

    it("should handle arrays with bigints", () => {
      const withBigInts = [1n, [2n, 3n], [4n]];
      const result = flatten(withBigInts);
      expect(result).toEqual([1n, 2n, 3n, 4n]);
    });
  });

  itProp.prop([fc.array(fc.oneof(fc.integer(), fc.array(fc.integer())))])(
    "[🎲] equivalent to arr.flat()",
    (arr) => {
      expect(flatten(arr)).toEqual(arr.flat());
    }
  );

  itProp.prop([fc.array(fc.oneof(fc.integer(), fc.array(fc.integer())))])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = JSON.parse(JSON.stringify(arr));
      flatten(arr);
      expect(arr).toEqual(copy);
    }
  );
});
