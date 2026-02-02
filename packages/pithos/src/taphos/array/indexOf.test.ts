import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { indexOf } from "./indexOf";

describe("indexOf", () => {
  describe("basic functionality", () => {
    it("should return the index of the first occurrence", () => {
      const numbers = [1, 2, 3, 2, 4];
      const result = indexOf(numbers, 2);
      expect(result).toBe(1);
    });

    it("should return -1 when value is not found", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 6);
      expect(result).toBe(-1);
    });

    it("should return 0 for first element", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 1);
      expect(result).toBe(0);
    });

    it("should return last index for last element", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 5);
      expect(result).toBe(4);
    });

    it("should return -1 for empty array", () => {
      const result = indexOf([], 1);
      expect(result).toBe(-1);
    });

    it("should return 0 for single element array when found", () => {
      const result = indexOf([42], 42);
      expect(result).toBe(0);
    });

    it("should return -1 for single element array when not found", () => {
      const result = indexOf([42], 1);
      expect(result).toBe(-1);
    });
  });

  describe("with fromIndex parameter", () => {
    it("should start search from specified index", () => {
      const numbers = [1, 2, 3, 2, 4];
      const result = indexOf(numbers, 2, 2);
      expect(result).toBe(3);
    });

    it("should return -1 when fromIndex is beyond array length", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 1, 10);
      expect(result).toBe(-1);
    });

    it("should work with fromIndex 0", () => {
      const numbers = [1, 2, 3, 2, 4];
      const result = indexOf(numbers, 2, 0);
      expect(result).toBe(1);
    });

    it("should work with fromIndex equal to array length", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 5, 5);
      expect(result).toBe(-1);
    });

    it("should work with negative fromIndex", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 3, -3);
      expect(result).toBe(2);
    });

    it("should return -1 with negative fromIndex when value is not found after start position", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 3, -2); // starts from index 3, 3 is not found after index 3
      expect(result).toBe(-1);
    });

    it("should work with large negative fromIndex", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 1, -10);
      expect(result).toBe(0);
    });
  });

  describe("different data types", () => {
    it("should work with strings", () => {
      const strings = ["hello", "world", "hello", "test"];
      const result = indexOf(strings, "hello");
      expect(result).toBe(0);
    });

    it("should work with booleans", () => {
      const booleans = [true, false, true, false];
      const result = indexOf(booleans, false);
      expect(result).toBe(1);
    });

    it("should work with objects (reference equality)", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 };
      const objects = [obj1, obj2, obj3];

      const result1 = indexOf(objects, obj1);
      expect(result1).toBe(0);

      const result2 = indexOf(objects, obj2);
      expect(result2).toBe(1);

      // Different object with same content should not match
      const result3 = indexOf(objects, { id: 1 });
      expect(result3).toBe(-1);
    });

    it("should work with arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const arr3 = [1, 2];
      const arrays = [arr1, arr2, arr3];

      const result1 = indexOf(arrays, arr1);
      expect(result1).toBe(0);

      const result2 = indexOf(arrays, arr2);
      expect(result2).toBe(1);

      // Different array with same content should not match
      const result3 = indexOf(arrays, [1, 2]);
      expect(result3).toBe(-1);
    });

    it("should work with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const func3 = () => "first";
      const functions = [func1, func2, func3];

      const result1 = indexOf(functions, func1);
      expect(result1).toBe(0);

      const result2 = indexOf(functions, func2);
      expect(result2).toBe(1);

      // Different function should not match
      const result3 = indexOf(functions, () => "first");
      expect(result3).toBe(-1);
    });

    it("should work with mixed types", () => {
      const mixed = [1, "hello", true, null, undefined];

      const result1 = indexOf(mixed, "hello");
      expect(result1).toBe(1);

      const result2 = indexOf(mixed, true);
      expect(result2).toBe(2);

      const result3 = indexOf(mixed, null);
      expect(result3).toBe(3);

      const result4 = indexOf(mixed, undefined);
      expect(result4).toBe(4);
    });
  });

  describe("edge cases", () => {
    it("should handle undefined values", () => {
      const arr = [1, undefined, 3, undefined, 5];
      const result = indexOf(arr, undefined);
      expect(result).toBe(1);
    });

    it("should handle null values", () => {
      const arr = [1, null, 3, null, 5];
      const result = indexOf(arr, null);
      expect(result).toBe(1);
    });

    it("should handle NaN values", () => {
      const arr = [1, NaN, 3, NaN, 5];
      const result = indexOf(arr, NaN);
      expect(result).toBe(-1); // NaN is never found because NaN !== NaN
    });

    it("should handle zero values", () => {
      const arr = [1, 0, 3, 0, 5];
      const result = indexOf(arr, 0);
      expect(result).toBe(1);
    });

    it("should handle empty string", () => {
      const arr = ["hello", "", "world", "", "test"];
      const result = indexOf(arr, "");
      expect(result).toBe(1);
    });

    it("should handle false values", () => {
      const arr = [true, false, true, false, true];
      const result = indexOf(arr, false);
      expect(result).toBe(1);
    });

    it("should handle duplicate values", () => {
      const arr = [1, 2, 1, 2, 1, 2];
      const result = indexOf(arr, 1);
      expect(result).toBe(0);
    });

    it("should handle sparse arrays", () => {
      const arr = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays
      const result = indexOf(arr, 3);
      expect(result).toBe(2);
    });
  });

  describe("consistency with native Array.indexOf", () => {
    it("should behave identically to native indexOf", () => {
      // Test with numbers
      const numbers1 = [1, 2, 3, 2, 4];
      const customResult1 = indexOf(numbers1, 2);
      const nativeResult1 = numbers1.indexOf(2);
      expect(customResult1).toBe(nativeResult1);

      const numbers2 = [1, 2, 3, 2, 4];
      const customResult2 = indexOf(numbers2, 2, 2);
      const nativeResult2 = numbers2.indexOf(2, 2);
      expect(customResult2).toBe(nativeResult2);

      const numbers3 = [1, 2, 3, 4, 5];
      const customResult3 = indexOf(numbers3, 6);
      const nativeResult3 = numbers3.indexOf(6);
      expect(customResult3).toBe(nativeResult3);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult4 = indexOf(strings, "b");
      const nativeResult4 = strings.indexOf("b");
      expect(customResult4).toBe(nativeResult4);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult5 = indexOf(booleans, false);
      const nativeResult5 = booleans.indexOf(false);
      expect(customResult5).toBe(nativeResult5);

      // Test with empty array
      const empty: number[] = [];
      const customResult6 = indexOf(empty, 1);
      const nativeResult6 = empty.indexOf(1);
      expect(customResult6).toBe(nativeResult6);

      // Test with negative fromIndex
      const numbers4 = [1, 2, 3, 4, 5];
      const customResult7 = indexOf(numbers4, 1, -2);
      const nativeResult7 = numbers4.indexOf(1, -2);
      expect(customResult7).toBe(nativeResult7);

      const numbers5 = [1, 2, 3, 4, 5];
      const customResult8 = indexOf(numbers5, 3, -10);
      const nativeResult8 = numbers5.indexOf(3, -10);
      expect(customResult8).toBe(nativeResult8);
    });

    it("should handle edge cases identically to native", () => {
      // Test with undefined fromIndex
      const arr1 = [1, 2, 3, 2, 4];
      const customResult1 = indexOf(arr1, 2);
      const nativeResult1 = arr1.indexOf(2);
      expect(customResult1).toBe(nativeResult1);

      // Test with NaN
      const arr2 = [1, NaN, 3];
      const customResult2 = indexOf(arr2, NaN);
      const nativeResult2 = arr2.indexOf(NaN);
      expect(customResult2).toBe(nativeResult2);

      // Test with objects
      const obj = { id: 1 };
      const arr3 = [obj, { id: 2 }, obj];
      const customResult3 = indexOf(arr3, obj);
      const nativeResult3 = arr3.indexOf(obj);
      expect(customResult3).toBe(nativeResult3);
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const numbers = [1, 2, 3, 2, 4];
      const result = indexOf(numbers, 2);
      expect(result).toBe(1);
    });

    it("should be equivalent to numbers.indexOf(2)", () => {
      const numbers = [1, 2, 3, 2, 4];
      const customResult = indexOf(numbers, 2);
      const nativeResult = numbers.indexOf(2);
      expect(customResult).toBe(nativeResult);
    });
  });

  describe("type safety", () => {
    it("should preserve types correctly", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      const result = indexOf(numbers, 3);
      expect(typeof result).toBe("number");
      expect(result).toBe(2);
    });

    it("should work with union types", () => {
      const mixed: (string | number)[] = ["hello", 42, "world", 24];
      const result1 = indexOf(mixed, "world");
      expect(result1).toBe(2);

      const result2 = indexOf(mixed, 24);
      expect(result2).toBe(3);
    });

    it("should work with generic types", () => {
      const strings: string[] = ["a", "b", "c"];
      const result = indexOf(strings, "b");
      expect(result).toBe(1);
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const result = indexOf(largeArray, 50000);
      expect(result).toBe(50000);
    });

    it("should stop at first match", () => {
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

      const result = indexOf(proxy, 2);
      expect(result).toBe(1);
      expect(accessCount).toBeLessThanOrEqual(2); // Should stop at index 1
    });
  });

  describe("deprecation behavior", () => {
    it("should behave identically to native array.indexOf", () => {
      // Test with numbers
      const numbers1 = [1, 2, 3, 2, 4];
      const customResult1 = indexOf(numbers1, 2);
      const nativeResult1 = numbers1.indexOf(2);
      expect(customResult1).toBe(nativeResult1);

      const numbers2 = [1, 2, 3, 2, 4];
      const customResult2 = indexOf(numbers2, 2, 2);
      const nativeResult2 = numbers2.indexOf(2, 2);
      expect(customResult2).toBe(nativeResult2);

      const numbers3 = [1, 2, 3, 4, 5];
      const customResult3 = indexOf(numbers3, 6);
      const nativeResult3 = numbers3.indexOf(6);
      expect(customResult3).toBe(nativeResult3);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult4 = indexOf(strings, "b");
      const nativeResult4 = strings.indexOf("b");
      expect(customResult4).toBe(nativeResult4);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult5 = indexOf(booleans, false);
      const nativeResult5 = booleans.indexOf(false);
      expect(customResult5).toBe(nativeResult5);

      // Test with empty array
      const empty: number[] = [];
      const customResult6 = indexOf(empty, 1);
      const nativeResult6 = empty.indexOf(1);
      expect(customResult6).toBe(nativeResult6);

      // Test with negative fromIndex
      const numbers4 = [1, 2, 3, 4, 5];
      const customResult7 = indexOf(numbers4, 1, -2);
      const nativeResult7 = numbers4.indexOf(1, -2);
      expect(customResult7).toBe(nativeResult7);

      const numbers5 = [1, 2, 3, 4, 5];
      const customResult8 = indexOf(numbers5, 3, -10);
      const nativeResult8 = numbers5.indexOf(3, -10);
      expect(customResult8).toBe(nativeResult8);
    });

    it("should handle all edge cases identically to native", () => {
      // Test with undefined fromIndex
      const arr1 = [1, 2, 3, 2, 4];
      const customResult1 = indexOf(arr1, 2);
      const nativeResult1 = arr1.indexOf(2);
      expect(customResult1).toBe(nativeResult1);

      // Test with NaN
      const arr2 = [1, NaN, 3];
      const customResult2 = indexOf(arr2, NaN);
      const nativeResult2 = arr2.indexOf(NaN);
      expect(customResult2).toBe(nativeResult2);

      // Test with objects
      const obj = { id: 1 };
      const arr3 = [obj, { id: 2 }, obj];
      const customResult3 = indexOf(arr3, obj);
      const nativeResult3 = arr3.indexOf(obj);
      expect(customResult3).toBe(nativeResult3);
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] equivalent to arr.indexOf(value)",
    (arr, value) => {
      expect(indexOf(arr, value)).toBe(arr.indexOf(value));
    }
  );

  itProp.prop([
    fc.array(fc.integer()),
    fc.integer(),
    fc.integer({ min: -100, max: 100 }),
  ])("[🎲] equivalent to arr.indexOf(value, fromIndex)", (arr, value, fromIndex) => {
    expect(indexOf(arr, value, fromIndex)).toBe(arr.indexOf(value, fromIndex));
  });
});
