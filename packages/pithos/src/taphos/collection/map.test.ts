import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { map } from "./map";

describe("map", () => {
  describe("Array functionality", () => {
    test("transforms array elements with iteratee", () => {
      const numbers = [1, 2, 3, 4, 5];
      const iteratee = vi.fn((n) => n * 2);

      const result = map(numbers, iteratee);

      expect(result).toEqual([2, 4, 6, 8, 10]);
      expect(iteratee).toHaveBeenCalledTimes(5);
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(3, 3, 2, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(4, 4, 3, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(5, 5, 4, numbers);
    });

    test("transforms array elements to different types", () => {
      const numbers = [1, 2, 3];
      const iteratee = vi.fn((n) => `Number: ${n}`);

      const result = map(numbers, iteratee);

      expect(result).toEqual(["Number: 1", "Number: 2", "Number: 3"]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles empty array", () => {
      const emptyArray: number[] = [];
      const iteratee = vi.fn((n) => n * 2);

      const result = map(emptyArray, iteratee);

      expect(result).toEqual([]);
      expect(iteratee).not.toHaveBeenCalled();
    });

    test("handles single element array", () => {
      const single = [42];
      const iteratee = vi.fn((n) => n * 2);

      const result = map(single, iteratee);

      expect(result).toEqual([84]);
      expect(iteratee).toHaveBeenCalledTimes(1);
      expect(iteratee).toHaveBeenCalledWith(42, 0, single);
    });

    test("handles different data types", () => {
      const mixed = [1, "hello", true, null, undefined];
      const iteratee = vi.fn((item) => typeof item);

      const result = map(mixed, iteratee);

      expect(result).toEqual([
        "number",
        "string",
        "boolean",
        "object",
        "undefined",
      ]);
      expect(iteratee).toHaveBeenCalledTimes(5);
    });

    test("handles sparse arrays", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const iteratee = vi.fn((item) => item);

      const result = map(sparse, iteratee);

      expect(result).toEqual([1, undefined, 3]);
      expect(iteratee).toHaveBeenCalledTimes(2); // map() skips empty slots
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, sparse);
      expect(iteratee).toHaveBeenNthCalledWith(2, 3, 2, sparse);
    });

    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);
      const iteratee = vi.fn((n) => n * 2);

      const result = map(large, iteratee);

      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(1998);
      expect(iteratee).toHaveBeenCalledTimes(1000);
    });

    test("uses index parameter in iteratee", () => {
      const numbers = [10, 20, 30];
      const iteratee = vi.fn((value, index) => value + index);

      const result = map(numbers, iteratee);

      expect(result).toEqual([10, 21, 32]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("uses array parameter in iteratee", () => {
      const numbers = [1, 2, 3];
      const iteratee = vi.fn((value, index, array) => value + array.length);

      const result = map(numbers, iteratee);

      expect(result).toEqual([4, 5, 6]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles complex transformation logic", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];
      const iteratee = vi.fn((user) => `${user.name} is ${user.age} years old`);

      const result = map(users, iteratee);

      expect(result).toEqual([
        "John is 25 years old",
        "Jane is 30 years old",
        "Bob is 20 years old",
      ]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles objects in array", () => {
      const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const iteratee = vi.fn((obj) => obj.id * 2);

      const result = map(objects, iteratee);

      expect(result).toEqual([2, 4, 6]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles arrays in array", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const iteratee = vi.fn((arr) => arr.length);

      const result = map(arrays, iteratee);

      expect(result).toEqual([2, 2, 2]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });
  });

  describe("Object functionality", () => {
    test("transforms object values with iteratee", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn((value) => value * 2);

      const result = map(obj, iteratee);

      expect(result).toEqual([2, 4, 6]);
      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(1, "a", obj);
      expect(iteratee).toHaveBeenCalledWith(2, "b", obj);
      expect(iteratee).toHaveBeenCalledWith(3, "c", obj);
    });

    test("transforms object values to different types", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn((value, key) => `${key}: ${value}`);

      const result = map(obj, iteratee);

      expect(result).toEqual(["a: 1", "b: 2", "c: 3"]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles empty object", () => {
      const emptyObj = {};
      const iteratee = vi.fn((value) => value * 2);

      const result = map(emptyObj, iteratee);

      expect(result).toEqual([]);
      expect(iteratee).not.toHaveBeenCalled();
    });

    test("handles single property object", () => {
      const obj = { single: 42 };
      const iteratee = vi.fn((value) => value * 2);

      const result = map(obj, iteratee);

      expect(result).toEqual([84]);
      expect(iteratee).toHaveBeenCalledTimes(1);
      expect(iteratee).toHaveBeenCalledWith(42, "single", obj);
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
      const iteratee = vi.fn((value) => typeof value);

      const result = map(mixed, iteratee);

      expect(result).toEqual([
        "number",
        "string",
        "boolean",
        "object",
        "undefined",
        "object",
      ]);
      expect(iteratee).toHaveBeenCalledTimes(6);
    });

    test("handles object with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };
      const iteratee = vi.fn((value, key) => `${key}: ${value}`);

      const result = map(obj, iteratee);

      expect(result).toEqual(["0: zero", "1: one", "2: two"]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles object with symbol keys", () => {
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const obj = { [sym1]: "value1", [sym2]: "value2", regular: "value3" };
      const iteratee = vi.fn((value) => value);

      const result = map(obj, iteratee);

      // Object.entries() only returns enumerable string-keyed properties
      expect(result).toEqual(["value3"]);
      expect(iteratee).toHaveBeenCalledTimes(1);
    });

    test("uses key parameter in iteratee", () => {
      const obj = { x: 10, y: 20, z: 30 };
      const iteratee = vi.fn((value, key) => key);

      const result = map(obj, iteratee);

      expect(result).toEqual(["x", "y", "z"]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("uses object parameter in iteratee", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn(
        (value, key, object) => Object.keys(object).length
      );

      const result = map(obj, iteratee);

      expect(result).toEqual([3, 3, 3]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles object with inherited properties", () => {
      const parent = { inherited: "value" };
      const child = Object.create(parent);
      child.own = "ownValue";

      const iteratee = vi.fn((value) => value);
      const result = map(child, iteratee);

      expect(result).toEqual(["ownValue"]);
      expect(iteratee).toHaveBeenCalledTimes(1);
    });

    test("handles array-like objects (not arrays)", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
      const iteratee = vi.fn((value) => value);

      const result = map(arrayLike, iteratee);

      // Object.entries() includes all enumerable properties including 'length'
      expect(result).toEqual(["a", "b", "c", 3]);
      expect(iteratee).toHaveBeenCalledTimes(4);
    });

    test("handles complex object transformation", () => {
      const config = {
        apiUrl: "https://api.example.com",
        timeout: 5000,
        retries: 3,
        debug: true,
      };
      const iteratee = vi.fn((value, key) => `${key}=${value}`);

      const result = map(config, iteratee);

      expect(result).toEqual([
        "apiUrl=https://api.example.com",
        "timeout=5000",
        "retries=3",
        "debug=true",
      ]);
      expect(iteratee).toHaveBeenCalledTimes(4);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles null and undefined values", () => {
      const arr = [null, undefined, 0, ""];
      const iteratee = vi.fn((item) => item);

      const result = map(arr, iteratee);

      expect(result).toEqual([null, undefined, 0, ""]);
      expect(iteratee).toHaveBeenCalledTimes(4);
    });

    test("[🎯] handles NaN values", () => {
      const arr = [1, NaN, 3];
      const iteratee = vi.fn((item) => item);

      const result = map(arr, iteratee);

      expect(result).toEqual([1, NaN, 3]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0];
      const iteratee = vi.fn((item) => item);

      const result = map(arr, iteratee);

      expect(result).toEqual([+0, 1, -0]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles iteratee that throws error", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => {
        if (value === 2) throw new Error("Test error");
        return value;
      });

      expect(() => map(arr, iteratee)).toThrow("Test error");
    });

    test("handles iteratee that returns undefined", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => (value > 2 ? undefined : value));

      const result = map(arr, iteratee);

      expect(result).toEqual([1, 2, undefined]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles iteratee that returns null", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => (value > 2 ? null : value));

      const result = map(arr, iteratee);

      expect(result).toEqual([1, 2, null]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles iteratee that returns objects", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => ({ doubled: value * 2 }));

      const result = map(arr, iteratee);

      expect(result).toEqual([{ doubled: 2 }, { doubled: 4 }, { doubled: 6 }]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("handles iteratee that returns functions", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => () => value);

      const result = map(arr, iteratee);

      expect(result).toHaveLength(3);
      expect(typeof result[0]).toBe("function");
      expect(result[0]()).toBe(1);
      expect(result[1]()).toBe(2);
      expect(result[2]()).toBe(3);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type transformation", () => {
      const numbers: number[] = [1, 2, 3];
      const iteratee = vi.fn((n: number) => n * 2);

      const result = map(numbers, iteratee);

      expect(result).toEqual([2, 4, 6]);
      expect(typeof result[0]).toBe("number");
    });

    test("preserves object value type transformation", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };
      const iteratee = vi.fn((value: number) => value * 2);

      const result = map(obj, iteratee);

      expect(result).toEqual([2, 4]);
      expect(typeof result[0]).toBe("number");
    });

    test("returns array for arrays", () => {
      const numbers: number[] = [1, 2, 3];
      const iteratee = vi.fn((n: number) => n);

      const result = map(numbers, iteratee);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([1, 2, 3]);
    });

    test("returns array for objects", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };
      const iteratee = vi.fn((value: number) => value);

      const result = map(obj, iteratee);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([1, 2]);
    });

    test("handles generic types", () => {
      const strings: string[] = ["a", "b", "c"];
      const result1 = map(strings, (s) => s.toUpperCase());

      const mixed: (string | number)[] = ["a", 1, "b"];
      const result2 = map(mixed, (item) => String(item));

      expect(result1).toEqual(["A", "B", "C"]);
      expect(result2).toEqual(["a", "1", "b"]);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native map", () => {
      const arr = [1, 2, 3, 4, 5];
      const iteratee1 = vi.fn((n) => n * 2);
      const iteratee2 = vi.fn((n) => n * 2);

      const result1 = map(arr, iteratee1);
      const result2 = arr.map(iteratee2);

      expect(result1).toEqual(result2);
      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });

    test("object behavior matches Object.entries().map()", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee1 = vi.fn((value, key) => value * 2);
      const iteratee2 = vi.fn((value, key, collection) => value * 2);

      const result1 = map(obj, iteratee1);
      const result2 = Object.entries(obj).map(([key, value]) =>
        iteratee2(value, key, obj)
      );

      expect(result1).toEqual(result2);
      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });

    test("handles NaN consistently", () => {
      const arr = [1, NaN, 3];
      const iteratee1 = vi.fn((n) => n);
      const iteratee2 = vi.fn((n) => n);

      const result1 = map(arr, iteratee1);
      const result2 = arr.map(iteratee2);

      expect(result1).toEqual(result2);
      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });

    test("handles +0 and -0 consistently", () => {
      const arr = [+0, 1, -0];
      const iteratee1 = vi.fn((n) => n);
      const iteratee2 = vi.fn((n) => n);

      const result1 = map(arr, iteratee1);
      const result2 = arr.map(iteratee2);

      expect(result1).toEqual(result2);
      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });

    itProp.prop([fc.array(fc.integer(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.map for numbers",
      (arr) => {
        const iteratee = (n: number) => n * 2;
        expect(map(arr, iteratee)).toEqual(arr.map(iteratee));
      }
    );

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.map for strings",
      (arr) => {
        const iteratee = (s: string) => s.toUpperCase();
        expect(map(arr, iteratee)).toEqual(arr.map(iteratee));
      }
    );
  });

  describe("Function behavior", () => {
    test("iteratee receives correct parameters for arrays", () => {
      const arr = ["a", "b", "c"];
      const iteratee = vi.fn();

      map(arr, iteratee);

      iteratee.mock.calls.forEach((call, index) => {
        expect(call[0]).toBe(arr[index]); // value
        expect(call[1]).toBe(index); // index
        expect(call[2]).toBe(arr); // array
      });
    });

    test("iteratee receives correct parameters for objects", () => {
      const obj = { x: 10, y: 20 };
      const iteratee = vi.fn();

      map(obj, iteratee);

      expect(iteratee).toHaveBeenCalledWith(10, "x", obj);
      expect(iteratee).toHaveBeenCalledWith(20, "y", obj);
    });

    test("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];

      map(arr, (n) => n * 2);

      expect(arr).toEqual(original);
    });

    test("does not modify original object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };

      map(obj, (value) => value * 2);

      expect(obj).toEqual(original);
    });

    test("returns new array instance", () => {
      const arr = [1, 2, 3];
      const result = map(arr, (n) => n);

      expect(result).not.toBe(arr);
      expect(result).toEqual(arr);
    });
  });

  describe("Performance and large datasets", () => {
    test("handles very large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
      const iteratee = vi.fn((n) => n * 2);
    });

    test("handles objects with many properties", () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const iteratee = vi.fn((value) => value * 2);

      const result = map(largeObj, iteratee);

      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(1998);
      expect(iteratee).toHaveBeenCalledTimes(1000);
    });
  });

  describe("Complex use cases", () => {
    test("transforms user data", () => {
      const users = [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 20 },
      ];
      const iteratee = vi.fn((user) => ({
        ...user,
        isAdult: user.age >= 18,
        displayName: user.name.toUpperCase(),
      }));

      const result = map(users, iteratee);

      expect(result).toEqual([
        { id: 1, name: "John", age: 25, isAdult: true, displayName: "JOHN" },
        { id: 2, name: "Jane", age: 30, isAdult: true, displayName: "JANE" },
        { id: 3, name: "Bob", age: 20, isAdult: true, displayName: "BOB" },
      ]);
      expect(iteratee).toHaveBeenCalledTimes(3);
    });

    test("transforms configuration object", () => {
      const config = {
        apiUrl: "https://api.example.com",
        timeout: 5000,
        retries: 3,
        debug: true,
      };
      const iteratee = vi.fn((value, key) => ({
        key,
        value,
        type: typeof value,
        stringified: String(value),
      }));

      const result = map(config, iteratee);

      expect(result).toEqual([
        {
          key: "apiUrl",
          value: "https://api.example.com",
          type: "string",
          stringified: "https://api.example.com",
        },
        { key: "timeout", value: 5000, type: "number", stringified: "5000" },
        { key: "retries", value: 3, type: "number", stringified: "3" },
        { key: "debug", value: true, type: "boolean", stringified: "true" },
      ]);
      expect(iteratee).toHaveBeenCalledTimes(4);
    });

    test("transforms nested data structures", () => {
      const data = [
        { user: { id: 1, profile: { name: "John" } } },
        { user: { id: 2, profile: { name: "Jane" } } },
      ];
      const iteratee = vi.fn((item) => item.user.profile.name);

      const result = map(data, iteratee);

      expect(result).toEqual(["John", "Jane"]);
      expect(iteratee).toHaveBeenCalledTimes(2);
    });

    test("transforms with conditional logic", () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const iteratee = vi.fn((n) => {
        if (n % 2 === 0) return { type: "even", value: n };
        return { type: "odd", value: n };
      });

      const result = map(numbers, iteratee);

      expect(result).toEqual([
        { type: "odd", value: 1 },
        { type: "even", value: 2 },
        { type: "odd", value: 3 },
        { type: "even", value: 4 },
        { type: "odd", value: 5 },
        { type: "even", value: 6 },
      ]);
      expect(iteratee).toHaveBeenCalledTimes(6);
    });

    test("transforms with async-like operations", () => {
      const urls = ["/api/users", "/api/posts", "/api/comments"];
      const iteratee = vi.fn((url) => ({
        url,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        timestamp: Date.now(),
      }));

      const result = map(urls, iteratee);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        url: "/api/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      expect(typeof result[0].timestamp).toBe("number");
      expect(iteratee).toHaveBeenCalledTimes(3);
    });
  });
});
