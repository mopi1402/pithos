import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { reject } from "./reject";

describe("reject", () => {
  describe("Array functionality", () => {
    test("rejects elements that pass predicate", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n % 2 === 0);

      expect(result).toEqual([1, 3, 5]);
    });

    test("rejects elements that pass predicate (opposite of filter)", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n > 3);

      expect(result).toEqual([1, 2, 3]);
    });

    test("returns empty array when all elements pass predicate", () => {
      const numbers = [2, 4, 6, 8, 10];

      const result = reject(numbers, (n) => n % 2 === 0);

      expect(result).toEqual([]);
    });

    test("returns all elements when none pass predicate", () => {
      const numbers = [1, 3, 5, 7, 9];

      const result = reject(numbers, (n) => n % 2 === 0);

      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];

      const result = reject(emptyArray, (n) => n > 0);

      expect(result).toEqual([]);
    });

    test("handles single element array that passes predicate", () => {
      const single = [42];

      const result = reject(single, (n) => n > 0);

      expect(result).toEqual([]);
    });

    test("handles single element array that fails predicate", () => {
      const single = [42];

      const result = reject(single, (n) => n < 0);

      expect(result).toEqual([42]);
    });

    test("handles array with mixed types", () => {
      const mixed = [1, "hello", 3, "world", 5];

      const result = reject(mixed, (item) => typeof item === "string");

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles array with duplicate values", () => {
      const duplicates = [1, 1, 2, 2, 3, 3];

      const result = reject(duplicates, (n) => n === 1);

      expect(result).toEqual([2, 2, 3, 3]);
    });

    test("handles array with special values", () => {
      const special = [null, undefined, NaN, Infinity, -Infinity];

      const result = reject(special, (n) => n === null);

      expect(result).toEqual([undefined, NaN, Infinity, -Infinity]);
    });

    test("handles array with objects", () => {
      const objects = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
      ];

      const result = reject(objects, (obj) => obj.active);

      expect(result).toEqual([{ id: 2, active: false }]);
    });

    test("handles array with functions", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      const fn3 = () => 3;
      const functions = [fn1, fn2, fn3];

      const result = reject(functions, (fn) => fn() === 1);

      expect(result).toEqual([fn2, fn3]);
    });

    test("handles array with arrays", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      const result = reject(arrays, (arr) => arr.length === 2);

      expect(result).toEqual([]);
    });
  });

  describe("Object functionality", () => {
    test("rejects values that pass predicate", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

      const result = reject(obj, (value, key) => value % 2 === 0);

      expect(result).toEqual({ a: 1, c: 3, e: 5 });
    });

    test("rejects values that pass predicate (opposite of filter)", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

      const result = reject(obj, (value, key) => value > 3);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("returns empty object when all values pass predicate", () => {
      const obj = { a: 2, b: 4, c: 6 };

      const result = reject(obj, (value, key) => value % 2 === 0);

      expect(result).toEqual({});
    });

    test("returns all values when none pass predicate", () => {
      const obj = { a: 1, b: 3, c: 5 };

      const result = reject(obj, (value, key) => value % 2 === 0);

      expect(result).toEqual({ a: 1, b: 3, c: 5 });
    });

    test("handles empty object", () => {
      const emptyObj = {};

      const result = reject(emptyObj, (value, key) => value > 0);

      expect(result).toEqual({});
    });

    test("handles single property object that passes predicate", () => {
      const single = { a: 42 };

      const result = reject(single, (value, key) => value > 0);

      expect(result).toEqual({});
    });

    test("handles single property object that fails predicate", () => {
      const single = { a: 42 };

      const result = reject(single, (value, key) => value < 0);

      expect(result).toEqual({ a: 42 });
    });

    test("handles object with mixed value types", () => {
      const mixed = {
        a: 1,
        b: "hello",
        c: 3,
        d: "world",
        e: 5,
      };

      const result = reject(mixed, (value, key) => typeof value === "string");

      expect(result).toEqual({ a: 1, c: 3, e: 5 });
    });

    test("handles object with duplicate values", () => {
      const duplicates = { a: 1, b: 1, c: 2, d: 2, e: 3 };

      const result = reject(duplicates, (value, key) => value === 1);

      expect(result).toEqual({ c: 2, d: 2, e: 3 });
    });

    test("handles object with special values", () => {
      const special = {
        null: null,
        undefined: undefined,
        nan: NaN,
        infinity: Infinity,
        negInfinity: -Infinity,
      };

      const result = reject(special, (value, key) => value === null);

      expect(result).toEqual({
        undefined: undefined,
        nan: NaN,
        infinity: Infinity,
        negInfinity: -Infinity,
      });
    });

    test("handles object with objects as values", () => {
      const objects = {
        a: { id: 1, active: true },
        b: { id: 2, active: false },
        c: { id: 3, active: true },
      };

      const result = reject(objects, (value, key) => value.active);

      expect(result).toEqual({ b: { id: 2, active: false } });
    });

    test("handles object with functions as values", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      const fn3 = () => 3;
      const functions = {
        a: fn1,
        b: fn2,
        c: fn3,
      };

      const result = reject(functions, (value, key) => value() === 1);

      expect(result).toEqual({ b: fn2, c: fn3 });
    });

    test("handles object with arrays as values", () => {
      const arrays = {
        a: [1, 2],
        b: [3, 4],
        c: [5, 6],
      };

      const result = reject(arrays, (value, key) => value.length === 2);

      expect(result).toEqual({});
    });
  });

  describe("Special values", () => {
    test("handles null values", () => {
      const withNull = [1, null, 3, null, 5];

      const result = reject(withNull, (n) => n === null);

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles undefined values", () => {
      const withUndefined = [1, undefined, 3, undefined, 5];

      const result = reject(withUndefined, (n) => n === undefined);

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles NaN values", () => {
      const withNaN = [1, NaN, 3, NaN, 5];

      const result = reject(withNaN, (n) => Number.isNaN(n));

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles +0 and -0", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = reject(withZeros, (n) => n === 0);

      expect(result).toEqual([1]);
    });

    test("handles Infinity values", () => {
      const withInfinity = [1, Infinity, 3, -Infinity, 5];

      const result = reject(withInfinity, (n) => !isFinite(n));

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles empty strings", () => {
      const withEmpty = ["hello", "", "world", "", "hi"];

      const result = reject(withEmpty, (s) => s === "");

      expect(result).toEqual(["hello", "world", "hi"]);
    });

    test("handles zero values", () => {
      const withZero = [1, 0, 3, 0, 5];

      const result = reject(withZero, (n) => n === 0);

      expect(result).toEqual([1, 3, 5]);
    });

    test("handles boolean values", () => {
      const withBooleans = [true, false, true, false];

      const result = reject(withBooleans, (b) => b === true);

      expect(result).toEqual([false, false]);
    });
  });

  describe("Complex predicates", () => {
    test("handles predicate with multiple conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n > 2 && n < 5);

      expect(result).toEqual([1, 2, 5]);
    });

    test("handles predicate with OR conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n === 1 || n === 5);

      expect(result).toEqual([2, 3, 4]);
    });

    test("handles predicate with NOT conditions", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => !(n % 2 === 0));

      expect(result).toEqual([2, 4]);
    });

    test("handles predicate with nested conditions", () => {
      const users = [
        { name: "John", age: 25, active: true },
        { name: "Jane", age: 30, active: false },
        { name: "Bob", age: 20, active: true },
      ];

      const result = reject(users, (user) => user.age > 20 && user.active);

      expect(result).toEqual([
        { name: "Jane", age: 30, active: false },
        { name: "Bob", age: 20, active: true },
      ]);
    });

    test("handles predicate with array methods", () => {
      const words = ["hello", "world", "hi", "there"];

      const result = reject(words, (word) => word.length > 4);

      expect(result).toEqual(["hi"]);
    });

    test("handles predicate with object methods", () => {
      const obj = { a: "hello", b: "hi", c: "world" };

      const result = reject(obj, (value, key) => value.length > 2);

      expect(result).toEqual({ b: "hi" });
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
      ];

      const result = reject(largeNumbers, (n) => n === Number.MAX_SAFE_INTEGER);

      expect(result).toEqual([Number.MIN_SAFE_INTEGER, 0]);
    });

    test("handles very small numbers", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, 0];

      const result = reject(smallNumbers, (n) => n === Number.EPSILON);

      expect(result).toEqual([-Number.EPSILON, 0]);
    });

    test("handles mixed data types in object", () => {
      const obj = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
        e: undefined,
      };

      const result = reject(obj, (value, key) => typeof value === "string");

      expect(result).toEqual({ a: 1, c: true, d: null, e: undefined });
    });

    test("[🎯] handles sparse arrays", () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };

      const result = reject(arrayLike, (value, key) => value > 2);

      expect(result).toEqual({ 0: 1, 1: 2 });
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n % 2 === 0);

      expect(result).toEqual([1, 3, 5]);
      expect(typeof result[0]).toBe("number");
    });

    test("preserves object value type", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reject(obj, (value, key) => value % 2 === 0);

      expect(result).toEqual({ a: 1, c: 3 });
      expect(typeof result.a).toBe("number");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 2];

      const result = reject(mixed, (item) => typeof item === "string");

      expect(result).toEqual([1, 2]);
    });

    test("returns correct type for empty collections", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = reject(emptyArray, (n) => n > 0);
      const result2 = reject(emptyObj, (value, key) => value > 0);

      expect(result1).toEqual([]);
      expect(result2).toEqual({});
    });

    test("handles union types", () => {
      const union: (string | number | boolean)[] = ["hello", 42, true];

      const result = reject(union, (item) => typeof item === "string");

      expect(result).toEqual([42, true]);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native filter with negated predicate", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result1 = reject(numbers, (n) => n % 2 === 0);
      const result2 = numbers.filter((n) => !(n % 2 === 0));

      expect(result1).toEqual(result2);
      expect(result1).toEqual([1, 3, 5]);
    });

    test("object behavior matches Object.entries().filter() approach", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result1 = reject(obj, (value, key) => value % 2 === 0);
      const result2 = Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => !(value % 2 === 0))
      );

      expect(result1).toEqual(result2);
      expect(result1).toEqual({ a: 1, c: 3 });
    });

    test("handles empty collections consistently", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = reject(emptyArray, (n) => n > 0);
      const result2 = emptyArray.filter((n) => !(n > 0));
      const result3 = reject(emptyObj, (value, key) => value > 0);
      const result4 = Object.fromEntries(
        Object.entries(emptyObj).filter(([key, value]: any) => !(value > 0))
      );

      expect(result1).toEqual(result2);
      expect(result3).toEqual(result4);
      expect(result1).toEqual([]);
      expect(result3).toEqual({});
    });

    test("handles string comparison consistently", () => {
      const strings = ["hello", "world", "hi", "there"];

      const result1 = reject(strings, (s) => s.length > 4);
      const result2 = strings.filter((s) => !(s.length > 4));

      expect(result1).toEqual(result2);
      expect(result1).toEqual(["hi"]);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.filter with negated predicate",
      (arr) => {
        const predicate = (n: number) => n % 2 === 0;
        expect(reject(arr, predicate)).toEqual(arr.filter((n) => !predicate(n)));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.filter with negated predicate for strings",
      (arr) => {
        const predicate = (s: string) => s.length > 3;
        expect(reject(arr, predicate)).toEqual(arr.filter((s) => !predicate(s)));
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];

      reject(original, (n) => n % 2 === 0);

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = { a: 1, b: 2, c: 3 };
      const originalCopy = { ...original };

      reject(original, (value, key) => value % 2 === 0);

      expect(original).toEqual(originalCopy);
    });

    test("returns new array instance", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reject(numbers, (n) => n % 2 === 0);

      expect(result).not.toBe(numbers);
      expect(result).toEqual([1, 3, 5]);
    });

    test("returns new object instance", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reject(obj, (value, key) => value % 2 === 0);

      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    test("handles predicate that throws error", () => {
      const numbers = [1, 2, 3];

      expect(() => {
        reject(numbers, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");
    });
  });

  describe("Predicate function behavior", () => {
    test("calls predicate with correct parameters for arrays", () => {
      const numbers = [1, 2, 3];
      const predicate = vi.fn((value, index, array) => value > 1);

      reject(numbers, predicate);

      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(1, 0, numbers);
      expect(predicate).toHaveBeenCalledWith(2, 1, numbers);
      expect(predicate).toHaveBeenCalledWith(3, 2, numbers);
    });

    test("calls predicate with correct parameters for objects", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn((value, key, object) => value > 1);

      reject(obj, predicate);

      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(2, "b", obj);
      expect(predicate).toHaveBeenCalledWith(3, "c", obj);
    });

    test("handles predicate that returns different types", () => {
      const numbers = [1, 2, 3];

      const result = reject(
        numbers,
        (n) => (n % 2 === 0 ? "even" : "odd") as any
      );

      expect(result).toEqual([]); // "even" and "odd" are both truthy, so reject all
    });

    test("handles predicate that returns falsy values", () => {
      const numbers = [1, 2, 3];

      const result = reject(numbers, (n) => (n > 5 ? 0 : false) as any);

      expect(result).toEqual([1, 2, 3]); // All return falsy, so reject none
    });
  });

  describe("Complex use cases", () => {
    test("rejects inactive users", () => {
      const users = [
        { name: "John", active: true },
        { name: "Jane", active: false },
        { name: "Bob", active: true },
      ];

      const result = reject(users, (user) => user.active);

      expect(result).toEqual([{ name: "Jane", active: false }]);
    });

    test("rejects products out of stock", () => {
      const products = [
        { name: "Laptop", stock: 5 },
        { name: "Phone", stock: 0 },
        { name: "Tablet", stock: 3 },
      ];

      const result = reject(products, (product) => product.stock === 0);

      expect(result).toEqual([
        { name: "Laptop", stock: 5 },
        { name: "Tablet", stock: 3 },
      ]);
    });

    test("rejects numbers greater than threshold", () => {
      const numbers = [1, 5, 10, 15, 20];

      const result = reject(numbers, (n) => n > 10);

      expect(result).toEqual([1, 5, 10]);
    });

    test("rejects strings shorter than minimum length", () => {
      const words = ["hello", "world", "hi", "there"];

      const result = reject(words, (word) => word.length < 4);

      expect(result).toEqual(["hello", "world", "there"]);
    });

    test("rejects objects without specific property", () => {
      const obj = {
        user1: { name: "John", age: 25 },
        user2: { name: "Jane" },
        user3: { name: "Bob", age: 30 },
      };

      const result = reject(obj, (value, key) => "age" in value);

      expect(result).toEqual({ user2: { name: "Jane" } });
    });

    test("rejects values that meet complex criteria", () => {
      const data = [
        { score: 80, passed: true },
        { score: 60, passed: false },
        { score: 90, passed: true },
      ];

      const result = reject(data, (item) => item.score >= 80 && item.passed);

      expect(result).toEqual([{ score: 60, passed: false }]);
    });

    test("rejects keys that match pattern", () => {
      const obj = {
        user_1: "John",
        user_2: "Jane",
        admin_1: "Bob",
      };

      const result = reject(obj, (value, key) => key.startsWith("admin"));

      expect(result).toEqual({ user_1: "John", user_2: "Jane" });
    });

    test("rejects values outside range", () => {
      const numbers = [1, 5, 10, 15, 20];

      const result = reject(numbers, (n) => n >= 10 && n <= 15);

      expect(result).toEqual([1, 5, 20]);
    });

    test("rejects based on multiple conditions", () => {
      const users = [
        { name: "John", age: 25, active: true },
        { name: "Jane", age: 30, active: false },
        { name: "Bob", age: 20, active: true },
        { name: "Alice", age: 35, active: true },
      ];

      const result = reject(users, (user) => user.age > 25 && user.active);

      expect(result).toEqual([
        { name: "John", age: 25, active: true },
        { name: "Jane", age: 30, active: false },
        { name: "Bob", age: 20, active: true },
      ]);
    });

    test("rejects based on nested object properties", () => {
      const data = [
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 30 } } },
        { user: { profile: { age: 20 } } },
      ];

      const result = reject(data, (item) => item.user.profile.age > 25);

      expect(result).toEqual([
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 20 } } },
      ]);
    });
  });
});
