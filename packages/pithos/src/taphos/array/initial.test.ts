import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { initial } from "./initial";

describe("initial", () => {
  describe("basic functionality", () => {
    it("should return all but the last element", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = initial(numbers);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("should return empty array for single element array", () => {
      const result = initial([42]);
      expect(result).toEqual([]);
    });

    it("should return empty array for empty array", () => {
      const result = initial([]);
      expect(result).toEqual([]);
    });

    it("should return array with one element for two element array", () => {
      const result = initial([1, 2]);
      expect(result).toEqual([1]);
    });

    it("should return array with two elements for three element array", () => {
      const result = initial([1, 2, 3]);
      expect(result).toEqual([1, 2]);
    });

    it("should handle large arrays", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const result = initial(largeArray);
      expect(result).toHaveLength(999);
      expect(result[0]).toBe(0);
      expect(result[998]).toBe(998);
    });
  });

  describe("different data types", () => {
    it("should work with strings", () => {
      const strings = ["hello", "world", "test", "array"];
      const result = initial(strings);
      expect(result).toEqual(["hello", "world", "test"]);
    });

    it("should work with objects", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
        { name: "Alice", age: 28 },
      ];
      const result = initial(users);
      expect(result).toEqual([
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
      ]);
    });

    it("should work with booleans", () => {
      const booleans = [true, false, true, false];
      const result = initial(booleans);
      expect(result).toEqual([true, false, true]);
    });

    it("should work with mixed types", () => {
      const mixed = [1, "hello", true, null, undefined];
      const result = initial(mixed);
      expect(result).toEqual([1, "hello", true, null]);
    });

    it("should work with arrays", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
      ];
      const result = initial(arrays);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it("should work with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const func3 = () => "third";
      const func4 = () => "fourth";
      const functions = [func1, func2, func3, func4];
      const result = initial(functions);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe(func1);
      expect(result[1]).toBe(func2);
      expect(result[2]).toBe(func3);
    });

    it("should work with numbers", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = initial(numbers);
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe("edge cases", () => {
    it("should handle array with undefined as last element", () => {
      const arr = [1, 2, 3, undefined];
      const result = initial(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle array with null as last element", () => {
      const arr = [1, 2, 3, null];
      const result = initial(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle array with NaN as last element", () => {
      const arr = [1, 2, 3, NaN];
      const result = initial(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle array with zero as last element", () => {
      const arr = [1, 2, 3, 0];
      const result = initial(arr);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle array with empty string as last element", () => {
      const arr = ["hello", "world", "test", ""];
      const result = initial(arr);
      expect(result).toEqual(["hello", "world", "test"]);
    });

    it("should handle array with false as last element", () => {
      const arr = [true, true, true, false];
      const result = initial(arr);
      expect(result).toEqual([true, true, true]);
    });

    it("should handle sparse arrays", () => {
      const arr = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays
      const result = initial(arr);
      expect(result).toEqual([1, undefined, 3, undefined]);
    });

    it("should handle arrays with duplicate elements", () => {
      const arr = [1, 2, 1, 2, 1];
      const result = initial(arr);
      expect(result).toEqual([1, 2, 1, 2]);
    });
  });

  describe("immutability", () => {
    it("should not modify the original array", () => {
      const original = [1, 2, 3, 4, 5];
      const result = initial(original);
      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("should return a new array instance", () => {
      const original = [1, 2, 3, 4, 5];
      const result = initial(original);
      expect(result).not.toBe(original);
    });

    it("should not share references with original array", () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = initial(original);
      expect(result).not.toBe(original);
      expect(result[0]).toBe(original[0]); // Same object reference
      expect(result[1]).toBe(original[1]); // Same object reference
    });
  });

  describe("consistency with native Array.slice", () => {
    it("should behave identically to array.slice(0, -1)", () => {
      // Test with numbers
      const numbers1 = [1, 2, 3, 4, 5];
      const customResult1 = initial(numbers1);
      const nativeResult1 = numbers1.slice(0, -1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult2 = initial(strings);
      const nativeResult2 = strings.slice(0, -1);
      expect(customResult2).toEqual(nativeResult2);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult3 = initial(booleans);
      const nativeResult3 = booleans.slice(0, -1);
      expect(customResult3).toEqual(nativeResult3);

      // Test with objects
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const customResult4 = initial(objects);
      const nativeResult4 = objects.slice(0, -1);
      expect(customResult4).toEqual(nativeResult4);

      // Test with empty array
      const empty: number[] = [];
      const customResult5 = initial(empty);
      const nativeResult5 = empty.slice(0, -1);
      expect(customResult5).toEqual(nativeResult5);

      // Test with single element
      const single = [42];
      const customResult6 = initial(single);
      const nativeResult6 = single.slice(0, -1);
      expect(customResult6).toEqual(nativeResult6);

      // Test with null/undefined/NaN
      const mixed = [null, undefined, NaN];
      const customResult7 = initial(mixed);
      const nativeResult7 = mixed.slice(0, -1);
      expect(customResult7).toEqual(nativeResult7);

      // Test with two elements
      const twoElements = [1, 2];
      const customResult8 = initial(twoElements);
      const nativeResult8 = twoElements.slice(0, -1);
      expect(customResult8).toEqual(nativeResult8);
    });

    it("should handle edge cases identically to native", () => {
      // Test with empty array
      const empty: number[] = [];
      const customResult1 = initial(empty);
      const nativeResult1 = empty.slice(0, -1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with single element
      const single = [42];
      const customResult2 = initial(single);
      const nativeResult2 = single.slice(0, -1);
      expect(customResult2).toEqual(nativeResult2);

      // Test with sparse array
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const customResult3 = initial(sparse);
      const nativeResult3 = sparse.slice(0, -1);
      expect(customResult3).toEqual(nativeResult3);
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = initial(numbers);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("should be equivalent to numbers.slice(0, -1)", () => {
      const numbers = [1, 2, 3, 4, 5];
      const customResult = initial(numbers);
      const nativeResult = numbers.slice(0, -1);
      expect(customResult).toEqual(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve the type of array elements", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      const result = initial(numbers);
      expect(result).toEqual([1, 2, 3, 4]);
      expect(result.every((item) => typeof item === "number")).toBe(true);
    });

    it("should work with union types", () => {
      const mixed: (string | number)[] = ["hello", 42, "world", 24];
      const result = initial(mixed);
      expect(result).toEqual(["hello", 42, "world"]);
    });

    it("should work with generic types", () => {
      const strings: string[] = ["a", "b", "c", "d"];
      const result = initial(strings);
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should return the correct type", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      const result = initial(numbers);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const result = initial(largeArray);
      expect(result).toHaveLength(99999);
      expect(result[0]).toBe(0);
      expect(result[99998]).toBe(99998);
    });

    it("should not iterate through the entire array unnecessarily", () => {
      const arr = [1, 2, 3, 4, 5];
      let accessCount = 0;

      // Create a proxy to track array access
      const proxy = new Proxy(arr, {
        get(target, prop) {
          if (typeof prop === "string" && !isNaN(Number(prop))) {
            accessCount++;
          }
          return target[prop as keyof typeof target];
        },
      });

      const result = initial(proxy);
      expect(result).toEqual([1, 2, 3, 4]);
      // Should access length property and create new array
      expect(accessCount).toBeGreaterThan(0);
    });
  });

  describe("deprecation behavior", () => {
    it("should behave identically to array.slice(0, -1)", () => {
      // Test with numbers
      const numbers1 = [1, 2, 3, 4, 5];
      const customResult1 = initial(numbers1);
      const nativeResult1 = numbers1.slice(0, -1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult2 = initial(strings);
      const nativeResult2 = strings.slice(0, -1);
      expect(customResult2).toEqual(nativeResult2);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult3 = initial(booleans);
      const nativeResult3 = booleans.slice(0, -1);
      expect(customResult3).toEqual(nativeResult3);

      // Test with objects
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const customResult4 = initial(objects);
      const nativeResult4 = objects.slice(0, -1);
      expect(customResult4).toEqual(nativeResult4);

      // Test with empty array
      const empty: number[] = [];
      const customResult5 = initial(empty);
      const nativeResult5 = empty.slice(0, -1);
      expect(customResult5).toEqual(nativeResult5);

      // Test with single element
      const single = [42];
      const customResult6 = initial(single);
      const nativeResult6 = single.slice(0, -1);
      expect(customResult6).toEqual(nativeResult6);

      // Test with null/undefined/NaN
      const mixed = [null, undefined, NaN];
      const customResult7 = initial(mixed);
      const nativeResult7 = mixed.slice(0, -1);
      expect(customResult7).toEqual(nativeResult7);

      // Test with two elements
      const twoElements = [1, 2];
      const customResult8 = initial(twoElements);
      const nativeResult8 = twoElements.slice(0, -1);
      expect(customResult8).toEqual(nativeResult8);
    });

    it("should handle all edge cases identically to native", () => {
      // Test with empty array
      const empty: number[] = [];
      const customResult1 = initial(empty);
      const nativeResult1 = empty.slice(0, -1);
      expect(customResult1).toEqual(nativeResult1);

      // Test with single element
      const single = [42];
      const customResult2 = initial(single);
      const nativeResult2 = single.slice(0, -1);
      expect(customResult2).toEqual(nativeResult2);

      // Test with sparse array
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const customResult3 = initial(sparse);
      const nativeResult3 = sparse.slice(0, -1);
      expect(customResult3).toEqual(nativeResult3);
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] equivalent to arr.slice(0, -1)",
    (arr) => {
      expect(initial(arr)).toEqual(arr.slice(0, -1));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = [...arr];
      initial(arr);
      expect(arr).toEqual(copy);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is max(0, arr.length - 1)",
    (arr) => {
      expect(initial(arr).length).toBe(Math.max(0, arr.length - 1));
    }
  );
});
