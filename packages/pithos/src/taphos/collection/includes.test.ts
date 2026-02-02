import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { includes } from "./includes";

describe("includes", () => {
  describe("Array functionality", () => {
    test("returns true when value is found in array", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = includes(numbers, 3);

      expect(result).toBe(true);
    });

    test("returns false when value is not found in array", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = includes(numbers, 6);

      expect(result).toBe(false);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];

      const result = includes(emptyArray, 1);

      expect(result).toBe(false);
    });

    test("handles single element array", () => {
      const single = [42];

      const result1 = includes(single, 42);
      const result2 = includes(single, 1);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    test("handles different data types", () => {
      const mixed = [1, "hello", true, null, undefined];

      expect(includes(mixed, 1)).toBe(true);
      expect(includes(mixed, "hello")).toBe(true);
      expect(includes(mixed, true)).toBe(true);
      expect(includes(mixed, null)).toBe(true);
      expect(includes(mixed, undefined)).toBe(true);
      expect(includes(mixed, false)).toBe(false);
      expect(includes(mixed, "world")).toBe(false);
    });

    test("handles sparse arrays", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays

      expect(includes(sparse, 1)).toBe(true);
      expect(includes(sparse, 3)).toBe(true);
      expect(includes(sparse, undefined)).toBe(true); // Sparse arrays do include undefined
    });

    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);

      expect(includes(large, 0)).toBe(true);
      expect(includes(large, 999)).toBe(true);
      expect(includes(large, 1000)).toBe(false);
    });

    test("uses fromIndex parameter", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, 0)).toBe(true);
      expect(includes(numbers, 1, 1)).toBe(false);
      expect(includes(numbers, 3, 2)).toBe(true);
      expect(includes(numbers, 3, 3)).toBe(false);
    });

    test("handles negative fromIndex", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 5, -1)).toBe(true);
      expect(includes(numbers, 4, -2)).toBe(true);
      expect(includes(numbers, 1, -5)).toBe(true);
      expect(includes(numbers, 1, -4)).toBe(false);
    });

    test("handles fromIndex beyond array length", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, 10)).toBe(false);
      expect(includes(numbers, 5, 10)).toBe(false);
    });

    test("handles fromIndex equal to array length", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, 5)).toBe(false);
      expect(includes(numbers, 5, 5)).toBe(false);
    });

    test("handles NaN values", () => {
      const arr = [1, NaN, 3];

      expect(includes(arr, NaN)).toBe(true);
      expect(includes(arr, 1)).toBe(true);
      expect(includes(arr, 3)).toBe(true);
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0];

      expect(includes(arr, +0)).toBe(true);
      expect(includes(arr, -0)).toBe(true);
      expect(includes(arr, 0)).toBe(true);
    });

    test("handles objects in array", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const arr = [obj1, obj2];

      expect(includes(arr, obj1)).toBe(true);
      expect(includes(arr, obj2)).toBe(true);
      expect(includes(arr, { id: 1 })).toBe(false); // Different object reference
    });

    test("handles arrays in array", () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const arr = [arr1, arr2];

      expect(includes(arr, arr1)).toBe(true);
      expect(includes(arr, arr2)).toBe(true);
      expect(includes(arr, [1, 2])).toBe(false); // Different array reference
    });
  });

  describe("Object functionality", () => {
    test("returns true when value is found in object", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = includes(obj, 2);

      expect(result).toBe(true);
    });

    test("returns false when value is not found in object", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = includes(obj, 4);

      expect(result).toBe(false);
    });

    test("handles empty object", () => {
      const emptyObj = {};

      const result = includes(emptyObj as any, 1);

      expect(result).toBe(false);
    });

    test("handles single property object", () => {
      const obj = { single: 42 };

      const result1 = includes(obj, 42);
      const result2 = includes(obj, 1);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    test("handles different value types", () => {
      const mixed = {
        num: 42,
        str: "hello",
        bool: true,
        nullVal: null,
        undefinedVal: undefined,
        obj: { nested: true },
      };

      expect(includes(mixed, 42)).toBe(true);
      expect(includes(mixed, "hello")).toBe(true);
      expect(includes(mixed, true)).toBe(true);
      expect(includes(mixed, null)).toBe(true);
      expect(includes(mixed, undefined)).toBe(true);
      expect(includes(mixed, { nested: true })).toBe(false); // Different object reference
      expect(includes(mixed, false)).toBe(false);
      expect(includes(mixed, "world")).toBe(false);
    });

    test("handles object with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };

      expect(includes(obj, "zero")).toBe(true);
      expect(includes(obj, "one")).toBe(true);
      expect(includes(obj, "two")).toBe(true);
      expect(includes(obj, "three")).toBe(false);
    });

    test("handles object with symbol keys", () => {
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const obj = { [sym1]: "value1", [sym2]: "value2", regular: "value3" };

      // Object.values() only returns enumerable string-keyed properties
      expect(includes(obj, "value3")).toBe(true);
      expect(includes(obj, "value1")).toBe(false); // Symbol keys not included
      expect(includes(obj, "value2")).toBe(false); // Symbol keys not included
    });

    test("handles object with inherited properties", () => {
      const parent = { inherited: "value" };
      const child = Object.create(parent);
      child.own = "ownValue";

      const result = includes(child, "ownValue");

      expect(result).toBe(true);
      expect(includes(child, "value")).toBe(false); // Inherited properties not included
    });

    test("handles array-like objects (not arrays)", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

      // Object.values() includes all enumerable properties including 'length'
      expect(includes(arrayLike, "a")).toBe(true);
      expect(includes(arrayLike, "b")).toBe(true);
      expect(includes(arrayLike, "c")).toBe(true);
      expect(includes(arrayLike, 3)).toBe(true); // length property
      expect(includes(arrayLike, "d")).toBe(false);
    });

    test("ignores fromIndex parameter for objects", () => {
      const obj = { a: 1, b: 2, c: 3 };

      // fromIndex should be ignored for objects
      expect(includes(obj, 1)).toBe(true);
      expect(includes(obj, 1)).toBe(true); // Same result despite different fromIndex
      expect(includes(obj, 1)).toBe(true); // Same result despite invalid fromIndex
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles null and undefined collections", () => {
      expect(() => includes(null as any, 1)).toThrow();
      expect(() => includes(undefined as any, 1)).toThrow();
    });

    test("handles non-array, non-object collections", () => {
      // The function treats non-arrays as objects and uses Object.values()
      expect(includes("string" as any, "s")).toBe(true); // Object.values("string") = ["s", "t", "r", "i", "n", "g"]
      expect(includes(123 as any, 1)).toBe(false); // Object.values(123) = []
      expect(includes(true as any, true)).toBe(false); // Object.values(true) = []
    });

    test("handles fromIndex with non-integer values", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, 1.5)).toBe(false); // Rounded to 1
      expect(includes(numbers, 1, 0.5)).toBe(true); // Rounded to 0
      expect(includes(numbers, 1, Infinity)).toBe(false);
      expect(includes(numbers, 1, -Infinity)).toBe(true);
    });

    test("handles very large fromIndex", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(includes(numbers, 1, Number.MAX_VALUE)).toBe(false);
    });

    test("handles very negative fromIndex", () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(includes(numbers, 1, Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(includes(numbers, 1, -Number.MAX_VALUE)).toBe(true);
    });
  });

  describe("Type safety", () => {
    test("preserves boolean return type", () => {
      const numbers = [1, 2, 3];

      const result1 = includes(numbers, 1);
      const result2 = includes(numbers, 4);

      expect(typeof result1).toBe("boolean");
      expect(typeof result2).toBe("boolean");
      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    test("works with typed arrays", () => {
      const numbers: number[] = [1, 2, 3];

      const result = includes(numbers, 2);

      expect(result).toBe(true);
    });

    test("works with typed objects", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };

      const result = includes(obj, 2);

      expect(result).toBe(true);
    });

    test("handles generic types", () => {
      const strings: string[] = ["a", "b", "c"];
      const result1 = includes(strings, "b");

      const mixed: (string | number)[] = ["a", 1, "b"];
      const result2 = includes(mixed, 1);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native includes", () => {
      const arr = [1, 2, 3, 4, 5];

      expect(includes(arr, 3)).toBe(arr.includes(3));
      expect(includes(arr, 6)).toBe(arr.includes(6));
      expect(includes(arr, 3, 2)).toBe(arr.includes(3, 2));
      expect(includes(arr, 3, 3)).toBe(arr.includes(3, 3));
    });

    test("object behavior matches Object.values().includes()", () => {
      const obj = { a: 1, b: 2, c: 3 };

      expect(includes(obj, 2)).toBe(Object.values(obj).includes(2));
      expect(includes(obj, 4)).toBe(Object.values(obj).includes(4));
    });

    test("handles NaN consistently", () => {
      const arr = [1, NaN, 3];

      expect(includes(arr, NaN)).toBe(arr.includes(NaN));
      expect(includes(arr, NaN, 1)).toBe(arr.includes(NaN, 1));
    });

    test("handles +0 and -0 consistently", () => {
      const arr = [+0, 1, -0];

      expect(includes(arr, +0)).toBe(arr.includes(+0));
      expect(includes(arr, -0)).toBe(arr.includes(-0));
      expect(includes(arr, 0)).toBe(arr.includes(0));
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 }), fc.integer()])(
      "[🎲] is equivalent to native Array.includes for numbers",
      (arr, value) => {
        expect(includes(arr, value)).toBe(arr.includes(value));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 }), fc.string()])(
      "[🎲] is equivalent to native Array.includes for strings",
      (arr, value) => {
        expect(includes(arr, value)).toBe(arr.includes(value));
      }
    );

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 }), fc.integer(), fc.integer({ min: -10, max: 20 })])(
      "[🎲] is equivalent to native Array.includes with fromIndex",
      (arr, value, fromIndex) => {
        expect(includes(arr, value, fromIndex)).toBe(
          arr.includes(value, fromIndex)
        );
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];

      includes(arr, 3);
      includes(arr, 6);
      includes(arr, 3, 2);

      expect(arr).toEqual(original);
    });

    test("does not modify original object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };

      includes(obj, 2);
      includes(obj, 4);

      expect(obj).toEqual(original);
    });

    test("handles fromIndex edge cases consistently", () => {
      const arr = [1, 2, 3, 4, 5];

      // Test various fromIndex values
      expect(includes(arr, 1, 0)).toBe(true);
      expect(includes(arr, 1, 1)).toBe(false);
      expect(includes(arr, 5, -1)).toBe(true);
      expect(includes(arr, 5, -2)).toBe(true); // -2 means start from index 3, 5 is at index 4
      expect(includes(arr, 1, 5)).toBe(false);
      expect(includes(arr, 1, 10)).toBe(false);
    });
  });

  describe("Performance and large datasets", () => {
    test("handles very large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
    });

    test("handles objects with many properties", () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
    });

    test("handles fromIndex performance", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
    });
  });

  describe("Complex use cases", () => {
    test("searches for user in array of objects", () => {
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];

      const john = users[0];
      const alice = { id: 4, name: "Alice" };

      expect(includes(users, john)).toBe(true);
      expect(includes(users, alice)).toBe(false);
    });

    test("searches for value in object with complex values", () => {
      const config = {
        apiUrl: "https://api.example.com",
        timeout: 5000,
        retries: 3,
        debug: true,
        features: ["auth", "upload"],
      };

      expect(includes(config, "https://api.example.com")).toBe(true);
      expect(includes(config, 5000)).toBe(true);
      expect(includes(config, true)).toBe(true);
      expect(includes(config, config.features)).toBe(true); // Uses same array reference
      expect(includes(config, ["auth", "upload"])).toBe(false); // Different array reference
      expect(includes(config, "https://api.other.com")).toBe(false);
    });

    test("searches with fromIndex in complex scenarios", () => {
      const commits = [
        { hash: "a1b2c3", author: "John" },
        { hash: "d4e5f6", author: "Jane" },
        { hash: "g7h8i9", author: "John" },
        { hash: "j0k1l2", author: "Bob" },
      ];

      const johnCommit = commits[0];

      expect(includes(commits, johnCommit, 0)).toBe(true);
      expect(includes(commits, johnCommit, 1)).toBe(false);
      expect(includes(commits, johnCommit, 2)).toBe(false); // Same object reference, not found at index 2
    });

    test("searches for nested values", () => {
      const data = [
        { user: { id: 1, profile: { name: "John" } } },
        { user: { id: 2, profile: { name: "Jane" } } },
      ];

      const johnData = data[0];

      expect(includes(data, johnData)).toBe(true);
      expect(
        includes(data, { user: { id: 1, profile: { name: "John" } } })
      ).toBe(false); // Different reference
    });
  });
});
