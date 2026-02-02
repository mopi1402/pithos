import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { flattenDeep } from "./flattenDeep";

describe("flattenDeep", () => {
  describe("basic functionality", () => {
    it("should flatten deeply nested arrays completely", () => {
      const deeplyNested = [1, [2, [3, [4, [5]]]]];
      const result = flattenDeep(deeplyNested);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle already flat arrays", () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flattenDeep(flat);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty arrays", () => {
      const result = flattenDeep([]);
      expect(result).toEqual([]);
    });

    it("should handle arrays with empty nested arrays", () => {
      const nested = [1, [], [2, [3]], []];
      const result = flattenDeep(nested);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle single element arrays", () => {
      const single = [[[[42]]]];
      const result = flattenDeep(single);
      expect(result).toEqual([42]);
    });

    it("should flatten mixed nesting levels", () => {
      const mixed = [1, [2, [3]], [4, [5, [6]]]];
      const result = flattenDeep(mixed);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("different data types", () => {
    it("should work with numbers", () => {
      const numbers = [1, [2, [3, [4, 5]]]];
      const result = flattenDeep(numbers);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work with strings", () => {
      const strings = ["a", ["b", ["c", ["d", "e"]]]];
      const result = flattenDeep(strings);
      expect(result).toEqual(["a", "b", "c", "d", "e"]);
    });

    it("should work with mixed types", () => {
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
      ];
      const result = flattenDeep(mixed);
      expect(result).toEqual([1, "hello", 2]);
    });

    it("should work with objects", () => {
      const objects = [{ id: 1 }, [{ id: 2 }, [{ id: 3 }, [{ id: 4 }]]]];
      const result = flattenDeep(objects);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });

    it("should work with booleans", () => {
      const booleans = [true, [false, [true, [false]]]];
      const result = flattenDeep(booleans);
      expect(result).toEqual([true, false, true, false]);
    });
  });

  describe("edge cases", () => {
    it("should handle arrays with undefined values", () => {
      const withUndefined: (number | (number | undefined)[])[] = [
        1,
        [undefined, 2],
      ];
      const result = flattenDeep(withUndefined);
      expect(result).toEqual([1, undefined, 2]);
    });

    it("should handle arrays with null values", () => {
      const withNull: (number | (number | null)[])[] = [1, [null, 2]];
      const result = flattenDeep(withNull);
      expect(result).toEqual([1, null, 2]);
    });

    it("should handle arrays with NaN values", () => {
      const withNaN: (number | number[])[] = [1, [NaN, 2]];
      const result = flattenDeep(withNaN);
      expect(result).toEqual([1, NaN, 2]);
    });

    it("should handle very deeply nested arrays", () => {
      const veryDeep = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const result = flattenDeep(veryDeep);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should handle arrays with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const func3 = () => "third";
      const withFunctions = [func1, [func2, [func3]]];
      const result = flattenDeep(withFunctions);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(func1);
      expect(result[1]).toBe(func2);
      expect(result[2]).toBe(func3);
    });

    it("should handle arrays with arrays of different nesting depths", () => {
      const differentDepths = [1, [2], [3, [4, [5]]], [6, [7]]];
      const result = flattenDeep(differentDepths);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe("immutability", () => {
    it("should not modify the original array", () => {
      const original = [1, [2, [3, [4, 5]]]];
      const originalCopy = JSON.parse(JSON.stringify(original));
      flattenDeep(original);
      expect(original).toEqual(originalCopy);
    });

    it("should return a new array instance", () => {
      const original = [1, [2, [3, [4, 5]]]];
      const result = flattenDeep(original);
      expect(result).not.toBe(original);
    });

    it("should not modify nested arrays", () => {
      const nested = [1, [2, [3, [4, 5]]]];
      const nestedCopy = JSON.parse(JSON.stringify(nested));
      flattenDeep(nested);
      expect(nested).toEqual(nestedCopy);
    });
  });

  describe("consistency with native Array.flat(Infinity)", () => {
    it("should behave identically to native Array.flat(Infinity)", () => {
      // Test with deeply nested numbers
      const numbers = [1, [2, [3, [4, [5]]]]];
      const customResult1 = flattenDeep(numbers);
      const nativeResult1 = numbers.flat(Infinity);
      expect(customResult1).toEqual(nativeResult1);

      // Test with flat array
      const flat = [1, 2, 3, 4, 5];
      const customResult2 = flattenDeep(flat);
      const nativeResult2 = flat.flat(Infinity);
      expect(customResult2).toEqual(nativeResult2);

      // Test with empty array
      const empty: number[] = [];
      const customResult3 = flattenDeep(empty);
      const nativeResult3 = empty.flat(Infinity);
      expect(customResult3).toEqual(nativeResult3);

      // Test with empty nested arrays
      const withEmpty = [1, [], [2, [3]], []];
      const customResult4 = flattenDeep(withEmpty);
      const nativeResult4 = withEmpty.flat(Infinity);
      expect(customResult4).toEqual(nativeResult4);

      // Test with single element
      const single = [[[[42]]]];
      const customResult5 = flattenDeep(single);
      const nativeResult5 = single.flat(Infinity);
      expect(customResult5).toEqual(nativeResult5);

      // Test with strings
      const strings = ["a", ["b", ["c", ["d", "e"]]]];
      const customResult6 = flattenDeep(strings);
      const nativeResult6 = strings.flat(Infinity);
      expect(customResult6).toEqual(nativeResult6);

      // Test with mixed types
      const mixed: (string | number | (string | number)[])[] = [
        1,
        ["hello", 2],
      ];
      const customResult7 = flattenDeep(mixed);
      const nativeResult7 = mixed.flat(Infinity);
      expect(customResult7).toEqual(nativeResult7);

      // Test with undefined
      const withUndefined: (number | (number | undefined)[])[] = [
        1,
        [undefined, 2],
      ];
      const customResult8 = flattenDeep(withUndefined);
      const nativeResult8 = withUndefined.flat(Infinity);
      expect(customResult8).toEqual(nativeResult8);

      // Test with null
      const withNull: (number | (number | null)[])[] = [1, [null, 2]];
      const customResult9 = flattenDeep(withNull);
      const nativeResult9 = withNull.flat(Infinity);
      expect(customResult9).toEqual(nativeResult9);

      // Test with NaN
      const withNaN: (number | number[])[] = [1, [NaN, 2]];
      const customResult10 = flattenDeep(withNaN);
      const nativeResult10 = withNaN.flat(Infinity);
      expect(customResult10).toEqual(nativeResult10);

      // Test with very deeply nested
      const veryDeep = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const customResult11 = flattenDeep(veryDeep);
      const nativeResult11 = veryDeep.flat(Infinity);
      expect(customResult11).toEqual(nativeResult11);
    });

    it("should handle sparse arrays like native flat(Infinity)", () => {
      const sparse = [1, , [2, [3]], , [4, [5]]];
      const customResult = flattenDeep(sparse);
      const nativeResult = sparse.flat(Infinity);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const deeplyNested = [1, [2, [3, [4, [5]]]]];
      const result = flattenDeep(deeplyNested);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should be equivalent to deeplyNested.flat(Infinity)", () => {
      const deeplyNested = [1, [2, [3, [4, [5]]]]];
      const customResult = flattenDeep(deeplyNested);
      const nativeResult = deeplyNested.flat(Infinity);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve types correctly", () => {
      const numbers: (number | number[])[] = [1, [2, 3]];
      const result = flattenDeep(numbers);
      expect(result).toEqual([1, 2, 3]);
      expect(result.every((item) => typeof item === "number")).toBe(true);
    });

    it("should handle mixed types correctly", () => {
      const mixed: (string | number | (string | number)[])[] = [
        "hello",
        [1, 2],
      ];
      const result = flattenDeep(mixed);
      expect(result).toEqual(["hello", 1, 2]);
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => [
        i,
        [i + 1, [i + 2, [i + 3]]],
      ]);
      const result = flattenDeep(largeArray);
      expect(result).toHaveLength(400);
      expect(result[0]).toBe(0);
      expect(result[399]).toBe(102);
    });

    it("should handle arrays with many nested levels", () => {
      const deeplyNested = [1, [2, [3, [4, [5, [6, [7, [8, [9, [10]]]]]]]]]];
      const result = flattenDeep(deeplyNested);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe("special array types", () => {
    it("should handle typed arrays", () => {
      const typedArray: (number | number[])[] = [1, [4, 5]];
      const result = flattenDeep(typedArray);
      expect(result).toEqual([1, 4, 5]);
    });

    it("should handle arrays with symbols", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const sym3 = Symbol("test3");
      const withSymbols = [sym1, [sym2, [sym3]]];
      const result = flattenDeep(withSymbols);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(sym1);
      expect(result[1]).toBe(sym2);
      expect(result[2]).toBe(sym3);
    });

    it("should handle arrays with bigints", () => {
      const withBigInts = [1n, [2n, [3n, [4n]]]];
      const result = flattenDeep(withBigInts);
      expect(result).toEqual([1n, 2n, 3n, 4n]);
    });
  });

  describe("deprecation behavior", () => {
    it("should behave identically to array.flat(Infinity)", () => {
      const testCases: (number | number[])[][] = [
        [1, [2, 3]],
        [1, 2, 3, 4, 5],
        [],
        [1, [], [2, 3], []],
        [[42]],
      ];

      testCases.forEach((arr) => {
        const customResult = flattenDeep(arr);
        const nativeResult = arr.flat(Infinity);
        expect(customResult).toEqual(nativeResult);
      });
    });
  });

  itProp.prop([fc.array(fc.oneof(fc.integer(), fc.array(fc.integer())))])(
    "[🎲] equivalent to arr.flat(Infinity)",
    (arr) => {
      expect(flattenDeep(arr)).toEqual(arr.flat(Infinity));
    }
  );

  itProp.prop([fc.array(fc.oneof(fc.integer(), fc.array(fc.integer())))])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = JSON.parse(JSON.stringify(arr));
      flattenDeep(arr);
      expect(arr).toEqual(copy);
    }
  );
});
