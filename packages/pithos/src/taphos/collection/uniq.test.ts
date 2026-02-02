import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniq } from "./uniq";

describe("uniq", () => {
  describe("Basic functionality", () => {
    test("removes duplicate primitive values", () => {
      const numbers = [1, 2, 2, 3, 3, 3, 4];

      const result = uniq(numbers);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    test("removes duplicate strings", () => {
      const strings = ["a", "b", "b", "c", "c", "c", "d"];

      const result = uniq(strings);

      expect(result).toEqual(["a", "b", "c", "d"]);
    });

    test("removes duplicate booleans", () => {
      const booleans = [true, false, true, false, true];

      const result = uniq(booleans);

      expect(result).toEqual([true, false]);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];

      const result = uniq(emptyArray);

      expect(result).toEqual([]);
    });

    test("handles single element array", () => {
      const single = [42];

      const result = uniq(single);

      expect(result).toEqual([42]);
    });

    test("handles array with no duplicates", () => {
      const unique = [1, 2, 3, 4, 5];

      const result = uniq(unique);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test("handles array with all same elements", () => {
      const allSame = [1, 1, 1, 1, 1];

      const result = uniq(allSame);

      expect(result).toEqual([1]);
    });
  });

  describe("Special values", () => {
    test("handles null values", () => {
      const withNull = [null, 1, null, 2, null];

      const result = uniq(withNull);

      expect(result).toEqual([null, 1, 2]);
    });

    test("handles undefined values", () => {
      const withUndefined = [undefined, 1, undefined, 2, undefined];

      const result = uniq(withUndefined);

      expect(result).toEqual([undefined, 1, 2]);
    });

    test("handles mixed null and undefined", () => {
      const mixed = [null, undefined, null, undefined];

      const result = uniq(mixed);

      expect(result).toEqual([null, undefined]);
    });

    test("handles NaN values", () => {
      const withNaN = [NaN, 1, NaN, 2, NaN];

      const result = uniq(withNaN);

      expect(result).toEqual([NaN, 1, 2]);
    });

    test("handles +0 and -0", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = uniq(withZeros);

      expect(result).toEqual([+0, 1]); // +0 and -0 are considered equal by Set
    });

    test("handles empty strings", () => {
      const withEmpty = ["", "a", "", "b", ""];

      const result = uniq(withEmpty);

      expect(result).toEqual(["", "a", "b"]);
    });

    test("handles zero values", () => {
      const withZero = [0, 1, 0, 2, 0];

      const result = uniq(withZero);

      expect(result).toEqual([0, 1, 2]);
    });
  });

  describe("Mixed data types", () => {
    test("handles mixed primitive types", () => {
      const mixed = [1, "1", true, 1, "1", false, true];

      const result = uniq(mixed);

      expect(result).toEqual([1, "1", true, false]);
    });

    test("handles mixed with null and undefined", () => {
      const mixed = [1, null, "hello", undefined, 1, null, "hello"];

      const result = uniq(mixed);

      expect(result).toEqual([1, null, "hello", undefined]);
    });

    test("handles mixed with NaN", () => {
      const mixed = [1, NaN, "hello", NaN, 1, "hello"];

      const result = uniq(mixed);

      expect(result).toEqual([1, NaN, "hello"]);
    });
  });

  describe("Objects and references", () => {
    test("handles object references", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 };
      const objects = [obj1, obj2, obj1, obj3, obj2];

      const result = uniq(objects);

      expect(result).toEqual([obj1, obj2, obj3]); // All objects are unique references
    });

    test("handles array references", () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const arr3 = [1, 2];
      const arrays = [arr1, arr2, arr1, arr3, arr2];

      const result = uniq(arrays);

      expect(result).toEqual([arr1, arr2, arr3]); // All arrays are unique references
    });

    test("handles function references", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      const fn3 = () => 1;
      const functions = [fn1, fn2, fn1, fn3, fn2];

      const result = uniq(functions);

      expect(result).toEqual([fn1, fn2, fn3]); // All functions are unique references
    });

    test("handles mixed object types", () => {
      const obj = { id: 1 };
      const arr = [1, 2];
      const fn = () => 1;
      const mixed = [obj, arr, fn, obj, arr, fn];

      const result = uniq(mixed);

      expect(result).toEqual([obj, arr, fn]);
    });
  });

  describe("Sparse arrays", () => {
    test("handles sparse arrays", () => {
      const sparse = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays

      const result = uniq(sparse);

      expect(result).toEqual([1, undefined, 3, 5]); // Empty slots become undefined
    });

    test("handles sparse arrays with undefined", () => {
      const sparse = [1, , undefined, , 3]; // eslint-disable-line no-sparse-arrays

      const result = uniq(sparse);

      expect(result).toEqual([1, undefined, 3]);
    });
  });

  describe("Large datasets", () => {
    test("handles large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i % 100);
    });

    test("handles arrays with many duplicates", () => {
      const manyDuplicates = Array.from({ length: 1000 }, () => 42);

      const result = uniq(manyDuplicates);

      expect(result).toEqual([42]);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
      ];

      const result = uniq(largeNumbers);

      expect(result).toEqual([
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ]);
    });

    test("handles very small numbers", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, Number.EPSILON];

      const result = uniq(smallNumbers);

      expect(result).toEqual([Number.EPSILON, -Number.EPSILON]);
    });

    test("handles Infinity values", () => {
      const infinities = [Infinity, -Infinity, Infinity, -Infinity];

      const result = uniq(infinities);

      expect(result).toEqual([Infinity, -Infinity]);
    });

    test("handles mixed Infinity and regular numbers", () => {
      const mixed = [1, Infinity, 2, -Infinity, 1, Infinity];

      const result = uniq(mixed);

      expect(result).toEqual([1, Infinity, 2, -Infinity]);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [1, 2, 2, 3];

      const result = uniq(numbers);

      expect(result).toEqual([1, 2, 3]);
      expect(typeof result[0]).toBe("number");
    });

    test("preserves string array type", () => {
      const strings: string[] = ["a", "b", "b", "c"];

      const result = uniq(strings);

      expect(result).toEqual(["a", "b", "c"]);
      expect(typeof result[0]).toBe("string");
    });

    test("preserves boolean array type", () => {
      const booleans: boolean[] = [true, false, true];

      const result = uniq(booleans);

      expect(result).toEqual([true, false]);
      expect(typeof result[0]).toBe("boolean");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 1, "a"];

      const result = uniq(mixed);

      expect(result).toEqual(["a", 1, "b"]);
    });

    test("returns T[] type", () => {
      const numbers: number[] = [1, 2, 2, 3];

      const result = uniq(numbers);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Consistency with native Set", () => {
    test("behavior matches native Set approach", () => {
      const numbers = [1, 2, 2, 3, 3, 3, 4];

      const result1 = uniq(numbers);
      const result2 = [...new Set(numbers)];

      expect(result1).toEqual(result2);
    });

    test("handles NaN consistently with Set", () => {
      const withNaN = [NaN, 1, NaN, 2];

      const result1 = uniq(withNaN);
      const result2 = [...new Set(withNaN)];

      expect(result1).toEqual(result2);
      expect(result1).toEqual([NaN, 1, 2]);
    });

    test("handles +0 and -0 consistently with Set", () => {
      const withZeros = [+0, -0, 1, +0];

      const result1 = uniq(withZeros);
      const result2 = [...new Set(withZeros)];

      expect(result1).toEqual(result2);
      expect(result1).toEqual([+0, 1]);
    });

    test("handles object references consistently with Set", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const objects = [obj1, obj2, obj1];

      const result1 = uniq(objects);
      const result2 = [...new Set(objects)];

      expect(result1).toEqual(result2);
      expect(result1).toEqual([obj1, obj2]);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to [...new Set()] for numbers",
      (arr) => {
        expect(uniq(arr)).toEqual([...new Set(arr)]);
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to [...new Set()] for strings",
      (arr) => {
        expect(uniq(arr)).toEqual([...new Set(arr)]);
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [1, 2, 2, 3, 3, 3, 4];
      const originalCopy = [...original];

      uniq(original);

      expect(original).toEqual(originalCopy);
    });

    test("returns new array instance", () => {
      const numbers = [1, 2, 2, 3];

      const result = uniq(numbers);

      expect(result).not.toBe(numbers);
      expect(result).toEqual([1, 2, 3]);
    });

    test("preserves order of first occurrence", () => {
      const numbers = [3, 1, 2, 1, 3, 2, 1];

      const result = uniq(numbers);

      expect(result).toEqual([3, 1, 2]); // First occurrence of each unique value
    });
  });

  describe("Complex use cases", () => {
    test("removes duplicate user IDs", () => {
      const userIds = [1, 2, 1, 3, 2, 4, 1, 3];

      const result = uniq(userIds);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    test("removes duplicate tags", () => {
      const tags = [
        "javascript",
        "typescript",
        "javascript",
        "react",
        "typescript",
        "vue",
      ];

      const result = uniq(tags);

      expect(result).toEqual(["javascript", "typescript", "react", "vue"]);
    });

    test("removes duplicate objects by reference", () => {
      const user1 = { id: 1, name: "John" };
      const user2 = { id: 2, name: "Jane" };
      const user3 = { id: 1, name: "John" }; // Different object with same data
      const users = [user1, user2, user1, user3, user2];

      const result = uniq(users);

      expect(result).toEqual([user1, user2, user3]); // All objects are unique references
    });

    test("handles mixed data in real-world scenario", () => {
      const mixedData = [
        "pending",
        1,
        "approved",
        2,
        "pending",
        1,
        "rejected",
        "approved",
      ];

      const result = uniq(mixedData);

      expect(result).toEqual(["pending", 1, "approved", 2, "rejected"]);
    });

    test("removes duplicate coordinates", () => {
      const coord1 = [0, 0];
      const coord2 = [1, 1];
      const coord3 = [2, 2];
      const coordinates = [coord1, coord2, coord1, coord3, coord2];

      const result = uniq(coordinates);

      expect(result).toEqual([coord1, coord2, coord3]); // All arrays are unique references
    });
  });
});
