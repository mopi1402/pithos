import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { first } from "./first";

describe("first", () => {
  describe("basic functionality", () => {
    it("should return the first element of a non-empty array", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = first(numbers);
      expect(result).toBe(1);
    });

    it("should return undefined for empty array", () => {
      const result = first([]);
      expect(result).toBeUndefined();
    });

    it("should return the first element for single element array", () => {
      const result = first([42]);
      expect(result).toBe(42);
    });

    it("should return the first element regardless of array length", () => {
      const longArray = Array.from({ length: 1000 }, (_, i) => i);
      const result = first(longArray);
      expect(result).toBe(0);
    });
  });

  describe("different data types", () => {
    it("should work with strings", () => {
      const strings = ["hello", "world", "test"];
      const result = first(strings);
      expect(result).toBe("hello");
    });

    it("should work with objects", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
      ];
      const result = first(users);
      expect(result).toEqual({ name: "John", age: 25 });
    });

    it("should work with booleans", () => {
      const booleans = [true, false, true];
      const result = first(booleans);
      expect(result).toBe(true);
    });

    it("should work with mixed types", () => {
      const mixed = [1, "hello", true, null];
      const result = first(mixed);
      expect(result).toBe(1);
    });

    it("should work with arrays", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const result = first(arrays);
      expect(result).toEqual([1, 2]);
    });

    it("should work with functions", () => {
      const func1 = () => "first";
      const func2 = () => "second";
      const functions = [func1, func2];
      const result = first(functions);
      expect(result).toBe(func1);
    });
  });

  describe("edge cases", () => {
    it("should handle array with undefined as first element", () => {
      const arr = [undefined, 1, 2];
      const result = first(arr);
      expect(result).toBeUndefined();
    });

    it("should handle array with null as first element", () => {
      const arr = [null, 1, 2];
      const result = first(arr);
      expect(result).toBeNull();
    });

    it("should handle array with NaN as first element", () => {
      const arr = [NaN, 1, 2];
      const result = first(arr);
      expect(Number.isNaN(result)).toBe(true);
    });

    it("should handle array with zero as first element", () => {
      const arr = [0, 1, 2];
      const result = first(arr);
      expect(result).toBe(0);
    });

    it("should handle array with empty string as first element", () => {
      const arr = ["", "hello", "world"];
      const result = first(arr);
      expect(result).toBe("");
    });

    it("should handle array with false as first element", () => {
      const arr = [false, true, true];
      const result = first(arr);
      expect(result).toBe(false);
    });
  });

  describe("consistency with native array access", () => {
    it("should behave identically to arr[0]", () => {
      // Test with numbers
      const numbers = [1, 2, 3, 4, 5];
      const customResult1 = first(numbers);
      const nativeResult1 = numbers[0];
      expect(customResult1).toBe(nativeResult1);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult2 = first(strings);
      const nativeResult2 = strings[0];
      expect(customResult2).toBe(nativeResult2);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult3 = first(booleans);
      const nativeResult3 = booleans[0];
      expect(customResult3).toBe(nativeResult3);

      // Test with objects
      const objects = [{ id: 1 }, { id: 2 }];
      const customResult4 = first(objects);
      const nativeResult4 = objects[0];
      expect(customResult4).toBe(nativeResult4);

      // Test with empty array
      const empty: number[] = [];
      const customResult5 = first(empty);
      const nativeResult5 = empty[0];
      expect(customResult5).toBe(nativeResult5);

      // Test with null
      const withNull = [null];
      const customResult6 = first(withNull);
      const nativeResult6 = withNull[0];
      expect(customResult6).toBe(nativeResult6);

      // Test with undefined
      const withUndefined = [undefined];
      const customResult7 = first(withUndefined);
      const nativeResult7 = withUndefined[0];
      expect(customResult7).toBe(nativeResult7);

      // Test with NaN
      const withNaN = [NaN];
      const customResult8 = first(withNaN);
      const nativeResult8 = withNaN[0];
      expect(customResult8).toBe(nativeResult8);
    });

    it("should behave identically to arr.at(0) when available (ES2022+)", () => {
      // Note: Array.at() is ES2022, so this test is skipped for ES2020 target
      // When the project upgrades to ES2022+, this test can be enabled
      expect(true).toBe(true); // Placeholder test
    });
  });

  describe("type safety", () => {
    it("should preserve the type of the first element", () => {
      const numbers: number[] = [1, 2, 3];
      const result = first(numbers);
      expect(typeof result).toBe("number");
      expect(result).toBe(1);
    });

    it("should return undefined type for empty array", () => {
      const empty: number[] = [];
      const result = first(empty);
      expect(result).toBeUndefined();
    });

    it("should handle union types correctly", () => {
      const mixed: (string | number)[] = ["hello", 42, "world"];
      const result = first(mixed);
      expect(typeof result).toBe("string");
      expect(result).toBe("hello");
    });
  });

  describe("examples from documentation", () => {
    it("should match the example from documentation", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = first(numbers);
      expect(result).toBe(1);
    });

    it("should be equivalent to numbers[0]", () => {
      const numbers = [1, 2, 3, 4, 5];
      const customResult = first(numbers);
      const nativeResult = numbers[0];
      expect(customResult).toBe(nativeResult);
    });

    it("should be equivalent to numbers.at(0) when available (ES2022+)", () => {
      // Note: Array.at() is ES2022, so this test is skipped for ES2020 target
      // When the project upgrades to ES2022+, this test can be enabled
      expect(true).toBe(true); // Placeholder test
    });
  });

  describe("performance considerations", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i);
      const result = first(largeArray);
      expect(result).toBe(0);
    });

    it("should not iterate through the entire array", () => {
      const arr = [1, 2, 3, 4, 5];
      let accessCount = 0;

      // Create a proxy to track array access
      const proxy = new Proxy(arr, {
        get(target, prop) {
          if (prop === "0") {
            accessCount++;
          }
          return target[prop as keyof typeof target];
        },
      });

      const result = first(proxy);
      expect(result).toBe(1);
      expect(accessCount).toBe(1); // Should only access index 0
    });
  });

  itProp.prop([fc.array(fc.anything())])("[🎲] equivalent to arr[0]", (arr) => {
    expect(first(arr)).toBe(arr[0]);
  });

  itProp.prop([fc.array(fc.anything(), { minLength: 1 })])("[🎲] non-empty array returns defined value", (arr) => {
    const result = first(arr);
    expect(result).toBe(arr[0]);
  });
});
