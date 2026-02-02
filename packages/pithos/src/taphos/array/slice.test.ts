import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { slice } from "./slice";

describe("slice", () => {
  describe("Basic cases", () => {
    test("slices array with start and end", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 1, 4);
      expect(result).toEqual([2, 3, 4]);
    });

    test("slices from beginning", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 0, 3);
      expect(result).toEqual([1, 2, 3]);
    });

    test("slices to end", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 2);
      expect(result).toEqual([3, 4, 5]);
    });

    test("slices entire array", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 0);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("No parameters", () => {
    test("returns copy of entire array when no parameters", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Empty arrays", () => {
    test("returns empty array for empty input", () => {
      const arr: number[] = [];
      const result = slice(arr, 0, 2);
      expect(result).toEqual([]);
    });

    test("returns empty array when start equals end", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 2, 2);
      expect(result).toEqual([]);
    });

    test("returns empty array when start is greater than end", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 4, 2);
      expect(result).toEqual([]);
    });
  });

  describe("Negative indices", () => {
    test("handles negative start index", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, -3);
      expect(result).toEqual([3, 4, 5]);
    });

    test("handles negative end index", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 1, -1);
      expect(result).toEqual([2, 3, 4]);
    });

    test("handles both negative indices", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, -4, -1);
      expect(result).toEqual([2, 3, 4]);
    });

    test("handles negative start beyond array length", () => {
      const arr = [1, 2, 3];
      const result = slice(arr, -10);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Out of bounds", () => {
    test("handles start beyond array length", () => {
      const arr = [1, 2, 3];
      const result = slice(arr, 10);
      expect(result).toEqual([]);
    });

    test("handles end beyond array length", () => {
      const arr = [1, 2, 3];
      const result = slice(arr, 1, 10);
      expect(result).toEqual([2, 3]);
    });

    test("handles both indices beyond array length", () => {
      const arr = [1, 2, 3];
      const result = slice(arr, 10, 15);
      expect(result).toEqual([]);
    });
  });

  describe("Different data types", () => {
    test("works with strings", () => {
      const arr = ["a", "b", "c", "d", "e"];
      const result = slice(arr, 1, 4);
      expect(result).toEqual(["b", "c", "d"]);
    });

    test("works with objects", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const obj4 = { id: 4 };
      const arr = [obj1, obj2, obj3, obj4];
      const result = slice(arr, 1, 3);
      expect(result).toEqual([obj2, obj3]);
    });

    test("works with mixed types", () => {
      const arr = [1, "hello", true, null, undefined];
      const result = slice(arr, 1, 4);
      expect(result).toEqual(["hello", true, null]);
    });
  });

  describe("Edge cases", () => {
    test("handles null and undefined", () => {
      const arr = [1, null, 3, undefined, 5];
      const result = slice(arr, 1, 4);
      expect(result).toEqual([null, 3, undefined]);
    });

    test("handles NaN", () => {
      const arr = [1, NaN, 3, NaN, 5];
      const result = slice(arr, 1, 4);
      expect(result).toEqual([NaN, 3, NaN]);
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0, 3];
      const result = slice(arr, 0, 3);
      expect(result).toEqual([+0, 1, -0]);
    });
  });

  describe("Immutability", () => {
    test("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      slice(arr, 1, 3);
      expect(arr).toEqual(original);
    });

    test("returns new array instance", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, 1, 3);
      expect(result).not.toBe(arr);
    });
  });

  describe("Consistency with examples", () => {
    test("matches documented example", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = slice(numbers, 1, 4);
      expect(result).toEqual([2, 3, 4]);
    });

    test("matches native Array.slice behavior", () => {
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5];

      // Our function
      const result1 = slice(arr1, 1, 4);

      // Native approach
      const result2 = arr2.slice(1, 4);

      expect(result1).toEqual(result2);
      expect(arr1).toEqual(arr2); // Both don't modify original
    });
  });

  describe("Large arrays", () => {
    test("handles large arrays", () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      const result = slice(arr, 100, 200);
      expect(result).toHaveLength(100);
      expect(result[0]).toBe(100);
      expect(result[99]).toBe(199);
    });
  });

  describe("Sparse arrays", () => {
    test("handles sparse arrays", () => {
      const arr = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays
      const result = slice(arr, 1, 4);
      expect(result).toEqual([undefined, 3, undefined]);
    });
  });

  describe("Special cases", () => {
    test("handles single element array", () => {
      const arr = [42];
      const result = slice(arr, 0, 1);
      expect(result).toEqual([42]);
    });

    test("handles zero indices", () => {
      const arr = [1, 2, 3];
      const result = slice(arr, 0, 0);
      expect(result).toEqual([]);
    });

    test("handles undefined parameters", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = slice(arr, undefined, undefined);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  itProp.prop([
    fc.array(fc.integer()),
    fc.integer({ min: -50, max: 50 }),
    fc.integer({ min: -50, max: 50 }),
  ])("[🎲] equivalent to arr.slice(start, end)", (arr, start, end) => {
    expect(slice(arr, start, end)).toEqual(arr.slice(start, end));
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = [...arr];
      slice(arr, 1, 3);
      expect(arr).toEqual(copy);
    }
  );
});
