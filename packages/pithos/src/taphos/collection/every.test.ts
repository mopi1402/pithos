import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { every } from "./every";

describe("every", () => {
  describe("Array functionality", () => {
    test("returns true when all elements pass predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(numbers, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(5);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 3, 2, numbers);
      expect(predicate).toHaveBeenNthCalledWith(4, 4, 3, numbers);
      expect(predicate).toHaveBeenNthCalledWith(5, 5, 4, numbers);
    });

    test("returns false when any element fails predicate", () => {
      const numbers = [1, 2, -3, 4, 5];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(numbers, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(3); // Stops at first false
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, -3, 2, numbers);
    });

    test("returns true for empty array (vacuous truth)", () => {
      const emptyArray: number[] = [];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(emptyArray, predicate);

      expect(result).toBe(true);
      expect(predicate).not.toHaveBeenCalled();
    });

    test("returns true for single element array that passes", () => {
      const single = [42];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(single, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(42, 0, single);
    });

    test("returns false for single element array that fails", () => {
      const single = [-1];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(single, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(-1, 0, single);
    });

    test("handles different data types", () => {
      const mixed = [1, "hello", true, null, undefined];
      const predicate = vi.fn((item) => item != null);

      const result = every(mixed, predicate);

      expect(result).toBe(false); // null fails the test
      expect(predicate).toHaveBeenCalledTimes(4); // Stops at null
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, mixed);
      expect(predicate).toHaveBeenNthCalledWith(2, "hello", 1, mixed);
      expect(predicate).toHaveBeenNthCalledWith(3, true, 2, mixed);
      expect(predicate).toHaveBeenNthCalledWith(4, null, 3, mixed);
    });

    test("handles sparse arrays", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const predicate = vi.fn((item) => item > 0);

      const result = every(sparse, predicate);

      // every() skips empty slots in sparse arrays
      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(2);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, sparse);
      expect(predicate).toHaveBeenNthCalledWith(2, 3, 2, sparse);
    });

    test("handles array of objects", () => {
      const users = [
        { id: 1, name: "John", active: true },
        { id: 2, name: "Jane", active: true },
        { id: 3, name: "Bob", active: false },
      ];
      const predicate = vi.fn((user) => user.active);

      const result = every(users, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenNthCalledWith(1, users[0], 0, users);
      expect(predicate).toHaveBeenNthCalledWith(2, users[1], 1, users);
      expect(predicate).toHaveBeenNthCalledWith(3, users[2], 2, users);
    });

    test("uses index parameter in predicate", () => {
      const numbers = [10, 20, 30];
      const predicate = vi.fn((value, index) => value > index * 5);

      const result = every(numbers, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenNthCalledWith(1, 10, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 20, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 30, 2, numbers);
    });

    test("uses array parameter in predicate", () => {
      const numbers = [1, 2, 3];
      const predicate = vi.fn((value, index, array) => value <= array.length);

      const result = every(numbers, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 3, 2, numbers);
    });

    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);
      const predicate = vi.fn((n) => n >= 0);

      const result = every(large, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(1000);
    });

    test("stops early on first false result", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((n) => {
        if (n === 3) return false;
        return true;
      });

      const result = every(numbers, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(3); // Stops at index 2
    });
  });

  describe("Object functionality", () => {
    test("returns true when all values pass predicate", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn((value) => value > 0);

      const result = every(obj, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(2, "b", obj);
      expect(predicate).toHaveBeenCalledWith(3, "c", obj);
    });

    test("returns false when any value fails predicate", () => {
      const obj = { a: 1, b: -2, c: 3 };
      const predicate = vi.fn((value) => value > 0);

      const result = every(obj, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(2); // Stops at first false
      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(-2, "b", obj);
    });

    test("returns true for empty object (vacuous truth)", () => {
      const emptyObj = {};
      const predicate = vi.fn((value) => value > 0);

      const result = every(emptyObj, predicate);

      expect(result).toBe(true);
      expect(predicate).not.toHaveBeenCalled();
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
      const predicate = vi.fn((value) => value != null);

      const result = every(mixed, predicate);

      expect(result).toBe(false); // null fails the test
      expect(predicate).toHaveBeenCalledTimes(4); // Stops at null
      expect(predicate).toHaveBeenCalledWith(42, "num", mixed);
      expect(predicate).toHaveBeenCalledWith("hello", "str", mixed);
      expect(predicate).toHaveBeenCalledWith(true, "bool", mixed);
      expect(predicate).toHaveBeenCalledWith(null, "nullVal", mixed);
    });

    test("handles object with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };
      const predicate = vi.fn((value) => typeof value === "string");

      const result = every(obj, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith("zero", "0", obj);
      expect(predicate).toHaveBeenCalledWith("one", "1", obj);
      expect(predicate).toHaveBeenCalledWith("two", "2", obj);
    });

    test("handles object with symbol keys", () => {
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const obj = { [sym1]: "value1", [sym2]: "value2", regular: "value3" };
      const predicate = vi.fn((value) => typeof value === "string");

      const result = every(obj, predicate);

      // Object.entries() only returns enumerable string-keyed properties
      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith("value3", "regular", obj);
    });

    test("uses key parameter in predicate", () => {
      const obj = { x: 10, y: 20, z: 30 };
      const predicate = vi.fn((value, key) => key.length === 1);

      const result = every(obj, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(10, "x", obj);
      expect(predicate).toHaveBeenCalledWith(20, "y", obj);
      expect(predicate).toHaveBeenCalledWith(30, "z", obj);
    });

    test("uses object parameter in predicate", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn(
        (value, key, object) => value <= Object.keys(object).length
      );

      const result = every(obj, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(2, "b", obj);
      expect(predicate).toHaveBeenCalledWith(3, "c", obj);
    });

    test("handles object with inherited properties", () => {
      const parent = { inherited: "value" };
      const child = Object.create(parent);
      child.own = "ownValue";

      const predicate = vi.fn((value) => typeof value === "string");
      const result = every(child, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith("ownValue", "own", child);
    });

    test("handles array-like objects (not arrays)", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
      const predicate = vi.fn((value) => typeof value === "string");

      const result = every(arrayLike, predicate);

      // Object.entries() includes all enumerable properties including 'length'
      expect(result).toBe(false); // length is a number, not string
      expect(predicate).toHaveBeenCalledTimes(4);
      expect(predicate).toHaveBeenCalledWith("a", "0", arrayLike);
      expect(predicate).toHaveBeenCalledWith("b", "1", arrayLike);
      expect(predicate).toHaveBeenCalledWith("c", "2", arrayLike);
      expect(predicate).toHaveBeenCalledWith(3, "length", arrayLike);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles null and undefined values in array", () => {
      const arr = [null, undefined, 0, ""];
      const predicate = vi.fn((item) => item != null);

      const result = every(arr, predicate);

      expect(result).toBe(false); // null fails first
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(null, 0, arr);
    });

    test("[🎯] handles NaN values", () => {
      const arr = [+0, 1, -0];
      const predicate = vi.fn((item) => item === 0);

      const result = every(arr, predicate);

      expect(result).toBe(false); // 1 fails
      expect(predicate).toHaveBeenCalledTimes(2);
      expect(predicate).toHaveBeenCalledWith(+0, 0, arr);
      expect(predicate).toHaveBeenCalledWith(1, 1, arr);
    });

    test("handles predicate that throws error", () => {
      const arr = [1, 2, 3];
      const predicate = vi.fn((value, index) => {
        if (index === 1) throw new Error("Test error");
        return true;
      });

      expect(() => every(arr, predicate)).toThrow("Test error");
    });

    test("handles predicate that returns falsy values", () => {
      const arr = [1, 0, 2];
      const predicate = vi.fn((value) => value);

      const result = every(arr, predicate);

      expect(result).toBe(false); // 0 is falsy
      expect(predicate).toHaveBeenCalledTimes(2);
      expect(predicate).toHaveBeenCalledWith(1, 0, arr);
      expect(predicate).toHaveBeenCalledWith(0, 1, arr);
    });

    test("handles predicate that returns truthy values", () => {
      const arr = [1, "hello", true, {}];
      const predicate = vi.fn((value) => value);

      const result = every(arr, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(4);
    });
  });

  describe("Type safety", () => {
    test("preserves boolean return type", () => {
      const numbers = [1, 2, 3];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(numbers, predicate);

      expect(typeof result).toBe("boolean");
      expect(result).toBe(true);
    });

    test("works with typed arrays", () => {
      const numbers: number[] = [1, 2, 3];
      const predicate = vi.fn((n: number) => n > 0);

      const result = every(numbers, predicate);

      expect(result).toBe(true);
    });

    test("works with typed objects", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };
      const predicate = vi.fn((value: number) => value > 0);

      const result = every(obj, predicate);

      expect(result).toBe(true);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native every", () => {
      const arr = [1, 2, 3];
      const predicate1 = vi.fn((n) => n > 0);
      const predicate2 = vi.fn((n) => n > 0);

      const result1 = every(arr, predicate1);
      const result2 = arr.every(predicate2);

      expect(result1).toBe(result2);
      expect(predicate1.mock.calls).toEqual(predicate2.mock.calls);
    });

    test("object behavior matches Object.entries().every()", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate1 = vi.fn((value, key) => value > 0);
      const predicate2 = vi.fn((value, key, collection) => value > 0);

      const result1 = every(obj, predicate1);
      const result2 = Object.entries(obj).every(([key, value]) =>
        predicate2(value, key, obj)
      );

      expect(result1).toBe(result2);
      expect(predicate1.mock.calls).toEqual(predicate2.mock.calls);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.every for numbers",
      (arr) => {
        const predicate = (n: number) => n >= 0;
        expect(every(arr, predicate)).toBe(arr.every(predicate));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.every for strings",
      (arr) => {
        const predicate = (s: string) => s.length < 100;
        expect(every(arr, predicate)).toBe(arr.every(predicate));
      }
    );
  });

  describe("Function behavior", () => {
    test("predicate receives correct parameters for arrays", () => {
      const arr = ["a", "b", "c"];
      const predicate = vi.fn();

      every(arr, predicate);

      predicate.mock.calls.forEach((call, index) => {
        expect(call[0]).toBe(arr[index]); // value
        expect(call[1]).toBe(index); // index
        expect(call[2]).toBe(arr); // array
      });
    });

    test("predicate receives correct parameters for objects", () => {
      const obj = { x: 10, y: 20 };
      const predicate = vi.fn(() => true); // Always return true to ensure all calls

      every(obj, predicate);

      expect(predicate).toHaveBeenCalledWith(10, "x", obj);
      expect(predicate).toHaveBeenCalledWith(20, "y", obj);
    });

    test("short-circuits on first false result", () => {
      const arr = [1, 2, 3, 4, 5];
      const predicate = vi.fn((value, index) => {
        if (index === 2) return false;
        return true;
      });

      const result = every(arr, predicate);

      expect(result).toBe(false);
      expect(predicate).toHaveBeenCalledTimes(3); // Stops at index 2
    });

    test("continues until end if all true", () => {
      const arr = [1, 2, 3, 4, 5];
      const predicate = vi.fn(() => true);

      const result = every(arr, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(5);
    });
  });

  describe("Performance and large datasets", () => {
    test("handles very large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
      const predicate = vi.fn((n) => n >= 0);
    });

    test("stops early on large arrays when false", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
      const predicate = vi.fn((n) => n < 5000);
    });

    test("handles objects with many properties", () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const predicate = vi.fn((value) => value >= 0);

      const result = every(largeObj, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(1000);
    });
  });

  describe("Complex predicates", () => {
    test("works with complex object validation", () => {
      const users = [
        { id: 1, name: "John", age: 25, active: true },
        { id: 2, name: "Jane", age: 30, active: true },
        { id: 3, name: "Bob", age: 20, active: false },
      ];
      const predicate = vi.fn((user) => user.age >= 18 && user.active);

      const result = every(users, predicate);

      expect(result).toBe(false); // Bob is not active
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("works with nested object validation", () => {
      const data = [
        { user: { profile: { name: "John", verified: true } } },
        { user: { profile: { name: "Jane", verified: true } } },
        { user: { profile: { name: "Bob", verified: false } } },
      ];
      const predicate = vi.fn((item) => item.user.profile.verified);

      const result = every(data, predicate);

      expect(result).toBe(false); // Bob is not verified
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("works with conditional logic", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((num) => {
        if (num % 2 === 0) return num >= 2; // Changed from > 2 to >= 2
        return num > 0;
      });

      const result = every(numbers, predicate);

      expect(result).toBe(true);
      expect(predicate).toHaveBeenCalledTimes(5);
    });
  });
});
