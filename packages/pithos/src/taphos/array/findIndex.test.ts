import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { findIndex } from "./findIndex";

describe("findIndex", () => {
  describe("basic functionality", () => {
    it("should return the index of the first element that satisfies the predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = findIndex(numbers, (n) => n > 3);
      expect(result).toBe(3);
    });

    it("should return 0 for the first element that satisfies the predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = findIndex(numbers, (n) => n === 1);
      expect(result).toBe(0);
    });

    it("should return -1 when no element satisfies the predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = findIndex(numbers, (n) => n > 10);
      expect(result).toBe(-1);
    });

    it("should return -1 for empty array", () => {
      const result = findIndex([], (n) => n === 1);
      expect(result).toBe(-1);
    });
  });

  describe("predicate parameters", () => {
    it("should pass correct parameters to predicate (value, index, array)", () => {
      const arr = ["a", "b", "c"];
      const predicateCalls: Array<{
        value: string;
        index: number;
        array: string[];
      }> = [];

      findIndex(arr, (value, index, array) => {
        predicateCalls.push({ value, index, array });
        return false; // Never match to test all calls
      });

      expect(predicateCalls).toEqual([
        { value: "a", index: 0, array: ["a", "b", "c"] },
        { value: "b", index: 1, array: ["a", "b", "c"] },
        { value: "c", index: 2, array: ["a", "b", "c"] },
      ]);
    });

    it("should stop at first match and not call predicate for remaining elements", () => {
      const arr = [1, 2, 3, 4, 5];
      let callCount = 0;

      findIndex(arr, (value) => {
        callCount++;
        return value === 3; // Match at index 2
      });

      expect(callCount).toBe(3); // Should stop after finding match
    });
  });

  describe("different data types", () => {
    it("should work with strings", () => {
      const strings = ["hello", "world", "test"];
      const result = findIndex(strings, (s) => s.length > 4);
      expect(result).toBe(0); // 'hello' at index 0
    });

    it("should work with objects", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
      ];
      const result = findIndex(users, (user) => user.age > 28);
      expect(result).toBe(1); // Jane at index 1
    });

    it("should work with booleans", () => {
      const booleans = [false, true, false];
      const result = findIndex(booleans, (b) => b === true);
      expect(result).toBe(1);
    });

    it("should work with mixed types", () => {
      const mixed = [1, "hello", true, null];
      const result = findIndex(mixed, (item) => typeof item === "string");
      expect(result).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle array with undefined values", () => {
      const arr = [1, undefined, 3];
      const result = findIndex(arr, (value) => value === undefined);
      expect(result).toBe(1);
    });

    it("should handle array with null values", () => {
      const arr = [1, null, 3];
      const result = findIndex(arr, (value) => value === null);
      expect(result).toBe(1);
    });

    it("should handle array with NaN values", () => {
      const arr = [1, NaN, 3];
      const result = findIndex(arr, (value) => Number.isNaN(value));
      expect(result).toBe(1);
    });

    it("should handle single element array", () => {
      const result = findIndex([42], (n) => n === 42);
      expect(result).toBe(0);
    });

    it("should handle single element array with no match", () => {
      const result = findIndex([42], (n) => n === 0);
      expect(result).toBe(-1);
    });
  });

  describe("predicate behavior", () => {
    it("should work with truthy/falsy values", () => {
      const arr = [0, 1, 2, 0, 3];
      const result = findIndex(arr, (n) => Boolean(n)); // Truthy check
      expect(result).toBe(1); // First truthy value
    });

    it("should work with complex predicate logic", () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = findIndex(numbers, (n) => n % 2 === 0 && n > 5);
      expect(result).toBe(5); // 6 at index 5
    });

    it("should work with predicate that uses index", () => {
      const arr = [10, 20, 30, 40];
      const result = findIndex(arr, (value, index) => index === 2);
      expect(result).toBe(2);
    });

    it("should work with predicate that uses array reference", () => {
      const arr = [1, 2, 3];
      const result = findIndex(
        arr,
        (value, index, array) => array.length === 3 && value === 2
      );
      expect(result).toBe(1);
    });
  });

  describe("consistency with native Array.findIndex", () => {
    it("should behave identically to native Array.findIndex", () => {
      // Test with numbers
      const numbers = [1, 2, 3, 4, 5];
      const customResult1 = findIndex(numbers, (n) => n > 3);
      const nativeResult1 = numbers.findIndex((n) => n > 3);
      expect(customResult1).toBe(nativeResult1);

      // Test with strings
      const strings = ["a", "b", "c"];
      const customResult2 = findIndex(strings, (s) => s === "b");
      const nativeResult2 = strings.findIndex((s) => s === "b");
      expect(customResult2).toBe(nativeResult2);

      // Test with booleans
      const booleans = [true, false, true];
      const customResult3 = findIndex(booleans, (b) => b === false);
      const nativeResult3 = booleans.findIndex((b) => b === false);
      expect(customResult3).toBe(nativeResult3);

      // Test with empty array
      const empty: number[] = [];
      const customResult4 = findIndex(empty, (n) => n === 1);
      const nativeResult4 = empty.findIndex((n) => n === 1);
      expect(customResult4).toBe(nativeResult4);

      // Test with no match
      const noMatch = [1, 2, 3];
      const customResult5 = findIndex(noMatch, (n) => n > 10);
      const nativeResult5 = noMatch.findIndex((n) => n > 10);
      expect(customResult5).toBe(nativeResult5);
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] equivalent to arr.findIndex() for value search",
    (arr, target) => {
      const predicate = (n: number) => n === target;
      expect(findIndex(arr, predicate)).toBe(arr.findIndex(predicate));
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] findIndex with always-true predicate returns 0",
    (arr) => {
      expect(findIndex(arr, () => true)).toBe(0);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] findIndex with always-false predicate returns -1",
    (arr) => {
      expect(findIndex(arr, () => false)).toBe(-1);
    }
  );
});
