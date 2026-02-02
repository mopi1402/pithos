import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { find } from "./find";

describe("find", () => {
  describe("examples from documentation", () => {
    it("should work with documentation example", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
      ];
      const result = find(users, (user) => user.age > 28);
      expect(result).toEqual({ name: "Jane", age: 30 });
    });

    it("should be equivalent to native array.find()", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 35 },
      ];
      const findResult = find(users, (user) => user.age > 28);
      const nativeResult = users.find((user) => user.age > 28);
      expect(findResult).toEqual(nativeResult);
    });
  });

  describe("basic functionality", () => {
    it("should return first element that matches predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = find(numbers, (n) => n > 3);
      expect(result).toBe(4);
    });

    it("should return undefined when no element matches", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = find(numbers, (n) => n > 10);
      expect(result).toBeUndefined();
    });

    it("should handle empty array", () => {
      const result = find([], (n) => n > 0);
      expect(result).toBeUndefined();
    });

    it("should preserve original array", () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      find(original, (n) => n > 3);
      expect(original).toEqual(copy);
    });
  });

  describe("predicate behavior", () => {
    it("should pass correct parameters to predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicateCalls: Array<{
        value: number;
        index: number;
        array: number[];
      }> = [];

      find(numbers, (value, index, array) => {
        predicateCalls.push({ value, index, array });
        return value > 3;
      });

      expect(predicateCalls).toEqual([
        { value: 1, index: 0, array: numbers },
        { value: 2, index: 1, array: numbers },
        { value: 3, index: 2, array: numbers },
        { value: 4, index: 3, array: numbers },
      ]);
    });

    it("should stop when predicate returns true", () => {
      const numbers = [1, 2, 3, 4, 5];
      let callCount = 0;

      const result = find(numbers, (n) => {
        callCount++;
        return n > 2;
      });

      expect(result).toBe(3);
      expect(callCount).toBe(3);
    });

    it("should handle predicate with side effects", () => {
      const numbers = [1, 2, 3, 4, 5];
      let sideEffect = 0;

      const result = find(numbers, (n) => {
        sideEffect += n;
        return n > 2;
      });

      expect(result).toBe(3);
      expect(sideEffect).toBe(6); // 1 + 2 + 3
    });
  });

  describe("edge cases", () => {
    it("should handle single element array", () => {
      expect(find([42], (n) => n > 40)).toBe(42);
      expect(find([42], (n) => n < 40)).toBeUndefined();
    });

    it("should handle string arrays", () => {
      const strings = ["a", "b", "c", "d", "e"];
      const result = find(strings, (s) => s === "c");
      expect(result).toBe("c");
    });

    it("should handle object arrays", () => {
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const result = find(objects, (obj) => obj.id === 3);
      expect(result).toEqual({ id: 3 });
    });

    it("should handle mixed types", () => {
      const mixed = [null, undefined, 1, "a", true];
      const result = find(mixed, (item) => typeof item === "string");
      expect(result).toBe("a");
    });

    it("should handle falsy values", () => {
      const falsy = [0, false, "", null, undefined];
      const result = find(falsy, (item) => item === false);
      expect(result).toBe(false);
    });

    it("should handle NaN values", () => {
      const numbers = [1, NaN, 3, 4];
      const result = find(numbers, (n) => Number.isNaN(n));
      expect(result).toBeNaN();
    });
  });

  describe("complex scenarios", () => {
    it("should handle large arrays", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const result = find(largeArray, (n) => n === 500);
      expect(result).toBe(500);
    });

    it("should handle predicate based on index", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = find(numbers, (n, index) => index === 2);
      expect(result).toBe(3);
    });

    it("should handle predicate based on array length", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = find(
        numbers,
        (n, index, array) => index === array.length - 1
      );
      expect(result).toBe(5);
    });

    it("should handle nested object properties", () => {
      const nested = [
        { user: { id: 1, name: "John" } },
        { user: { id: 2, name: "Jane" } },
        { user: { id: 3, name: "Bob" } },
      ];
      const result = find(nested, (obj) => obj.user.name === "Jane");
      expect(result).toEqual({ user: { id: 2, name: "Jane" } });
    });
  });

  describe("type safety", () => {
    it("should work with different types", () => {
      const booleans = [true, false, true, false];
      const result = find(booleans, (b) => b === false);
      expect(result).toBe(false);
    });

    it("should work with function types", () => {
      const func1 = () => 1;
      const func2 = () => 2;
      const func3 = () => 3;
      const functions = [func1, func2, func3];
      const result = find(functions, (fn) => fn() === 2);
      expect(result).toBe(func2);
    });

    it("should work with array types", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const result = find(arrays, (arr) => arr.includes(4));
      expect(result).toEqual([3, 4]);
    });
  });

  describe("specific behaviors", () => {
    it("should handle first element matching predicate", () => {
      const numbers = [5, 1, 2, 3, 4];
      const result = find(numbers, (n) => n > 4);
      expect(result).toBe(5);
    });

    it("should handle last element matching predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = find(numbers, (n) => n === 5);
      expect(result).toBe(5);
    });

    it("should handle all elements matching predicate", () => {
      const numbers = [1, 2, 3];
      const result = find(numbers, (n) => n > 0);
      expect(result).toBe(1); // Returns first match
    });

    it("should handle no elements matching predicate", () => {
      const numbers = [1, 2, 3];
      const result = find(numbers, (n) => n < 0);
      expect(result).toBeUndefined();
    });

    it("should handle predicate returning truthy values", () => {
      const numbers = [0, 1, 2, 3];
      const result = find(numbers, (n) => Boolean(n)); // 0 is falsy, 1+ are truthy
      expect(result).toBe(1);
    });
  });

  describe("equivalence with native find", () => {
    it("should be equivalent to native find in all cases", () => {
      // Test cases with proper typing
      const numberTests = [
        { array: [1, 2, 3, 4, 5], predicate: (n: number) => n > 3 },
        { array: [1, 2, 3, 4, 5], predicate: (n: number) => n > 10 },
        { array: [] as number[], predicate: (n: number) => n > 0 },
        { array: [42], predicate: (n: number) => n > 40 },
      ];

      const stringTests = [
        { array: ["a", "b", "c"], predicate: (s: string) => s === "b" },
      ];

      // Test number arrays
      numberTests.forEach(({ array, predicate }) => {
        const findResult = find(array, predicate);
        const nativeResult = array.find(predicate);
        expect(findResult).toEqual(nativeResult);
      });

      // Test string arrays
      stringTests.forEach(({ array, predicate }) => {
        const findResult = find(array, predicate);
        const nativeResult = array.find(predicate);
        expect(findResult).toEqual(nativeResult);
      });

      // Test mixed arrays individually
      const nullUndefinedArray = [null, undefined, 1] as (
        | number
        | null
        | undefined
      )[];
      const nullUndefinedPredicate = (item: number | null | undefined) =>
        item === 1;
      const findResult1 = find(nullUndefinedArray, nullUndefinedPredicate);
      const nativeResult1 = nullUndefinedArray.find(nullUndefinedPredicate);
      expect(findResult1).toEqual(nativeResult1);

      const mixedArray = [0, false, ""] as (number | boolean | string)[];
      const mixedPredicate = (item: number | boolean | string) =>
        item === false;
      const findResult2 = find(mixedArray, mixedPredicate);
      const nativeResult2 = mixedArray.find(mixedPredicate);
      expect(findResult2).toEqual(nativeResult2);
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] equivalent to arr.find() for value search",
    (arr, target) => {
      const predicate = (n: number) => n === target;
      expect(find(arr, predicate)).toBe(arr.find(predicate));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] find with always-true predicate returns first element",
    (arr) => {
      const result = find(arr, () => true);
      expect(result).toBe(arr[0]);
    }
  );
});
