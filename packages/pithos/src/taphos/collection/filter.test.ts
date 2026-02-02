import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { filter } from "./filter";

describe("filter", () => {
  describe("Array functionality", () => {
    test("filters elements that pass predicate", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((n: number) => n % 2 === 0);

      const result = filter(numbers, predicate);

      expect(result).toEqual([2, 4]);
      expect(predicate).toHaveBeenCalledTimes(5);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 3, 2, numbers);
      expect(predicate).toHaveBeenNthCalledWith(4, 4, 3, numbers);
      expect(predicate).toHaveBeenNthCalledWith(5, 5, 4, numbers);
    });

    test("returns empty array when no elements pass predicate", () => {
      const numbers = [1, 3, 5, 7];
      const predicate = vi.fn((n: number) => n % 2 === 0);

      const result = filter(numbers, predicate);

      expect(result).toEqual([]);
      expect(predicate).toHaveBeenCalledTimes(4);
    });

    test("returns all elements when all pass predicate", () => {
      const numbers = [2, 4, 6, 8];
      const predicate = vi.fn((n: number) => n % 2 === 0);

      const result = filter(numbers, predicate);

      expect(result).toEqual([2, 4, 6, 8]);
      expect(predicate).toHaveBeenCalledTimes(4);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];
      const predicate = vi.fn((n: number) => n > 0);

      const result = filter(emptyArray, predicate);

      expect(result).toEqual([]);
      expect(predicate).not.toHaveBeenCalled();
    });

    test("handles single element array", () => {
      const single = [42];
      const predicate = vi.fn((n: number) => n > 0);

      const result = filter(single, predicate);

      expect(result).toEqual([42]);
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(42, 0, single);
    });

    test("handles different data types", () => {
      const mixed = [1, "hello", true, null, undefined];
      const predicate = vi.fn((item) => item != null);

      const result = filter(mixed, predicate);

      expect(result).toEqual([1, "hello", true]);
      expect(predicate).toHaveBeenCalledTimes(5);
    });

    test("handles sparse arrays", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const predicate = vi.fn((item) => item > 0);

      const result = filter(sparse, predicate);

      // filter() skips empty slots in sparse arrays
      expect(result).toEqual([1, 3]);
      expect(predicate).toHaveBeenCalledTimes(2);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, sparse);
      expect(predicate).toHaveBeenNthCalledWith(2, 3, 2, sparse);
    });

    test("handles array of objects", () => {
      const users = [
        { id: 1, name: "John", active: true },
        { id: 2, name: "Jane", active: false },
        { id: 3, name: "Bob", active: true },
      ];
      const predicate = vi.fn((user) => user.active);

      const result = filter(users, predicate);

      expect(result).toEqual([
        { id: 1, name: "John", active: true },
        { id: 3, name: "Bob", active: true },
      ]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("uses index parameter in predicate", () => {
      const numbers = [10, 20, 30];
      const predicate = vi.fn((value, index) => index % 2 === 0);

      const result = filter(numbers, predicate);

      expect(result).toEqual([10, 30]);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenNthCalledWith(1, 10, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 20, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 30, 2, numbers);
    });

    test("uses array parameter in predicate", () => {
      const numbers = [1, 2, 3];
      const predicate = vi.fn((value, index, array) => value <= array.length);

      const result = filter(numbers, predicate);

      expect(result).toEqual([1, 2, 3]);
      expect(predicate).toHaveBeenCalledTimes(3);
      expect(predicate).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(predicate).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(predicate).toHaveBeenNthCalledWith(3, 3, 2, numbers);
    });

    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);
      const predicate = vi.fn((n) => n % 2 === 0);

      const result = filter(large, predicate);

      expect(result).toHaveLength(500);
      expect(result[0]).toBe(0);
      expect(result[499]).toBe(998);
      expect(predicate).toHaveBeenCalledTimes(1000);
    });

    test("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      const predicate = vi.fn((n) => n % 2 === 0);

      const result = filter(arr, predicate);

      expect(arr).toEqual(original);
      expect(result).not.toBe(arr);
      expect(result).toEqual([2, 4]);
    });

    test("returns new array instance", () => {
      const arr = [1, 2, 3];
      const predicate = vi.fn((n) => n > 0);

      const result = filter(arr, predicate);

      expect(result).not.toBe(arr);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Object functionality", () => {
    test("filters object properties that pass predicate", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const predicate = vi.fn((value) => value % 2 === 0);

      const result = filter(obj, predicate);

      expect(result).toEqual({ b: 2, d: 4 });
      expect(predicate).toHaveBeenCalledTimes(4);
      expect(predicate).toHaveBeenCalledWith(1, "a", obj);
      expect(predicate).toHaveBeenCalledWith(2, "b", obj);
      expect(predicate).toHaveBeenCalledWith(3, "c", obj);
      expect(predicate).toHaveBeenCalledWith(4, "d", obj);
    });

    test("returns empty object when no properties pass predicate", () => {
      const obj = { a: 1, b: 3, c: 5 };
      const predicate = vi.fn((value) => value % 2 === 0);

      const result = filter(obj, predicate);

      expect(result).toEqual({});
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("returns all properties when all pass predicate", () => {
      const obj = { a: 2, b: 4, c: 6 };
      const predicate = vi.fn((value) => value % 2 === 0);

      const result = filter(obj, predicate);

      expect(result).toEqual({ a: 2, b: 4, c: 6 });
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("handles empty object", () => {
      const emptyObj = {};
      const predicate = vi.fn((value) => value > 0);

      const result = filter(emptyObj, predicate);

      expect(result).toEqual({});
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

      const result = filter(mixed, predicate);

      expect(result).toEqual({
        num: 42,
        str: "hello",
        bool: true,
        obj: { nested: true },
      });
      expect(predicate).toHaveBeenCalledTimes(6);
    });

    test("handles object with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };
      const predicate = vi.fn((value) => value.includes("o"));

      const result = filter(obj, predicate);

      expect(result).toEqual({ 0: "zero", 1: "one", 2: "two" });
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

      const result = filter(obj, predicate);

      // Object.entries() only returns enumerable string-keyed properties
      expect(result).toEqual({ regular: "value3" });
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith("value3", "regular", obj);
    });

    test("uses key parameter in predicate", () => {
      const obj = { x: 10, y: 20, z: 30 };
      const predicate = vi.fn((value, key) => key.length === 1);

      const result = filter(obj, predicate);

      expect(result).toEqual({ x: 10, y: 20, z: 30 });
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

      const result = filter(obj, predicate);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
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
      const result = filter(child, predicate);

      expect(result).toEqual({ own: "ownValue" });
      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith("ownValue", "own", child);
    });

    test("handles array-like objects (not arrays)", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
      const predicate = vi.fn((value) => typeof value === "string");

      const result = filter(arrayLike, predicate);

      // Object.entries() includes all enumerable properties including 'length'
      expect(result).toEqual({ 0: "a", 1: "b", 2: "c" });
      expect(predicate).toHaveBeenCalledTimes(4);
      expect(predicate).toHaveBeenCalledWith("a", "0", arrayLike);
      expect(predicate).toHaveBeenCalledWith("b", "1", arrayLike);
      expect(predicate).toHaveBeenCalledWith("c", "2", arrayLike);
      expect(predicate).toHaveBeenCalledWith(3, "length", arrayLike);
    });

    test("does not modify original object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };
      const predicate = vi.fn((value) => value % 2 === 0);

      const result = filter(obj, predicate);

      expect(obj).toEqual(original);
      expect(result).not.toBe(obj);
      expect(result).toEqual({ b: 2 });
    });

    test("returns new object instance", () => {
      const obj = { a: 1, b: 2 };
      const predicate = vi.fn((value) => value > 0);

      const result = filter(obj, predicate);

      expect(result).not.toBe(obj);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles null and undefined values in array", () => {
      const arr = [null, undefined, 0, ""];
      const predicate = vi.fn((item) => item != null);

      const result = filter(arr, predicate);

      expect(result).toEqual([0, ""]);
      expect(predicate).toHaveBeenCalledTimes(4);
    });

    test("[🎯] handles NaN values", () => {
      const arr = [1, NaN, 3];
      const predicate = vi.fn((item) => !isNaN(item));

      const result = filter(arr, predicate);

      expect(result).toEqual([1, 3]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("[🎯] handles +0 and -0", () => {
      const arr = [+0, 1, -0];
      const predicate = vi.fn((item) => item === 0);

      const result = filter(arr, predicate);

      expect(result).toEqual([+0, -0]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("handles predicate that throws error", () => {
      const arr = [1, 2, 3];
      const predicate = vi.fn((value, index) => {
        if (index === 1) throw new Error("Test error");
        return true;
      });

      expect(() => filter(arr, predicate)).toThrow("Test error");
    });

    test("handles predicate that returns falsy values", () => {
      const arr = [1, 0, 2, false, 3];
      const predicate = vi.fn((value) => value);

      const result = filter(arr, predicate);

      expect(result).toEqual([1, 2, 3]);
      expect(predicate).toHaveBeenCalledTimes(5);
    });

    test("handles predicate that returns truthy values", () => {
      const arr = [1, "hello", true, {}];
      const predicate = vi.fn((value) => value);

      const result = filter(arr, predicate);

      expect(result).toEqual([1, "hello", true, {}]);
      expect(predicate).toHaveBeenCalledTimes(4);
    });
  });

  describe("Type safety", () => {
    test("preserves array type", () => {
      const numbers: number[] = [1, 2, 3];
      const predicate = vi.fn((n: number) => n > 0);

      const result = filter(numbers, predicate);

      expect(result).toEqual([1, 2, 3]);
      expect(Array.isArray(result)).toBe(true);
    });

    test("preserves object type", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };
      const predicate = vi.fn((value: number) => value > 0);

      const result = filter(obj, predicate);

      expect(result).toEqual({ a: 1, b: 2 });
      expect(typeof result).toBe("object");
      expect(Array.isArray(result)).toBe(false);
    });

    test("returns Partial<T> for objects", () => {
      const obj: { a: number; b: number; c: number } = { a: 1, b: 2, c: 3 };
      const predicate = vi.fn((value: number) => value % 2 === 0);

      const result = filter(obj, predicate);

      expect(result).toEqual({ b: 2 });
      expect(result).toHaveProperty("b");
      expect(result).not.toHaveProperty("a");
      expect(result).not.toHaveProperty("c");
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native filter", () => {
      const arr = [1, 2, 3, 4, 5];
      const predicate1 = vi.fn((n) => n % 2 === 0);
      const predicate2 = vi.fn((n) => n % 2 === 0);

      const result1 = filter(arr, predicate1);
      const result2 = arr.filter(predicate2);

      expect(result1).toEqual(result2);
      expect(predicate1.mock.calls).toEqual(predicate2.mock.calls);
    });

    test("object behavior matches Object.entries().filter().reduce()", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const predicate1 = vi.fn((value, key) => value % 2 === 0);
      const predicate2 = vi.fn((value, key, collection) => value % 2 === 0);

      const result1 = filter(obj, predicate1);
      const result2 = Object.entries(obj)
        .filter(([key, value]) => predicate2(value, key, obj))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as any);

      expect(result1).toEqual(result2);
      expect(predicate1.mock.calls).toEqual(predicate2.mock.calls);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.filter for numbers",
      (arr) => {
        const predicate = (n: number) => n % 2 === 0;
        expect(filter(arr, predicate)).toEqual(arr.filter(predicate));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.filter for strings",
      (arr) => {
        const predicate = (s: string) => s.length > 2;
        expect(filter(arr, predicate)).toEqual(arr.filter(predicate));
      }
    );
  });

  describe("Function behavior", () => {
    test("predicate receives correct parameters for arrays", () => {
      const arr = ["a", "b", "c"];
      const predicate = vi.fn();

      filter(arr, predicate);

      predicate.mock.calls.forEach((call, index) => {
        expect(call[0]).toBe(arr[index]); // value
        expect(call[1]).toBe(index); // index
        expect(call[2]).toBe(arr); // array
      });
    });

    test("predicate receives correct parameters for objects", () => {
      const obj = { x: 10, y: 20 };
      const predicate = vi.fn(() => true); // Always return true to ensure all calls

      filter(obj, predicate);

      expect(predicate).toHaveBeenCalledWith(10, "x", obj);
      expect(predicate).toHaveBeenCalledWith(20, "y", obj);
    });

    test("handles predicate that returns different types", () => {
      const arr = [1, 2, 3];
      const predicate = vi.fn((value) => (value % 2 === 0 ? "even" : "odd"));

      const result = filter(arr, predicate as any);

      // All values are included because predicate always returns truthy values
      expect(result).toEqual([1, 2, 3]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });
  });

  describe("Performance and large datasets", () => {
    test("handles very large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
      const predicate = vi.fn((n) => n % 2 === 0);

      const result = filter(large, predicate);

      expect(result).toHaveLength(5000);
      expect(predicate).toHaveBeenCalledTimes(10000);
    });

    test("handles objects with many properties", () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const predicate = vi.fn((value) => value % 2 === 0);

      const result = filter(largeObj, predicate);

      expect(Object.keys(result)).toHaveLength(500);
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

      const result = filter(users, predicate);

      expect(result).toEqual([
        { id: 1, name: "John", age: 25, active: true },
        { id: 2, name: "Jane", age: 30, active: true },
      ]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("works with nested object validation", () => {
      const data = [
        { user: { profile: { name: "John", verified: true } } },
        { user: { profile: { name: "Jane", verified: true } } },
        { user: { profile: { name: "Bob", verified: false } } },
      ];
      const predicate = vi.fn((item) => item.user.profile.verified);

      const result = filter(data, predicate);

      expect(result).toEqual([
        { user: { profile: { name: "John", verified: true } } },
        { user: { profile: { name: "Jane", verified: true } } },
      ]);
      expect(predicate).toHaveBeenCalledTimes(3);
    });

    test("works with conditional logic", () => {
      const numbers = [1, 2, 3, 4, 5];
      const predicate = vi.fn((num) => {
        if (num % 2 === 0) return num >= 2;
        return num > 0;
      });

      const result = filter(numbers, predicate);

      expect(result).toEqual([1, 2, 3, 4, 5]);
      expect(predicate).toHaveBeenCalledTimes(5);
    });

    test("works with object property filtering", () => {
      const obj = {
        user1: { name: "John", role: "admin", active: true },
        user2: { name: "Jane", role: "user", active: true },
        user3: { name: "Bob", role: "admin", active: false },
      };
      const predicate = vi.fn(
        (value) => value.role === "admin" && value.active
      );

      const result = filter(obj, predicate);

      expect(result).toEqual({
        user1: { name: "John", role: "admin", active: true },
      });
      expect(predicate).toHaveBeenCalledTimes(3);
    });
  });
});
