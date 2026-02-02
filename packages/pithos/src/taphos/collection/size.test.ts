import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { size } from "./size";

describe("size", () => {
  describe("Array functionality", () => {
    test("returns correct length for regular array", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = size(numbers);

      expect(result).toBe(5);
    });

    test("returns 0 for empty array", () => {
      const emptyArray: number[] = [];

      const result = size(emptyArray);

      expect(result).toBe(0);
    });

    test("returns 1 for single element array", () => {
      const single = [42];

      const result = size(single);

      expect(result).toBe(1);
    });

    test("handles array with mixed types", () => {
      const mixed = [1, "hello", true, null, undefined];

      const result = size(mixed);

      expect(result).toBe(5);
    });

    test("handles array with duplicate values", () => {
      const duplicates = [1, 1, 1, 1, 1];

      const result = size(duplicates);

      expect(result).toBe(5);
    });

    test("handles large array", () => {
      const large = Array.from({ length: 1000 }, (_, i) => i);

      const result = size(large);

      expect(result).toBe(1000);
    });

    test("handles array with special values", () => {
      const special = [null, undefined, NaN, Infinity, -Infinity];

      const result = size(special);

      expect(result).toBe(5);
    });

    test("handles array with objects", () => {
      const objects = [{ a: 1 }, { b: 2 }, { c: 3 }];

      const result = size(objects);

      expect(result).toBe(3);
    });

    test("handles array with functions", () => {
      const functions = [() => 1, () => 2, () => 3];

      const result = size(functions);

      expect(result).toBe(3);
    });

    test("handles array with arrays", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      const result = size(arrays);

      expect(result).toBe(3);
    });
  });

  describe("Object functionality", () => {
    test("returns correct number of properties for regular object", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = size(obj);

      expect(result).toBe(3);
    });

    test("returns 0 for empty object", () => {
      const emptyObj = {};

      const result = size(emptyObj);

      expect(result).toBe(0);
    });

    test("returns 1 for single property object", () => {
      const single = { a: 42 };

      const result = size(single);

      expect(result).toBe(1);
    });

    test("handles object with mixed value types", () => {
      const mixed = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
        e: undefined,
      };

      const result = size(mixed);

      expect(result).toBe(5);
    });

    test("handles object with duplicate values", () => {
      const duplicates = { a: 1, b: 1, c: 1, d: 1, e: 1 };

      const result = size(duplicates);

      expect(result).toBe(5);
    });

    test("handles object with special values", () => {
      const special = {
        null: null,
        undefined: undefined,
        nan: NaN,
        infinity: Infinity,
        negInfinity: -Infinity,
      };

      const result = size(special);

      expect(result).toBe(5);
    });

    test("handles object with objects as values", () => {
      const objects = {
        a: { x: 1 },
        b: { y: 2 },
        c: { z: 3 },
      };

      const result = size(objects);

      expect(result).toBe(3);
    });

    test("handles object with functions as values", () => {
      const functions = {
        a: () => 1,
        b: () => 2,
        c: () => 3,
      };

      const result = size(functions);

      expect(result).toBe(3);
    });

    test("handles object with arrays as values", () => {
      const arrays = {
        a: [1, 2],
        b: [3, 4],
        c: [5, 6],
      };

      const result = size(arrays);

      expect(result).toBe(3);
    });

    test("handles object with numeric keys", () => {
      const numericKeys = { 1: "a", 2: "b", 3: "c" };

      const result = size(numericKeys);

      expect(result).toBe(3);
    });

    test("handles object with string keys", () => {
      const stringKeys = { "1": "a", "2": "b", "3": "c" };

      const result = size(stringKeys);

      expect(result).toBe(3);
    });
  });

  describe("Special values", () => {
    test("handles null values in array", () => {
      const withNull = [1, null, 3, null, 5];

      const result = size(withNull);

      expect(result).toBe(5);
    });

    test("handles undefined values in array", () => {
      const withUndefined = [1, undefined, 3, undefined, 5];

      const result = size(withUndefined);

      expect(result).toBe(5);
    });

    test("handles NaN values in array", () => {
      const withNaN = [1, NaN, 3, NaN, 5];

      const result = size(withNaN);

      expect(result).toBe(5);
    });

    test("handles +0 and -0 in array", () => {
      const withZeros = [+0, -0, 1, +0, -0];

      const result = size(withZeros);

      expect(result).toBe(5);
    });

    test("handles Infinity values in array", () => {
      const withInfinity = [1, Infinity, 3, -Infinity, 5];

      const result = size(withInfinity);

      expect(result).toBe(5);
    });

    test("handles empty strings in array", () => {
      const withEmpty = ["hello", "", "world", "", "hi"];

      const result = size(withEmpty);

      expect(result).toBe(5);
    });

    test("handles zero values in array", () => {
      const withZero = [1, 0, 3, 0, 5];

      const result = size(withZero);

      expect(result).toBe(5);
    });

    test("handles boolean values in array", () => {
      const withBooleans = [true, false, true, false];

      const result = size(withBooleans);

      expect(result).toBe(4);
    });
  });

  describe("Edge cases", () => {
    test("[🎯] handles very large numbers in array", () => {
      const largeNumbers = [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        0,
      ];

      const result = size(largeNumbers);

      expect(result).toBe(3);
    });

    test("handles very small numbers in array", () => {
      const smallNumbers = [Number.EPSILON, -Number.EPSILON, 0];

      const result = size(smallNumbers);

      expect(result).toBe(3);
    });

    test("handles mixed data types in object", () => {
      const obj = {
        a: 1,
        b: "hello",
        c: true,
        d: null,
        e: undefined,
        f: NaN,
        g: Infinity,
      };

      const result = size(obj);

      expect(result).toBe(7);
    });

    test("[🎯] handles sparse arrays", () => {
      const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };

      const result = size(arrayLike);

      expect(result).toBe(4); // length is also a property
    });

    test("handles objects with length property", () => {
      const objWithLength = { a: 1, b: 2, length: 3 };

      const result = size(objWithLength);

      expect(result).toBe(3); // length is also a property
    });

    test("handles objects with numeric string keys", () => {
      const obj = { "0": 1, "1": 2, "2": 3 };

      const result = size(obj);

      expect(result).toBe(3);
    });

    test("handles objects with mixed key types", () => {
      const obj = { a: 1, "1": 2, 2: 3 };

      const result = size(obj);

      expect(result).toBe(3);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const numbers: number[] = [1, 2, 3, 4, 5];

      const result = size(numbers);

      expect(result).toBe(5);
      expect(typeof result).toBe("number");
    });

    test("preserves object value type", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = size(obj);

      expect(result).toBe(3);
      expect(typeof result).toBe("number");
    });

    test("handles generic types", () => {
      const mixed: (string | number)[] = ["a", 1, "b", 2];

      const result = size(mixed);

      expect(result).toBe(4);
    });

    test("returns number type", () => {
      const numbers = [1, 2, 3];

      const result = size(numbers);

      expect(typeof result).toBe("number");
    });

    test("handles empty collections", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = size(emptyArray);
      const result2 = size(emptyObj);

      expect(result1).toBe(0);
      expect(result2).toBe(0);
      expect(typeof result1).toBe("number");
      expect(typeof result2).toBe("number");
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native length approach", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result1 = size(numbers);
      const result2 = numbers.length;

      expect(result1).toBe(result2);
      expect(result1).toBe(5);
    });

    test("object behavior matches Object.keys().length approach", () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result1 = size(obj);
      const result2 = Object.keys(obj).length;

      expect(result1).toBe(result2);
      expect(result1).toBe(3);
    });

    test("handles empty collections consistently", () => {
      const emptyArray: number[] = [];
      const emptyObj = {};

      const result1 = size(emptyArray);
      const result2 = emptyArray.length;
      const result3 = size(emptyObj);
      const result4 = Object.keys(emptyObj).length;

      expect(result1).toBe(result2);
      expect(result3).toBe(result4);
      expect(result1).toBe(0);
      expect(result3).toBe(0);
    });

    test("handles sparse arrays consistently", () => {
      const sparse = [1, , 3, , 5]; // eslint-disable-line no-sparse-arrays

      const result1 = size(sparse);
      const result2 = sparse.length;

      expect(result1).toBe(result2);
      expect(result1).toBe(5);
    });

    test("handles objects with length property consistently", () => {
      const obj = { a: 1, b: 2, length: 3 };

      const result1 = size(obj);
      const result2 = Object.keys(obj).length;

      expect(result1).toBe(result2);
      expect(result1).toBe(3);
    });

    itProp.prop([fc.array(fc.anything(), { maxLength: 100 })])(
      "[🎲] is equivalent to native Array.length",
      (arr) => {
        expect(size(arr)).toBe(arr.length);
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
      "[🎲] is equivalent to Object.keys().length for objects",
      (obj) => {
        expect(size(obj)).toBe(Object.keys(obj).length);
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];

      size(original);

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = { a: 1, b: 2, c: 3 };
      const originalCopy = { ...original };

      size(original);

      expect(original).toEqual(originalCopy);
    });

    test("returns number value", () => {
      const numbers = [1, 2, 3];

      const result = size(numbers);

      expect(typeof result).toBe("number");
    });

    test("handles non-enumerable properties", () => {
      const obj = { a: 1, b: 2 };
      Object.defineProperty(obj, "c", {
        value: 3,
        enumerable: false,
      });

      const result = size(obj);

      expect(result).toBe(2); // Only enumerable properties are counted
    });

    test("handles inherited properties", () => {
      const parent = { a: 1, b: 2 };
      const child = Object.create(parent);
      child.c = 3;

      const result = size(child);

      expect(result).toBe(1); // Only own properties are counted
    });
  });

  describe("Complex use cases", () => {
    test("counts user objects", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = size(users);

      expect(result).toBe(3);
    });

    test("counts product properties", () => {
      const product = {
        name: "Laptop",
        price: 999,
        stock: 5,
        category: "Electronics",
        brand: "TechCorp",
      };

      const result = size(product);

      expect(result).toBe(5);
    });

    test("counts configuration options", () => {
      const config = {
        apiUrl: "https://api.example.com",
        timeout: 5000,
        retries: 3,
        debug: true,
        version: "1.0.0",
        features: ["auth", "upload"],
      };

      const result = size(config);

      expect(result).toBe(6);
    });

    test("counts form fields", () => {
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        age: 25,
        country: "USA",
        newsletter: true,
        terms: true,
      };

      const result = size(formData);

      expect(result).toBe(7);
    });

    test("counts array of objects", () => {
      const items = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
        { id: 5, name: "Item 5" },
      ];

      const result = size(items);

      expect(result).toBe(5);
    });

    test("counts object with nested structures", () => {
      const data = {
        users: [{ name: "John" }, { name: "Jane" }],
        settings: { theme: "dark", language: "en" },
        metadata: { version: "1.0", build: "123" },
      };

      const result = size(data);

      expect(result).toBe(3); // Only top-level properties
    });

    test("counts mixed collection types", () => {
      const mixed = {
        numbers: [1, 2, 3],
        strings: ["a", "b", "c"],
        booleans: [true, false],
        objects: [{ a: 1 }, { b: 2 }],
      };

      const result = size(mixed);

      expect(result).toBe(4);
    });

    test("counts dynamic object properties", () => {
      const dynamic: Record<string, any> = {};
      for (let i = 0; i < 10; i++) {
        dynamic[`prop${i}`] = i;
      }

      const result = size(dynamic);

      expect(result).toBe(10);
    });

    test("counts array with mixed element types", () => {
      const mixed = [
        1,
        "hello",
        true,
        null,
        undefined,
        { a: 1 },
        [1, 2],
        () => 1,
      ];

      const result = size(mixed);

      expect(result).toBe(8);
    });

    test("counts object with computed property names", () => {
      const key = "dynamicKey";
      const obj = {
        [key]: "value",
        staticKey: "static",
        [`computed_${key}`]: "computed",
      };

      const result = size(obj);

      expect(result).toBe(3);
    });
  });
});
