import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { each } from "./each";

describe("each", () => {
  describe("Array functionality", () => {
    test("iterates over array elements with value and index", () => {
      const numbers = [1, 2, 3, 4, 5];
      const iteratee = vi.fn();

      const result = each(numbers, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(5);
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(2, 2, 1, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(3, 3, 2, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(4, 4, 3, numbers);
      expect(iteratee).toHaveBeenNthCalledWith(5, 5, 4, numbers);
      expect(result).toBe(numbers);
    });

    test("[🎯] handles empty array", () => {
      const emptyArray: number[] = [];
      const iteratee = vi.fn();

      const result = each(emptyArray, iteratee);

      expect(iteratee).not.toHaveBeenCalled();
      expect(result).toBe(emptyArray);
    });

    test("handles single element array", () => {
      const single = [42];
      const iteratee = vi.fn();

      const result = each(single, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(1);
      expect(iteratee).toHaveBeenCalledWith(42, 0, single);
      expect(result).toBe(single);
    });

    test("handles array with different data types", () => {
      const mixed = [1, "hello", true, null, undefined];
      const iteratee = vi.fn();

      const result = each(mixed, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(5);
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, mixed);
      expect(iteratee).toHaveBeenNthCalledWith(2, "hello", 1, mixed);
      expect(iteratee).toHaveBeenNthCalledWith(3, true, 2, mixed);
      expect(iteratee).toHaveBeenNthCalledWith(4, null, 3, mixed);
      expect(iteratee).toHaveBeenNthCalledWith(5, undefined, 4, mixed);
      expect(result).toBe(mixed);
    });

    test("[🎯] handles sparse arrays", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const iteratee = vi.fn();

      const result = each(sparse, iteratee);

      // forEach skips empty slots in sparse arrays
      expect(iteratee).toHaveBeenCalledTimes(2);
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, sparse);
      expect(iteratee).toHaveBeenNthCalledWith(2, 3, 2, sparse);
      expect(result).toBe(sparse);
    });

    test("handles array of objects", () => {
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];
      const iteratee = vi.fn();

      const result = each(users, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenNthCalledWith(1, users[0], 0, users);
      expect(iteratee).toHaveBeenNthCalledWith(2, users[1], 1, users);
      expect(iteratee).toHaveBeenNthCalledWith(3, users[2], 2, users);
      expect(result).toBe(users);
    });

    test("iteratee can modify array elements", () => {
      const numbers = [1, 2, 3];
      const iteratee = vi.fn((value, index, array) => {
        array[index] = value * 2;
      });

      const result = each(numbers, iteratee);

      expect(numbers).toEqual([2, 4, 6]);
      expect(result).toBe(numbers);
    });

    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);
      const iteratee = vi.fn();

      const result = each(large, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(1000);
      expect(iteratee).toHaveBeenNthCalledWith(1, 0, 0, large);
      expect(iteratee).toHaveBeenNthCalledWith(1000, 999, 999, large);
      expect(result).toBe(large);
    });
  });

  describe("Object functionality", () => {
    test("iterates over object properties with value, key, and object", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn();

      const result = each(obj, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(1, "a", obj);
      expect(iteratee).toHaveBeenCalledWith(2, "b", obj);
      expect(iteratee).toHaveBeenCalledWith(3, "c", obj);
      expect(result).toBe(obj);
    });

    test("[🎯] handles empty object", () => {
      const emptyObj = {};
      const iteratee = vi.fn();

      const result = each(emptyObj, iteratee);

      expect(iteratee).not.toHaveBeenCalled();
      expect(result).toBe(emptyObj);
    });

    test("handles object with different value types", () => {
      const mixed = {
        num: 42,
        str: "hello",
        bool: true,
        nullVal: null,
        undefinedVal: undefined,
        obj: { nested: true },
      };
      const iteratee = vi.fn();

      const result = each(mixed, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(6);
      expect(iteratee).toHaveBeenCalledWith(42, "num", mixed);
      expect(iteratee).toHaveBeenCalledWith("hello", "str", mixed);
      expect(iteratee).toHaveBeenCalledWith(true, "bool", mixed);
      expect(iteratee).toHaveBeenCalledWith(null, "nullVal", mixed);
      expect(iteratee).toHaveBeenCalledWith(undefined, "undefinedVal", mixed);
      expect(iteratee).toHaveBeenCalledWith({ nested: true }, "obj", mixed);
      expect(result).toBe(mixed);
    });

    test("handles object with numeric keys", () => {
      const obj = { 0: "zero", 1: "one", 2: "two" };
      const iteratee = vi.fn();

      const result = each(obj, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith("zero", "0", obj);
      expect(iteratee).toHaveBeenCalledWith("one", "1", obj);
      expect(iteratee).toHaveBeenCalledWith("two", "2", obj);
      expect(result).toBe(obj);
    });

    test("handles object with symbol keys", () => {
      const sym1 = Symbol("key1");
      const sym2 = Symbol("key2");
      const obj = { [sym1]: "value1", [sym2]: "value2", regular: "value3" };
      const iteratee = vi.fn();

      const result = each(obj, iteratee);

      // Object.entries() only returns enumerable string-keyed properties
      expect(iteratee).toHaveBeenCalledTimes(1);
      expect(iteratee).toHaveBeenCalledWith("value3", "regular", obj);
      expect(result).toBe(obj);
    });

    test("iteratee can modify object properties", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn((value, key, object) => {
        object[key] = value * 2;
      });

      const result = each(obj, iteratee);

      expect(obj).toEqual({ a: 2, b: 4, c: 6 });
      expect(result).toBe(obj);
    });

    test("handles object with inherited properties", () => {
      const parent = { inherited: "value" };
      const child = Object.create(parent);
      child.own = "ownValue";

      const iteratee = vi.fn();
      const result = each(child, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(1);
      expect(iteratee).toHaveBeenCalledWith("ownValue", "own", child);
      expect(result).toBe(child);
    });
  });

  describe("Return value", () => {
    test("returns original array reference", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn();

      const result = each(arr, iteratee);

      expect(result).toBe(arr);
    });

    test("returns original object reference", () => {
      const obj = { a: 1, b: 2 };
      const iteratee = vi.fn();

      const result = each(obj, iteratee);

      expect(result).toBe(obj);
    });

    test("returns same reference even when iteratee modifies collection", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value, index, array) => {
        array[index] = value * 10;
      });

      const result = each(arr, iteratee);

      expect(result).toBe(arr);
      expect(arr).toEqual([10, 20, 30]);
    });
  });

  describe("Edge cases", () => {
    test("handles null and undefined values in array", () => {
      const arr = [null, undefined, 0, ""];
      const iteratee = vi.fn();

      const result = each(arr, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(4);
      expect(iteratee).toHaveBeenNthCalledWith(1, null, 0, arr);
      expect(iteratee).toHaveBeenNthCalledWith(2, undefined, 1, arr);
      expect(iteratee).toHaveBeenNthCalledWith(3, 0, 2, arr);
      expect(iteratee).toHaveBeenNthCalledWith(4, "", 3, arr);
      expect(result).toBe(arr);
    });

    test("handles NaN values", () => {
      const arr = [1, NaN, 3];
      const iteratee = vi.fn();

      const result = each(arr, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenNthCalledWith(1, 1, 0, arr);
      expect(iteratee).toHaveBeenNthCalledWith(2, NaN, 1, arr);
      expect(iteratee).toHaveBeenNthCalledWith(3, 3, 2, arr);
      expect(result).toBe(arr);
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0];
      const iteratee = vi.fn();

      const result = each(arr, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenNthCalledWith(1, +0, 0, arr);
      expect(iteratee).toHaveBeenNthCalledWith(2, 1, 1, arr);
      expect(iteratee).toHaveBeenNthCalledWith(3, -0, 2, arr);
      expect(result).toBe(arr);
    });

    test("handles array-like objects (not arrays)", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
      const iteratee = vi.fn();

      const result = each(arrayLike, iteratee);

      // Object.entries() includes all enumerable properties including 'length'
      expect(iteratee).toHaveBeenCalledTimes(4);
      expect(iteratee).toHaveBeenCalledWith("a", "0", arrayLike);
      expect(iteratee).toHaveBeenCalledWith("b", "1", arrayLike);
      expect(iteratee).toHaveBeenCalledWith("c", "2", arrayLike);
      expect(iteratee).toHaveBeenCalledWith(3, "length", arrayLike);
      expect(result).toBe(arrayLike);
    });
  });

  describe("Type safety", () => {
    test("preserves array type", () => {
      const numbers: number[] = [1, 2, 3];
      const iteratee = vi.fn();

      const result = each(numbers, iteratee);

      expect(result).toBe(numbers);
      expect(Array.isArray(result)).toBe(true);
    });

    test("preserves object type", () => {
      const obj: Record<string, number> = { a: 1, b: 2 };
      const iteratee = vi.fn();

      const result = each(obj, iteratee);

      expect(result).toBe(obj);
      expect(typeof result).toBe("object");
      expect(Array.isArray(result)).toBe(false);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native forEach", () => {
      const arr = [1, 2, 3];
      const iteratee1 = vi.fn();
      const iteratee2 = vi.fn();

      each(arr, iteratee1);
      arr.forEach(iteratee2);

      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });

    test("object behavior matches Object.entries().forEach()", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee1 = vi.fn();
      const iteratee2 = vi.fn();

      each(obj, iteratee1);
      Object.entries(obj).forEach(([key, value]) => iteratee2(value, key, obj));

      expect(iteratee1.mock.calls).toEqual(iteratee2.mock.calls);
    });
  });

  describe("Function behavior", () => {
    test("iteratee receives correct parameters for arrays", () => {
      const arr = ["a", "b", "c"];
      const iteratee = vi.fn();

      each(arr, iteratee);

      iteratee.mock.calls.forEach((call, index) => {
        expect(call[0]).toBe(arr[index]); // value
        expect(call[1]).toBe(index); // index
        expect(call[2]).toBe(arr); // array
      });
    });

    test("iteratee receives correct parameters for objects", () => {
      const obj = { x: 10, y: 20 };
      const iteratee = vi.fn();

      each(obj, iteratee);

      expect(iteratee).toHaveBeenCalledWith(10, "x", obj);
      expect(iteratee).toHaveBeenCalledWith(20, "y", obj);
    });

    test("handles iteratee that throws error", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value, index) => {
        if (index === 1) throw new Error("Test error");
      });

      expect(() => each(arr, iteratee)).toThrow("Test error");
    });

    test("handles iteratee that returns values (ignored)", () => {
      const arr = [1, 2, 3];
      const iteratee = vi.fn((value) => value * 2);

      const result = each(arr, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(result).toBe(arr);
      expect(arr).toEqual([1, 2, 3]); // Original array unchanged
    });
  });

  describe("Performance and large datasets", () => {
    test("handles very large arrays efficiently", () => {
      const large = Array.from({ length: 10000 }, (_, i) => i);
      const iteratee = vi.fn();

    });

    test("handles objects with many properties", () => {
      const largeObj: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`key${i}`] = i;
      }
      const iteratee = vi.fn();

      const result = each(largeObj, iteratee);

      expect(iteratee).toHaveBeenCalledTimes(1000);
      expect(result).toBe(largeObj);
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.array(fc.integer())])(
      "[🎲] returns original array reference",
      (arr) => {
        const result = each(arr, () => {});
        expect(result).toBe(arr);
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] iteratee called for each element",
      (arr) => {
        let count = 0;
        each(arr, () => { count++; });
        expect(count).toBe(arr.length);
      }
    );
  });
});
