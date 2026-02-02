import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { map } from "./map";

describe("map", () => {
  describe("Basic cases", () => {
    test("maps numbers to doubled values", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = map(numbers, (x) => x * 2);
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    test("maps numbers to strings", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = map(numbers, (x) => x.toString());
      expect(result).toEqual(["1", "2", "3", "4", "5"]);
    });

    test("maps strings to uppercase", () => {
      const words = ["hello", "world", "test"];
      const result = map(words, (word) => word.toUpperCase());
      expect(result).toEqual(["HELLO", "WORLD", "TEST"]);
    });
  });

  describe("Empty array", () => {
    test("returns empty array for empty input", () => {
      const arr: number[] = [];
      const result = map(arr, (x) => x * 2);
      expect(result).toEqual([]);
    });
  });

  describe("Index parameter", () => {
    test("uses index parameter", () => {
      const numbers = [10, 20, 30];
      const result = map(numbers, (value, index) => value + index);
      expect(result).toEqual([10, 21, 32]);
    });

    test("uses index for array creation", () => {
      const arr = ["a", "b", "c"];
      const result = map(arr, (value, index) => `${index}:${value}`);
      expect(result).toEqual(["0:a", "1:b", "2:c"]);
    });
  });

  describe("Array parameter", () => {
    test("uses array parameter", () => {
      const numbers = [1, 2, 3];
      const result = map(
        numbers,
        (value, index, array) => value + array.length
      );
      expect(result).toEqual([4, 5, 6]);
    });

    test("uses array parameter for conditional logic", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = map(numbers, (value, index, array) =>
        index === array.length - 1 ? "last" : value
      );
      expect(result).toEqual([1, 2, 3, 4, "last"]);
    });
  });

  describe("Different data types", () => {
    test("maps objects to properties", () => {
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ];
      const result = map(users, (user) => user.name);
      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    test("maps objects to new objects", () => {
      const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const result = map(users, (user) => ({
        userId: user.id,
        fullName: user.name.toUpperCase(),
      }));
      expect(result).toEqual([
        { userId: 1, fullName: "JOHN" },
        { userId: 2, fullName: "JANE" },
      ]);
    });

    test("maps mixed types", () => {
      const mixed = [1, "hello", true, null];
      const result = map(mixed, (item) => typeof item);
      expect(result).toEqual(["number", "string", "boolean", "object"]);
    });
  });

  describe("Edge cases", () => {
    test("handles null and undefined", () => {
      const arr = [1, null, 3, undefined];
      const result = map(arr, (item) => (item === null ? "null" : item));
      expect(result).toEqual([1, "null", 3, undefined]);
    });

    test("handles NaN", () => {
      const arr = [1, NaN, 3];
      const result = map(arr, (item) => (isNaN(item) ? "NaN" : item));
      expect(result).toEqual([1, "NaN", 3]);
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0];
      const result = map(arr, (item) => (item === 0 ? "zero" : item));
      expect(result).toEqual(["zero", 1, "zero"]);
    });
  });

  describe("Complex transformations", () => {
    test("nested object transformation", () => {
      const data = [
        { user: { id: 1, profile: { name: "John" } } },
        { user: { id: 2, profile: { name: "Jane" } } },
      ];
      const result = map(data, (item) => item.user.profile.name);
      expect(result).toEqual(["John", "Jane"]);
    });

    test("conditional mapping", () => {
      const numbers = [1, 2, 3, 4, 5];
      const result = map(numbers, (num) => (num % 2 === 0 ? "even" : "odd"));
      expect(result).toEqual(["odd", "even", "odd", "even", "odd"]);
    });

    test("array manipulation", () => {
      const words = ["hello", "world"];
      const result = map(words, (word) => word.split(""));
      expect(result).toEqual([
        ["h", "e", "l", "l", "o"],
        ["w", "o", "r", "l", "d"],
      ]);
    });
  });

  describe("Immutability", () => {
    test("does not modify original array", () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      map(arr, (x) => x * 2);
      expect(arr).toEqual(original);
    });

    test("returns new array instance", () => {
      const arr = [1, 2, 3];
      const result = map(arr, (x) => x * 2);
      expect(result).not.toBe(arr);
    });
  });

  describe("Consistency with examples", () => {
    test("matches documented examples", () => {
      const numbers = [1, 2, 3, 4, 5];

      // Examples from JSDoc
      const doubled = map(numbers, (x) => x * 2);
      expect(doubled).toEqual([2, 4, 6, 8, 10]);

      const strings = map(numbers, (x) => x.toString());
      expect(strings).toEqual(["1", "2", "3", "4", "5"]);
    });

    test("matches native Array.map behavior", () => {
      const arr = [1, 2, 3, 4, 5];

      // Our function
      const result1 = map(arr, (x) => x * 2);

      // Native approach
      const result2 = arr.map((x) => x * 2);

      expect(result1).toEqual(result2);
      expect(arr).toEqual([1, 2, 3, 4, 5]); // Both don't modify original
    });
  });

  describe("Large arrays", () => {
    test("handles large arrays", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);
      const result = map(large, (x) => x * 2);
      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(1998);
    });
  });

  describe("Sparse arrays", () => {
    test("handles sparse arrays", () => {
      const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays
      const result = map(arr, (item) => item);
      expect(result).toEqual([1, undefined, 3]);
    });
  });

  describe("Type safety", () => {
    test("preserves type information", () => {
      const numbers = [1, 2, 3];
      const result = map(numbers, (x) => x.toString());
      expect(result.every((item) => typeof item === "string")).toBe(true);

      const strings = ["1", "2", "3"];
      const result2 = map(strings, (x) => parseInt(x));
      expect(result2.every((item) => typeof item === "number")).toBe(true);
    });
  });

  describe("Function references", () => {
    test("works with function references", () => {
      const numbers = [1, 2, 3];
      const toString = (x: number) => x.toString();
      const result = map(numbers, toString);
      expect(result).toEqual(["1", "2", "3"]);
    });

    test("works with bound functions", () => {
      const numbers = [1, 2, 3];
      const multiplyByTwo = (x: number) => x * 2;
      const result = map(numbers, multiplyByTwo);
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe("Performance", () => {
    test("handles many transformations efficiently", () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      const result = map(arr, (x) => x * 2 + 1);
      expect(result[0]).toBe(1);
      expect(result[999]).toBe(1999);
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] equivalent to arr.map(fn)",
    (arr) => {
      const fn = (x: number) => x * 2;
      expect(map(arr, fn)).toEqual(arr.map(fn));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = [...arr];
      map(arr, (x) => x * 2);
      expect(arr).toEqual(copy);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length equals input length",
    (arr) => {
      expect(map(arr, (x) => x).length).toBe(arr.length);
    }
  );
});
