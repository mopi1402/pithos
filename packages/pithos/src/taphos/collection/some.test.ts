import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { some } from "./some";

describe("some", () => {
  describe("Array functionality", () => {
    test("returns true when at least one element passes predicate", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(true);
    });

    test("returns false when no element passes predicate", () => {
      const numbers = [1, 3, 5, 7, 9];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(false);
    });

    test("returns true when first element passes predicate", () => {
      const numbers = [2, 1, 3, 5, 7];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(true);
    });

    test("returns true when last element passes predicate", () => {
      const numbers = [1, 3, 5, 7, 2];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(true);
    });

    test("returns true when middle element passes predicate", () => {
      const numbers = [1, 3, 2, 5, 7];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(true);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];

      const result = some(emptyArray, (n) => n > 0);

      expect(result).toBe(false);
    });

    test("handles single element array that passes", () => {
      const single = [42];

      const result = some(single, (n) => n > 0);

      expect(result).toBe(true);
    });

    test("handles single element array that fails", () => {
      const single = [42];

      const result = some(single, (n) => n < 0);

      expect(result).toBe(false);
    });

    test("handles array with all elements passing", () => {
      const allPass = [2, 4, 6, 8, 10];

      const result = some(allPass, (n) => n % 2 === 0);

      expect(result).toBe(true);
    });

    test("handles array with mixed types", () => {
      const mixed = [1, "hello", 3, "world", 5];

      const result = some(mixed, (item) => typeof item === "string");

      expect(result).toBe(true);
    });

    test("handles array with all elements failing", () => {
      const allFail = [1, 3, 5, 7, 9];

      const result = some(allFail, (n) => n % 2 === 0);

      expect(result).toBe(false);
    });
  });

  describe("Object functionality", () => {
    test("returns true when at least one value passes predicate", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = some(obj, (value, key) => value % 2 === 0);

      expect(result).toBe(true);
    });

    test("returns false when no value passes predicate", () => {
      const obj = { a: 1, b: 3, c: 5 };

      const result = some(obj, (value, key) => value % 2 === 0);

      expect(result).toBe(false);
    });

    test("returns true when first value passes predicate", () => {
      const obj = { a: 2, b: 1, c: 3 };

      const result = some(obj, (value, key) => value % 2 === 0);

      expect(result).toBe(true);
    });

    test("returns true when last value passes predicate", () => {
      const obj = { a: 1, b: 3, c: 2 };

      const result = some(obj, (value, key) => value % 2 === 0);

      expect(result).toBe(true);
    });

    test("handles empty object", () => {
      const emptyObj = {};

      const result = some(emptyObj, (value, key) => value > 0);

      expect(result).toBe(false);
    });

    test("handles object with single property that passes", () => {
      const single = { a: 42 };

      const result = some(single, (value, key) => value > 0);

      expect(result).toBe(true);
    });

    test("handles object with single property that fails", () => {
      const single = { a: 42 };

      const result = some(single, (value, key) => value < 0);

      expect(result).toBe(false);
    });

    test("handles object with all values passing", () => {
      const allPass = { a: 2, b: 4, c: 6 };

      const result = some(allPass, (value, key) => value % 2 === 0);

      expect(result).toBe(true);
    });

    test("handles object with all values failing", () => {
      const allFail = { a: 1, b: 3, c: 5 };

      const result = some(allFail, (value, key) => value % 2 === 0);

      expect(result).toBe(false);
    });

    test("handles object with mixed value types", () => {
      const mixed = { a: 1, b: "hello", c: 3 };

      const result = some(mixed, (value, key) => typeof value === "string");

      expect(result).toBe(true);
    });
  });

  describe("Special values", () => {
    test("handles null values", () => {
      const withNull = [1, null, 3, null, 5];

      const result = some(withNull, (n) => n === null);

      expect(result).toBe(true);
    });

    test("handles undefined values", () => {
      const withUndefined = [1, undefined, 3, undefined, 5];

      const result = some(withUndefined, (n) => n === undefined);

      expect(result).toBe(true);
    });

    test("handles NaN values", () => {
      const withNaN = [1, NaN, 3, NaN, 5];

      const result = some(withNaN, (n) => Number.isNaN(n));

      expect(result).toBe(true);
    });

    test("handles +0 and -0", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = some(withZeros, (n) => n === 0);

      expect(result).toBe(true);
    });

    test("handles Infinity values", () => {
      const withInfinity = [1, Infinity, 3, -Infinity, 5];

      const result = some(withInfinity, (n) => !isFinite(n));

      expect(result).toBe(true);
    });

    test("handles empty strings", () => {
      const withEmpty = ["hello", "", "world", "", "hi"];

      const result = some(withEmpty, (s) => s === "");

      expect(result).toBe(true);
    });

    test("handles zero values", () => {
      const withZero = [1, 0, 3, 0, 5];

      const result = some(withZero, (n) => n === 0);

      expect(result).toBe(true);
    });

    test("handles boolean values", () => {
      const withBooleans = [true, false, true, false];

      const result = some(withBooleans, (b) => b === true);

      expect(result).toBe(true);
    });
  });

  describe("Complex predicates", () => {
    test("handles predicate with multiple conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = some(numbers, (n) => n > 2 && n < 5);

      expect(result).toBe(true);
    });

    test("handles predicate with OR conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = some(numbers, (n) => n === 1 || n === 5);

      expect(result).toBe(true);
    });

    test("handles predicate with NOT conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = some(numbers, (n) => !(n % 2 === 0));

      expect(result).toBe(true);
    });

    test("handles predicate with nested conditions", () => {
      const users = [
        { name: "John", age: 25, active: true },
        { name: "Jane", age: 30, active: false },
        { name: "Bob", age: 20, active: true },
      ];

      const result = some(users, (user) => user.age > 20 && user.active);

      expect(result).toBe(true);
    });

    test("handles predicate with array methods", () => {
      const words = ["hello", "world", "hi", "there"];

      const result = some(words, (word) => word.length > 4);

      expect(result).toBe(true);
    });

    test("handles predicate with object methods", () => {
      const obj = { a: "hello", b: "hi", c: "world" };

      const result = some(obj, (value, key) => value.length > 2);

      expect(result).toBe(true);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
      ];

      const result = some(largeNumbers, (n) => n === Number.MAX_SAFE_INTEGER);

      expect(result).toBe(true);
    });

    test("handles very small numbers", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, 0];

      const result = some(smallNumbers, (n) => n === Number.EPSILON);

      expect(result).toBe(true);
    });

    test("handles mixed data types in object", () => {
      const obj = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
      };

      const result = some(obj, (value, key) => typeof value === "string");

      expect(result).toBe(true);
    });

    test("[🎯] handles sparse arrays", () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };

      const result = some(arrayLike, (value, key) => value > 2);

      expect(result).toBe(true);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];

      const result = some(numbers, (n) => n % 2 === 0);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("preserves object value type", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = some(obj, (value, key) => value % 2 === 0);

      expect(result).toBe(true);
      expect(typeof result).toBe("boolean");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 2];

      const result = some(mixed, (item) => typeof item === "string");

      expect(result).toBe(true);
    });

    test("returns boolean type", () => {
      const numbers = [1, 2, 3];

      const result = some(numbers, (n) => n > 0);

      expect(typeof result).toBe("boolean");
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native some approach", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result1 = some(numbers, (n) => n % 2 === 0);
      const result2 = numbers.some((n) => n % 2 === 0);

      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    test("object behavior matches Object.values().some() approach", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result1 = some(obj, (value, key) => value % 2 === 0);
      const result2 = Object.values(obj).some((value) => value % 2 === 0);

      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    test("handles empty collections consistently", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = some(emptyArray, (n) => n > 0);
      const result2 = emptyArray.some((n) => n > 0);
      const result3 = some(emptyObj, (value, key) => value > 0);
      const result4 = Object.values(emptyObj).some((value: any) => value > 0);

      expect(result1).toBe(result2);
      expect(result3).toBe(result4);
      expect(result1).toBe(false);
      expect(result3).toBe(false);
    });

    test("handles string comparison consistently", () => {
      const strings = ["hello", "world", "hi", "there"];

      const result1 = some(strings, (s) => s.length > 4);
      const result2 = strings.some((s) => s.length > 4);

      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.some for numbers",
      (arr) => {
        const predicate = (n: number) => n % 2 === 0;
        expect(some(arr, predicate)).toBe(arr.some(predicate));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.some for strings",
      (arr) => {
        const predicate = (s: string) => s.length > 5;
        expect(some(arr, predicate)).toBe(arr.some(predicate));
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];

      some(original, (n) => n > 3);

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = { a: 1, b: 2, c: 3 };
      const originalCopy = { ...original };

      some(original, (value, key) => value > 2);

      expect(original).toEqual(originalCopy);
    });

    test("returns boolean value", () => {
      const numbers = [1, 2, 3];

      const result = some(numbers, (n) => n > 0);

      expect(typeof result).toBe("boolean");
    });

    test("handles predicate that throws error", () => {
      const numbers = [1, 2, 3];

      expect(() => {
        some(numbers, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");
    });
  });

  describe("Short-circuiting behavior", () => {
    test("stops iteration when first element passes", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((n) => n % 2 === 0);

      some(numbers, predicate);

      expect(predicate).toHaveBeenCalledTimes(2); // Called for 1, then 2
    });

    test("continues iteration when elements fail", () => {
      const numbers = [1, 3, 5, 7, 9];
      const predicate = vi.fn((n) => n % 2 === 0);

      some(numbers, predicate);

      expect(predicate).toHaveBeenCalledTimes(5); // Called for all elements
    });

    test("stops iteration when first object value passes", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn((value, key) => value % 2 === 0);

      some(obj, predicate);

      expect(predicate).toHaveBeenCalledTimes(2); // Called for a, then b
    });

    test("continues iteration when object values fail", () => {
      const obj = { a: 1, b: 3, c: 5 };
      const predicate = vi.fn((value, key) => value % 2 === 0);

      some(obj, predicate);

      expect(predicate).toHaveBeenCalledTimes(3); // Called for all values
    });
  });

  describe("Predicate function behavior", () => {
    test("calls predicate with correct parameters for arrays", () => {
      const numbers = [1, 2, 3];
      const predicate = vi.fn((value, index, array) => value > 1);

      some(numbers, predicate);

      expect(predicate).toHaveBeenCalledWith(1, 0, numbers);
      expect(predicate).toHaveBeenCalledWith(2, 1, numbers);
      // Short-circuits after finding first match, so 3 is not called
    });

    test("calls predicate with correct parameters for objects", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn((value, key, object) => value > 1);

      some(obj, predicate);

      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(2, "b", obj);
      // Short-circuits after finding first match, so c is not called
    });

    test("handles predicate that returns different types", () => {
      const numbers = [1, 2, 3];

      const result = some(
        numbers,
        (n) => (n % 2 === 0 ? "even" : "odd") as any
      );

      expect(result).toBe(true); // "even" is truthy
    });

    test("handles predicate that returns falsy values", () => {
      const numbers = [1, 2, 3];

      const result = some(numbers, (n) => (n > 5 ? 0 : false) as any);

      expect(result).toBe(false); // All return falsy values
    });
  });

  describe("Complex use cases", () => {
    test("checks if any user is active", () => {
      const users = [
        { name: "John", active: false },
        { name: "Jane", active: true },
        { name: "Bob", active: false },
      ];

      const result = some(users, (user) => user.active);

      expect(result).toBe(true);
    });

    test("checks if any product is in stock", () => {
      const products = [
        { name: "Laptop", stock: 0 },
        { name: "Phone", stock: 5 },
        { name: "Tablet", stock: 0 },
      ];

      const result = some(products, (product) => product.stock > 0);

      expect(result).toBe(true);
    });

    test("checks if any number is prime", () => {
      const numbers = [4, 6, 8, 9, 10];

      const result = some(numbers, (n) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      });

      expect(result).toBe(false); // None are prime
    });

    test("checks if any string contains substring", () => {
      const words = ["hello", "world", "hi", "there"];

      const result = some(words, (word) => word.includes("ll"));

      expect(result).toBe(true);
    });

    test("checks if any object has specific property", () => {
      const obj = {
        user1: { name: "John", age: 25 },
        user2: { name: "Jane", age: 30 },
        user3: { name: "Bob" },
      };

      const result = some(obj, (value, key) => "age" in value);

      expect(result).toBe(true);
    });

    test("checks if any value meets complex criteria", () => {
      const data = [
        { score: 80, passed: true },
        { score: 60, passed: false },
        { score: 90, passed: true },
      ];

      const result = some(data, (item) => item.score >= 80 && item.passed);

      expect(result).toBe(true);
    });

    test("checks if any key matches pattern", () => {
      const obj = {
        user_1: "John",
        user_2: "Jane",
        admin_1: "Bob",
      };

      const result = some(obj, (value, key) => key.startsWith("admin"));

      expect(result).toBe(true);
    });

    test("checks if any value is within range", () => {
      const numbers = [1, 5, 10, 15, 20];

      const result = some(numbers, (n) => n >= 10 && n <= 15);

      expect(result).toBe(true);
    });
  });
});
