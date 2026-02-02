import { describe, test, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { reduce } from "./reduce";

describe("reduce", () => {
  describe("Array functionality", () => {
    test("reduces array from left to right with accumulator", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => acc + num, 0);

      expect(result).toBe(15);
    });

    test("reduces array from left to right without accumulator", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => acc + num);

      expect(result).toBe(15);
    });

    test("reduces array from left to right with string concatenation", () => {
      const strings = ["a", "b", "c", "d"];

      const result = reduce(strings, (acc, str) => acc + str, "");

      expect(result).toBe("abcd");
    });

    test("reduces array from left to right with array building", () => {
      const numbers = [1, 2, 3, 4];

      const result = reduce(
        numbers,
        (acc, num) => [...acc, num],
        [] as number[]
      );

      expect(result).toEqual([1, 2, 3, 4]);
    });

    test("handles empty array with accumulator", () => {
      const emptyArray: number[] = [];

      const result = reduce(emptyArray, (acc, num) => acc + num, 0);

      expect(result).toBe(0);
    });

    test("handles empty array without accumulator", () => {
      const emptyArray: number[] = [];

      expect(() => {
        reduce(emptyArray, (acc, num) => acc + num);
      }).toThrow();
    });

    test("handles single element array with accumulator", () => {
      const single = [42];

      const result = reduce(single, (acc, num) => acc + num, 0);

      expect(result).toBe(42);
    });

    test("handles single element array without accumulator", () => {
      const single = [42];

      const result = reduce(single, (acc, num) => acc + num);

      expect(result).toBe(42);
    });

    test("handles array with mixed types", () => {
      const mixed = [1, "hello", 3, "world"];

      const result = reduce(mixed, (acc, item) => acc + String(item), "");

      expect(result).toBe("1hello3world");
    });

    test("handles array with objects", () => {
      const objects = [{ value: 1 }, { value: 2 }, { value: 3 }];

      const result = reduce(objects, (acc, obj) => acc + obj.value, 0);

      expect(result).toBe(6);
    });

    test("handles array with functions", () => {
      const functions = [() => 1, () => 2, () => 3];

      const result = reduce(functions, (acc, fn) => acc + fn(), 0);

      expect(result).toBe(6);
    });

    test("handles array with arrays", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      const result = reduce(
        arrays,
        (acc: number[], arr: number[]) => acc.concat(arr),
        []
      );

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("Object functionality", () => {
    test("reduces object from left to right with accumulator", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reduce(obj, (acc, value, key) => acc + value, 0);

      expect(result).toBe(6);
    });

    test("reduces object from left to right without accumulator", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reduce(
        obj as any,
        (acc: any, value: any, key: any) => acc + value
      );

      expect(result).toBe(6);
    });

    test("reduces object from left to right with string concatenation", () => {
      const obj = { a: "x", b: "y", c: "z" };

      const result = reduce(obj, (acc, value, key) => acc + value, "");

      expect(result).toBe("xyz");
    });

    test("reduces object from left to right with array building", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reduce(
        obj as Record<string, number>,
        (acc, value, key) => [...acc, value],
        [] as number[]
      );

      expect(result).toEqual([1, 2, 3]);
    });

    test("handles empty object with accumulator", () => {
      const emptyObj = {};

      const result = reduce(emptyObj, (acc, value, key) => acc + value, 0);

      expect(result).toBe(0);
    });

    test("handles empty object without accumulator", () => {
      const emptyObj = {};

      const result = reduce(
        emptyObj as any,
        (acc: any, value: any, key: any) => acc + value
      );

      expect(result).toBeUndefined();
    });

    test("handles single property object with accumulator", () => {
      const single = { a: 42 };

      const result = reduce(single, (acc, value, key) => acc + value, 0);

      expect(result).toBe(42);
    });

    test("handles single property object without accumulator", () => {
      const single = { a: 42 };

      const result = reduce(
        single as any,
        (acc: any, value: any, key: any) => acc + value
      );

      expect(result).toBe(42);
    });

    test("handles object with mixed value types", () => {
      const mixed = { a: 1, b: "hello", c: 3, d: "world" };

      const result = reduce(
        mixed,
        (acc, value, key) => acc + String(value),
        ""
      );

      expect(result).toBe("1hello3world");
    });

    test("handles object with objects as values", () => {
      const objects = {
        a: { value: 1 },
        b: { value: 2 },
        c: { value: 3 },
      };

      const result = reduce(objects, (acc, obj, key) => acc + obj.value, 0);

      expect(result).toBe(6);
    });

    test("handles object with functions as values", () => {
      const functions = {
        a: () => 1,
        b: () => 2,
        c: () => 3,
      };

      const result = reduce(functions, (acc, fn, key) => acc + fn(), 0);

      expect(result).toBe(6);
    });

    test("handles object with arrays as values", () => {
      const arrays = {
        a: [1, 2],
        b: [3, 4],
        c: [5, 6],
      };

      const result = reduce(
        arrays,
        (acc: number[], arr: number[], key: string) => acc.concat(arr),
        []
      );

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("Special values", () => {
    test("handles null values in array", () => {
      const withNull = [1, null, 3, null, 5];

      const result = reduce(withNull, (acc, num) => acc + (num ?? 0), 0);

      expect(result).toBe(9);
    });

    test("handles undefined values in array", () => {
      const withUndefined = [1, undefined, 3, undefined, 5];

      const result = reduce(withUndefined, (acc, num) => acc + (num ?? 0), 0);

      expect(result).toBe(9);
    });

    test("handles NaN values in array", () => {
      const withNaN = [1, NaN, 3, NaN, 5];

      const result = reduce(
        withNaN,
        (acc, num) => acc + (isNaN(num) ? 0 : num),
        0
      );

      expect(result).toBe(9);
    });

    test("handles +0 and -0 in array", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = reduce(withZeros, (acc, num) => acc + num, 0);

      expect(result).toBe(1);
    });

    test("handles Infinity values in array", () => {
      const withInfinity = [1, Infinity, 3, -Infinity, 5];

      const result = reduce(withInfinity, (acc, num) => acc + num, 0);

      expect(result).toBeNaN(); // Infinity + -Infinity = NaN
    });

    test("handles empty strings in array", () => {
      const withEmpty = ["hello", "", "world", "", "hi"];

      const result = reduce(withEmpty, (acc, str) => acc + str, "");

      expect(result).toBe("helloworldhi");
    });

    test("handles zero values in array", () => {
      const withZero = [1, 0, 3, 0, 5];

      const result = reduce(withZero, (acc, num) => acc + num, 0);

      expect(result).toBe(9);
    });

    test("handles boolean values in array", () => {
      const withBooleans = [true, false, true, false];

      const result = reduce(withBooleans, (acc, b) => acc + (b ? 1 : 0), 0);

      expect(result).toBe(2);
    });
  });

  describe("Complex operations", () => {
    test("reduces array to find maximum value", () => {
      const numbers = [1, 5, 3, 9, 2];

      const result = reduce(numbers, (acc, num) => Math.max(acc, num));

      expect(result).toBe(9);
    });

    test("reduces array to find minimum value", () => {
      const numbers = [1, 5, 3, 9, 2];

      const result = reduce(numbers, (acc, num) => Math.min(acc, num));

      expect(result).toBe(1);
    });

    test("reduces array to count elements", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => acc + 1, 0);

      expect(result).toBe(5);
    });

    test("reduces array to build object", () => {
      const pairs: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];

      const result = reduce(
        pairs,
        (acc: Record<string, number>, [key, value]: [string, number]) => {
          acc[key] = value;
          return acc;
        },
        {}
      );

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    test("reduces object to find maximum value", () => {
      const obj = { a: 1, b: 5, c: 3, d: 9, e: 2 };

      const result = reduce(obj as any, (acc: any, value: any) =>
        Math.max(acc, value)
      );

      expect(result).toBe(9);
    });

    test("reduces object to find minimum value", () => {
      const obj = { a: 1, b: 5, c: 3, d: 9, e: 2 };

      const result = reduce(obj as any, (acc: any, value: any, key: any) =>
        Math.min(acc, value)
      );

      expect(result).toBe(1);
    });

    test("reduces object to count properties", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };

      const result = reduce(obj, (acc, value, key) => acc + 1, 0);

      expect(result).toBe(5);
    });

    test("reduces object to build array", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reduce(
        obj as Record<string, number>,
        (acc, value, key) => [...acc, value],
        [] as number[]
      );

      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
      ];

      const result = reduce(largeNumbers, (acc, num) => acc + num, 0);

      expect(result).toBe(Number.MAX_SAFE_INTEGER + Number.MIN_SAFE_INTEGER);
    });

    test("handles very small numbers", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, 0];

      const result = reduce(smallNumbers, (acc, num) => acc + num, 0);

      expect(result).toBe(0);
    });

    test("handles mixed data types in object", () => {
      const obj = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
        e: undefined,
      };

      const result = reduce(obj, (acc, value, key) => acc + String(value), "");

      expect(result).toBe("1hellotruenullundefined");
    });

    test("[🎯] handles sparse arrays", () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };

      const result = reduce(arrayLike, (acc, value, key) => acc + value, 0);

      expect(result).toBe(9); // 1 + 2 + 3 + 3 (length)
    });

    test("handles objects with numeric keys", () => {
      const obj = { 1: "a", 2: "b", 3: "c" };

      const result = reduce(obj, (acc, value, key) => acc + value, "");

      expect(result).toBe("abc");
    });

    test("handles objects with string keys", () => {
      const obj = { "1": "a", "2": "b", "3": "c" };

      const result = reduce(obj, (acc, value, key) => acc + value, "");

      expect(result).toBe("abc");
    });

    test("handles objects with mixed key types", () => {
      const obj = { a: 1, "1": 2, 2: 3 };

      const result = reduce(obj, (acc, value, key) => acc + value, 0);

      expect(result).toBe(6);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => acc + num, 0);

      expect(result).toBe(15);
      expect(typeof result).toBe("number");
    });

    test("preserves object value type", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = reduce(obj, (acc, value, key) => acc + value, 0);

      expect(result).toBe(6);
      expect(typeof result).toBe("number");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 2];

      const result = reduce(mixed, (acc, item) => acc + String(item), "");

      expect(result).toBe("a1b2");
    });

    test("returns correct type for empty collections", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = reduce(emptyArray, (acc, num) => acc + num, 0);
      const result2 = reduce(emptyObj, (acc, value, key) => acc + value, 0);

      expect(result1).toBe(0);
      expect(result2).toBe(0);
      expect(typeof result1).toBe("number");
      expect(typeof result2).toBe("number");
    });

    test("handles union types", () => {
      const union: (string | number | boolean)[] = ["hello", 42, true];

      const result = reduce(union, (acc, item) => acc + String(item), "");

      expect(result).toBe("hello42true");
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native reduce approach", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result1 = reduce(numbers, (acc, num) => acc + num, 0);
      const result2 = numbers.reduce((acc, num) => acc + num, 0);

      expect(result1).toBe(result2);
      expect(result1).toBe(15);
    });

    test("object behavior matches Object.values().reduce() approach", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result1 = reduce(obj, (acc, value, key) => acc + value, 0);
      const result2 = Object.values(obj).reduce((acc, value) => acc + value, 0);

      expect(result1).toBe(result2);
      expect(result1).toBe(6);
    });

    test("handles empty collections consistently", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = reduce(emptyArray, (acc, num) => acc + num, 0);
      const result2 = emptyArray.reduce((acc, num) => acc + num, 0);
      const result3 = reduce(emptyObj, (acc, value, key) => acc + value, 0);
      const result4 = Object.values(emptyObj).reduce(
        (acc: number, value: unknown) => acc + (value as number),
        0
      );

      expect(result1).toBe(result2);
      expect(result3).toBe(result4);
      expect(result1).toBe(0);
      expect(result3).toBe(0);
    });

    test("handles string concatenation consistently", () => {
      const strings = ["a", "b", "c", "d"];

      const result1 = reduce(strings, (acc, str) => acc + str, "");
      const result2 = strings.reduce((acc, str) => acc + str, "");

      expect(result1).toBe(result2);
      expect(result1).toBe("abcd");
    });

    itProp.prop([fc.array(fc.integer({ min: -1000, max: 1000 }), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.reduce for sum",
      (arr) => {
        const result1 = reduce(arr, (acc, n) => acc + n, 0);
        const result2 = arr.reduce((acc, n) => acc + n, 0);
        expect(result1).toBe(result2);
      }
    );

    itProp.prop([fc.array(fc.string({ maxLength: 10 }), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.reduce for string concatenation",
      (arr) => {
        const result1 = reduce(arr, (acc, s) => acc + s, "");
        const result2 = arr.reduce((acc, s) => acc + s, "");
        expect(result1).toBe(result2);
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];

      reduce(original, (acc, num) => acc + num, 0);

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = { a: 1, b: 2, c: 3 };
      const originalCopy = { ...original };

      reduce(original, (acc, value, key) => acc + value, 0);

      expect(original).toEqual(originalCopy);
    });

    test("returns accumulated value", () => {
      const numbers = [1, 2, 3];

      const result = reduce(numbers, (acc, num) => acc + num, 0);

      expect(result).toBe(6);
    });

    test("handles iteratee that throws error", () => {
      const numbers = [1, 2, 3];

      expect(() => {
        reduce(
          numbers,
          () => {
            throw new Error("Test error");
          },
          0
        );
      }).toThrow("Test error");
    });
  });

  describe("Iteratee function behavior", () => {
    test("calls iteratee with correct parameters for arrays", () => {
      const numbers = [1, 2, 3];
      const iteratee = vi.fn((acc, value, index, array) => acc + value);

      reduce(numbers, iteratee, 0);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(0, 1, 0, numbers);
      expect(iteratee).toHaveBeenCalledWith(1, 2, 1, numbers);
      expect(iteratee).toHaveBeenCalledWith(3, 3, 2, numbers);
    });

    test("calls iteratee with correct parameters for objects", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const iteratee = vi.fn((acc, value, key, object) => acc + value);

      reduce(obj, iteratee, 0);

      expect(iteratee).toHaveBeenCalledTimes(3);
      expect(iteratee).toHaveBeenCalledWith(0, 1, "a", obj);
      expect(iteratee).toHaveBeenCalledWith(1, 2, "b", obj);
      expect(iteratee).toHaveBeenCalledWith(3, 3, "c", obj);
    });

    test("handles iteratee that returns different types", () => {
      const numbers = [1, 2, 3];

      const result = reduce(numbers, (acc, num) => acc + String(num), "");

      expect(result).toBe("123");
    });

    test("handles iteratee that returns same type", () => {
      const numbers = [1, 2, 3];

      const result = reduce(numbers, (acc, num) => acc + num, 0);

      expect(result).toBe(6);
    });
  });

  describe("Complex use cases", () => {
    test("reduces array to calculate factorial", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => acc * num, 1);

      expect(result).toBe(120);
    });

    test("reduces array to build nested object", () => {
      const pairs = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];

      const result = reduce(
        pairs,
        (acc: any, [key, value]: any) => {
          acc[key] = { value, nested: acc };
          return acc;
        },
        {}
      );

      expect(result).toHaveProperty("a");
      expect(
        (result as Record<string, { value: number; nested: unknown }>).a.value
      ).toBe(1);
    });

    test("reduces object to calculate weighted sum", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const weights = { a: 0.5, b: 1.0, c: 1.5 };

      const result = reduce(
        obj,
        (acc, value, key) => {
          return acc + value * weights[key];
        },
        0
      );

      expect(result).toBe(7);
    });

    test("reduces array to find longest string", () => {
      const strings = ["hello", "world", "hi", "there"];

      const result = reduce(strings, (acc, str) => {
        return str.length > acc.length ? str : acc;
      });

      expect(result).toBe("hello"); // reduce processes from left to right
    });

    test("reduces object to build query string", () => {
      const params = { page: 1, limit: 10, sort: "name" };

      const result = reduce(
        params,
        (acc, value, key) => {
          return acc + `${key}=${value}&`;
        },
        ""
      );

      expect(result).toBe("page=1&limit=10&sort=name&");
    });

    test("reduces array to flatten nested arrays", () => {
      const nested = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      const result = reduce(
        nested,
        (acc: number[], arr: number[]) => {
          return acc.concat(arr);
        },
        []
      );

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test("reduces object to group by type", () => {
      const mixed = { a: 1, b: "hello", c: 3, d: "world" };

      const result = reduce(
        mixed,
        (acc: Record<string, unknown[]>, value: unknown, key: string) => {
          const type = typeof value;
          if (!acc[type]) acc[type] = [];
          acc[type].push(value);
          return acc;
        },
        {}
      );

      expect(result).toEqual({
        number: [1, 3],
        string: ["hello", "world"],
      });
    });

    test("reduces array to calculate running average", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(
        numbers,
        (acc, num) => {
          return { sum: acc.sum + num, count: acc.count + 1 };
        },
        { sum: 0, count: 0 }
      );

      expect(result).toEqual({ sum: 15, count: 5 });
    });

    test("reduces object to build hierarchical structure", () => {
      const flat = { "a.b": 1, "a.c": 2, "b.d": 3 };

      const result = reduce(
        flat,
        (acc: Record<string, unknown>, value: number, key: string) => {
          const parts = key.split(".");
          let current: Record<string, unknown> = acc;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]] as Record<string, unknown>;
          }
          current[parts[parts.length - 1]] = value;
          return acc;
        },
        {}
      );

      expect(result).toEqual({
        a: { b: 1, c: 2 },
        b: { d: 3 },
      });
    });

    test("reduces array to implement custom reduce logic", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = reduce(numbers, (acc, num) => {
        return acc > num ? acc : num;
      });

      expect(result).toBe(5);
    });
  });
});
