import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { sortBy } from "./sortBy";

describe("sortBy", () => {
  describe("Array functionality", () => {
    test("sorts array by numeric property", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = sortBy(users, (user: any) => user.age);

      expect(result).toEqual([
        { name: "Bob", age: 20 },
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
      ]);
    });

    test("sorts array by string property", () => {
      const users = [
        { name: "Charlie", age: 25 },
        { name: "Alice", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = sortBy(users, (user: any) => user.name);

      expect(result).toEqual([
        { name: "Alice", age: 30 },
        { name: "Bob", age: 20 },
        { name: "Charlie", age: 25 },
      ]);
    });

    test("sorts array by computed value", () => {
      const numbers = [3, 1, 4, 1, 5];

      const result = sortBy(numbers, (n: any) => n * n);

      expect(result).toEqual([1, 1, 3, 4, 5]);
    });

    test("sorts array by string length", () => {
      const words = ["hello", "hi", "world", "a"];

      const result = sortBy(words, (word: any) => word.length);

      expect(result).toEqual(["a", "hi", "hello", "world"]);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];

      const result = sortBy(emptyArray, (n: any) => n);

      expect(result).toEqual([]);
    });

    test("handles single element array", () => {
      const single = [42];

      const result = sortBy(single, (n: any) => n);

      expect(result).toEqual([42]);
    });

    test("handles array with identical values", () => {
      const identical = [5, 5, 5, 5];

      const result = sortBy(identical, (n: any) => n);

      expect(result).toEqual([5, 5, 5, 5]);
    });

    test("handles array with mixed types", () => {
      const mixed = [3, "hello", 1, "world", 2];

      const result = sortBy(mixed, (item: any) => String(item).length);

      expect(result).toEqual([3, 1, 2, "hello", "world"]);
    });
  });

  describe("Object functionality", () => {
    test("sorts object values by numeric property", () => {
      const obj = {
        a: { age: 25 },
        b: { age: 30 },
        c: { age: 20 },
      };

      const result = sortBy(obj, (value: any, key: any) => value.age);

      expect(result).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]);
    });

    test("sorts object values by string property", () => {
      const obj = {
        x: { name: "Charlie" },
        y: { name: "Alice" },
        z: { name: "Bob" },
      };

      const result = sortBy(obj, (value: any, key: any) => value.name);

      expect(result).toEqual([
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" },
      ]);
    });

    test("sorts object values by key", () => {
      const obj = {
        z: 1,
        a: 2,
        m: 3,
      };

      const result = sortBy(obj, (value: any, key: any) => key);

      expect(result).toEqual([2, 3, 1]); // sorted by key: a, m, z
    });

    test("handles empty object", () => {
      const emptyObj = {};

      const result = sortBy(emptyObj, (value: any, key: any) => value);

      expect(result).toEqual([]);
    });

    test("handles object with single property", () => {
      const single = { a: 42 };

      const result = sortBy(single, (value: any, key: any) => value);

      expect(result).toEqual([42]);
    });

    test("handles object with identical values", () => {
      const identical = { a: 5, b: 5, c: 5 };

      const result = sortBy(identical, (value: any, key: any) => value);

      expect(result).toEqual([5, 5, 5]);
    });

    test("[👾] returns 0 for equal criteria (not 1 or -1)", () => {
      // This test ensures the comparator returns 0 for equal values
      // If it returned 1 or -1, the sort would be unstable
      const obj = { a: { id: 1, score: 50 }, b: { id: 2, score: 50 }, c: { id: 3, score: 50 } };

      const result = sortBy(obj, (value: any) => value.score);

      // With a correct comparator returning 0 for equal values,
      // the original order should be preserved (stable sort)
      expect(result.map((r: any) => r.id)).toEqual([1, 2, 3]);
    });

    test("[👾] correctly orders when a > b in object sort", () => {
      // This test specifically targets the `a.criteria > b.criteria ? 1 : 0` branch
      // If mutated to always return 0 or always return 1, the sort would be wrong
      const obj = { x: 30, y: 10, z: 20 };

      const result = sortBy(obj, (value: any) => value);

      // Must be sorted: 10, 20, 30
      expect(result).toEqual([10, 20, 30]);
    });
  });

  describe("Special values", () => {
    test("handles null values", () => {
      const withNull = [3, null, 1, null, 2];

      const result = sortBy(withNull, (n: any) => n ?? 0);

      expect(result).toEqual([null, null, 1, 2, 3]);
    });

    test("handles undefined values", () => {
      const withUndefined = [3, undefined, 1, undefined, 2];

      const result = sortBy(withUndefined, (n: any) => n ?? 0);

      expect(result).toEqual([1, 2, 3, undefined, undefined]);
    });

    test("handles NaN values", () => {
      const withNaN = [3, NaN, 1, NaN, 2];

      const result = sortBy(withNaN, (n: any) => n);

      expect(result).toEqual([3, NaN, 1, NaN, 2]);
    });

    test("handles +0 and -0", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = sortBy(withZeros, (n: any) => n);

      expect(result).toEqual([+0, -0, +0, -0, 1]);
    });

    test("handles Infinity values", () => {
      const withInfinity = [3, Infinity, 1, -Infinity, 2];

      const result = sortBy(withInfinity, (n: any) => n);

      expect(result).toEqual([-Infinity, 1, 2, 3, Infinity]);
    });

    test("handles empty strings", () => {
      const withEmpty = ["hello", "", "world", "", "hi"];

      const result = sortBy(withEmpty, (s: any) => s.length);

      expect(result).toEqual(["", "", "hi", "hello", "world"]);
    });
  });

  describe("Complex sorting criteria", () => {
    test("sorts by multiple criteria using object properties", () => {
      const users = [
        { name: "John", age: 25, score: 80 },
        { name: "Jane", age: 25, score: 90 },
        { name: "Bob", age: 20, score: 85 },
      ];

      const result = sortBy(users, (user: any) => user.age * 100 + user.score);

      expect(result).toEqual([
        { name: "Bob", age: 20, score: 85 },
        { name: "John", age: 25, score: 80 },
        { name: "Jane", age: 25, score: 90 },
      ]);
    });

    test("sorts by nested object properties", () => {
      const data = [
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 30 } } },
        { user: { profile: { age: 20 } } },
      ];

      const result = sortBy(data, (item: any) => item.user.profile.age);

      expect(result).toEqual([
        { user: { profile: { age: 20 } } },
        { user: { profile: { age: 25 } } },
        { user: { profile: { age: 30 } } },
      ]);
    });

    test("sorts by array length", () => {
      const arrays = [[1, 2, 3], [1], [1, 2], []];

      const result = sortBy(arrays, (arr: any) => arr.length);

      expect(result).toEqual([[], [1], [1, 2], [1, 2, 3]]);
    });

    test("sorts by function result", () => {
      const numbers = [3, 1, 4, 1, 5];

      const result = sortBy(numbers, (n: any) => Math.sin(n));

      expect(result).toEqual([5, 4, 3, 1, 1]); // sorted by sin values
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
      ];

      const result = sortBy(largeNumbers, (n: any) => n);

      expect(result).toEqual([
        Number.MIN_SAFE_INTEGER,
        0,
        Number.MAX_SAFE_INTEGER,
      ]);
    });

    test("handles very small numbers", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, 0];

      const result = sortBy(smallNumbers, (n: any) => n);

      expect(result).toEqual([-Number.EPSILON, 0, Number.EPSILON]);
    });

    test("handles mixed data types in object", () => {
      const obj = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
      };

      const result = sortBy(obj, (value: any, key: any) => key);

      expect(result).toEqual([1, "hello", true, null]); // sorted by key: a, b, c, d
    });

    test("[🎯] handles sparse arrays", () => {
      const sparse = [3, , 1, , 2];

      const result = sortBy(sparse, (n: any) => n ?? 0);

      expect(result.length).toBe(5);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [3, 1, 2];

      const result = sortBy(numbers, (n: any) => n);

      expect(result).toEqual([1, 2, 3]);
      expect(typeof result[0]).toBe("number");
    });

    test("preserves object value type", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = sortBy(obj, (value: any, key: any) => value);

      expect(result).toEqual([1, 2, 3]);
      expect(typeof result[0]).toBe("number");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = [3, "hello", 1, "world", 2];

      const result = sortBy(mixed, (item: any) => String(item).length);

      expect(result).toEqual([3, 1, 2, "hello", "world"]);
    });

    test("returns array type", () => {
      const numbers = [3, 1, 2];

      const result = sortBy(numbers, (n: any) => n);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native sort approach", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result1 = sortBy(users, (user: any) => user.age);
      const result2 = [...users].sort((a, b) => a.age - b.age);

      expect(result1).toEqual(result2);
    });

    test("object behavior matches Object.values().sort() approach", () => {
      const obj = {
        a: { age: 25 },
        b: { age: 30 },
        c: { age: 20 },
      };

      const result1 = sortBy(obj, (value: any, key: any) => value.age);
      const result2 = Object.values(obj).sort((a, b) => a.age - b.age);

      expect(result1).toEqual(result2);
    });

    test("handles string comparison consistently", () => {
      const strings = ["hello", "world", "hi", "a"];

      const result1 = sortBy(strings, (s: any) => s.length);
      const result2 = [...strings].sort((a, b) => a.length - b.length);

      expect(result1).toEqual(result2);
    });

    itProp.prop([fc.array(fc.integer({ min: -1000, max: 1000 }), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.sort for numbers",
      (arr) => {
        const result1 = sortBy(arr, (n: number) => n);
        const result2 = [...arr].sort((a, b) => a - b);
        expect(result1).toEqual(result2);
      }
    );

    itProp.prop([fc.array(fc.string({ maxLength: 20 }), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.sort for string lengths",
      (arr) => {
        const result1 = sortBy(arr, (s: string) => s.length);
        const result2 = [...arr].sort((a, b) => a.length - b.length);
        expect(result1).toEqual(result2);
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [3, 1, 2];
      const originalCopy = [...original];

      sortBy(original, (n: any) => n);

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = { a: 3, b: 1, c: 2 };
      const originalCopy = { ...original };

      sortBy(original, (value: any, key: any) => value);

      expect(original).toEqual(originalCopy);
    });

    test("returns new array instance", () => {
      const numbers = [3, 1, 2];

      const result = sortBy(numbers, (n: any) => n);

      expect(result).not.toBe(numbers);
      expect(result).toEqual([1, 2, 3]);
    });

    test("preserves stability for equal values", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 25 },
        { name: "Bob", age: 25 },
      ];

      const result = sortBy(users, (user: any) => user.age);

      expect(result).toEqual([
        { name: "John", age: 25 },
        { name: "Jane", age: 25 },
        { name: "Bob", age: 25 },
      ]); // Order preserved for equal values
    });
  });

  describe("Iteratee function behavior", () => {
    test("calls iteratee with correct parameters for arrays", () => {
      const numbers = [3, 1, 2];
      const iteratee = vi.fn((n: any) => n);

      const result = sortBy(numbers, iteratee);

      // Verify iteratee is called at least once for each element
      // (exact count depends on Array.sort() implementation which can vary)
      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(3, 0, numbers);
      expect(iteratee).toHaveBeenCalledWith(1, 1, numbers);
      expect(iteratee).toHaveBeenCalledWith(2, 2, numbers);
      // Verify the result is correctly sorted
      expect(result).toEqual([1, 2, 3]);
    });

    test("calls iteratee with correct parameters for objects", () => {
      const obj = { a: 3, b: 1, c: 2 };
      const iteratee = vi.fn((value: any, key: any) => value);

      const result = sortBy(obj, iteratee);

      // Verify iteratee is called at least once for each element
      // (exact count depends on Array.sort() implementation which can vary)
      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(3, "a", obj);
      expect(iteratee).toHaveBeenCalledWith(1, "b", obj);
      expect(iteratee).toHaveBeenCalledWith(2, "c", obj);
      // Verify the result is correctly sorted
      expect(result).toEqual([1, 2, 3]);
    });

    test("handles iteratee that returns different types", () => {
      const mixed = [3, "hello", 1, "world", 2];

      const result = sortBy(mixed, (item: any) => String(item).length);

      expect(result).toEqual([3, 1, 2, "hello", "world"]);
    });

    test("handles iteratee that throws error", () => {
      const numbers = [3, 1, 2];

      expect(() => {
        sortBy(numbers, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");
    });
  });

  describe("Complex use cases", () => {
    test("sorts products by price", () => {
      const products = [
        { name: "Laptop", price: 999 },
        { name: "Phone", price: 599 },
        { name: "Tablet", price: 399 },
      ];

      const result = sortBy(products, (product: any) => product.price);

      expect(result).toEqual([
        { name: "Tablet", price: 399 },
        { name: "Phone", price: 599 },
        { name: "Laptop", price: 999 },
      ]);
    });

    test("sorts users by name length", () => {
      const users = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 20 },
      ];

      const result = sortBy(users, (user: any) => user.name.length);

      expect(result).toEqual([
        { name: "Bob", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Charlie", age: 20 },
      ]);
    });

    test("sorts by computed score", () => {
      const students = [
        { name: "John", math: 80, english: 90 },
        { name: "Jane", math: 95, english: 85 },
        { name: "Bob", math: 70, english: 95 },
      ];

      const result = sortBy(
        students,
        (student: any) => student.math + student.english
      );

      expect(result).toEqual([
        { name: "Bob", math: 70, english: 95 },
        { name: "John", math: 80, english: 90 },
        { name: "Jane", math: 95, english: 85 },
      ]);
    });

    test("sorts by date", () => {
      const events = [
        { name: "Event A", date: new Date("2023-12-01") },
        { name: "Event B", date: new Date("2023-11-01") },
        { name: "Event C", date: new Date("2023-10-01") },
      ];

      const result = sortBy(events, (event: any) => event.date.getTime());

      expect(result).toEqual([
        { name: "Event C", date: new Date("2023-10-01") },
        { name: "Event B", date: new Date("2023-11-01") },
        { name: "Event A", date: new Date("2023-12-01") },
      ]);
    });

    test("sorts by multiple criteria using object", () => {
      const obj = {
        user1: { age: 25, score: 80 },
        user2: { age: 30, score: 90 },
        user3: { age: 25, score: 85 },
      };

      const result = sortBy(
        obj,
        (value: any, key: any) => value.age * 100 + value.score
      );

      expect(result).toEqual([
        { age: 25, score: 80 },
        { age: 25, score: 85 },
        { age: 30, score: 90 },
      ]);
    });

    test("sorts by string comparison", () => {
      const words = ["hello", "world", "hi", "a", "zebra"];

      const result = sortBy(words, (word: any) => word);

      expect(result).toEqual(["a", "hello", "hi", "world", "zebra"]);
    });

    test("sorts by boolean values", () => {
      const items = [
        { name: "Item A", active: true },
        { name: "Item B", active: false },
        { name: "Item C", active: true },
      ];

      const result = sortBy(items, (item: any) => item.active);

      expect(result).toEqual([
        { name: "Item B", active: false },
        { name: "Item A", active: true },
        { name: "Item C", active: true },
      ]);
    });
  });
});
