import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pluck } from "./pluck";

describe("pluck", () => {
  describe("Array functionality", () => {
    test("plucks property from array of objects", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(users, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    test("plucks property from array of objects with different types", () => {
      const items = [
        { id: 1, name: "Item 1", active: true },
        { id: 2, name: "Item 2", active: false },
        { id: 3, name: "Item 3", active: true },
      ];

      const result = pluck(items, "id");

      expect(result).toEqual([1, 2, 3]);
    });

    test("plucks property from array of objects with nested properties", () => {
      const users = [
        { user: { name: "John", age: 25 } },
        { user: { name: "Jane", age: 30 } },
        { user: { name: "Bob", age: 20 } },
      ];

      const result = pluck(users, "user");

      expect(result).toEqual([
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ]);
    });

    test("plucks property from array of objects with mixed types", () => {
      const mixed = [
        { value: "hello", count: 5 },
        { value: 42, count: "many" },
        { value: true, count: null },
      ];

      const result = pluck(mixed, "value");

      expect(result).toEqual(["hello", 42, true]);
    });

    test("plucks property from array of objects with functions", () => {
      const functions = [
        { name: "add", fn: (a: number, b: number) => a + b },
        { name: "multiply", fn: (a: number, b: number) => a * b },
        { name: "subtract", fn: (a: number, b: number) => a - b },
      ];

      const result = pluck(functions, "name");

      expect(result).toEqual(["add", "multiply", "subtract"]);
    });

    test("plucks property from array of objects with arrays", () => {
      const items = [
        { id: 1, tags: ["tag1", "tag2"] },
        { id: 2, tags: ["tag3"] },
        { id: 3, tags: ["tag4", "tag5", "tag6"] },
      ];

      const result = pluck(items, "tags");

      expect(result).toEqual([
        ["tag1", "tag2"],
        ["tag3"],
        ["tag4", "tag5", "tag6"],
      ]);
    });

    test("plucks property from array of objects with null values", () => {
      const items = [
        { name: "John", age: 25 },
        { name: null, age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(items, "name");

      expect(result).toEqual(["John", null, "Bob"]);
    });

    test("plucks property from array of objects with undefined values", () => {
      const items = [
        { name: "John", age: 25 },
        { name: undefined, age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(items, "name");

      expect(result).toEqual(["John", undefined, "Bob"]);
    });

    test("plucks property from array of objects with missing properties", () => {
      const items: Array<{ name?: string; age: number }> = [
        { name: "John", age: 25 },
        { age: 30 }, // missing name
        { name: "Bob", age: 20 },
      ];

      const result = pluck(items, "name");

      expect(result).toEqual(["John", undefined, "Bob"]);
    });

    test("plucks property from array of objects with all missing properties", () => {
      const items: Array<{ name?: string; age: number }> = [
        { age: 25 },
        { age: 30 },
        { age: 20 }
      ];

      const result = pluck(items, "name");

      expect(result).toEqual([undefined, undefined, undefined]);
    });

    test("plucks property from empty array", () => {
      const empty: any[] = [];

      const result = pluck(empty, "name");

      expect(result).toEqual([]);
    });

    test("plucks property from array with single element", () => {
      const single = [{ name: "John", age: 25 }];

      const result = pluck(single, "name");

      expect(result).toEqual(["John"]);
    });

    test("plucks property from array of primitives", () => {
      const primitives = ["hello", "world", "test"];

      const result = pluck(primitives, "length");

      expect(result).toEqual([5, 5, 4]);
    });

    test("plucks property from array of numbers", () => {
      const numbers = [1, 2, 3, 4, 5];

      const result = pluck(numbers, "toString");

      expect(result).toEqual([
        numbers[0].toString,
        numbers[1].toString,
        numbers[2].toString,
        numbers[3].toString,
        numbers[4].toString,
      ]);
    });

    test("plucks property from array of booleans", () => {
      const booleans = [true, false, true];

      const result = pluck(booleans, "valueOf");

      expect(result).toEqual([
        booleans[0].valueOf,
        booleans[1].valueOf,
        booleans[2].valueOf,
      ]);
    });
  });

  describe("Object functionality", () => {
    test("plucks property from object values", () => {
      const obj = {
        a: { name: "John", age: 25 },
        b: { name: "Jane", age: 30 },
        c: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    test("plucks property from object values with different types", () => {
      const obj = {
        a: { id: 1, name: "Item 1", active: true },
        b: { id: 2, name: "Item 2", active: false },
        c: { id: 3, name: "Item 3", active: true },
      };

      const result = pluck(obj, "id");

      expect(result).toEqual([1, 2, 3]);
    });

    test("plucks property from object values with nested properties", () => {
      const obj = {
        a: { user: { name: "John", age: 25 } },
        b: { user: { name: "Jane", age: 30 } },
        c: { user: { name: "Bob", age: 20 } },
      };

      const result = pluck(obj, "user");

      expect(result).toEqual([
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ]);
    });

    test("plucks property from object values with mixed types", () => {
      const obj = {
        a: { value: "hello", count: 5 },
        b: { value: 42, count: "many" },
        c: { value: true, count: null },
      };

      const result = pluck(obj, "value");

      expect(result).toEqual(["hello", 42, true]);
    });

    test("plucks property from object values with functions", () => {
      const obj = {
        a: { name: "add", fn: (a: number, b: number) => a + b },
        b: { name: "multiply", fn: (a: number, b: number) => a * b },
        c: { name: "subtract", fn: (a: number, b: number) => a - b },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["add", "multiply", "subtract"]);
    });

    test("plucks property from object values with arrays", () => {
      const obj = {
        a: { id: 1, tags: ["tag1", "tag2"] },
        b: { id: 2, tags: ["tag3"] },
        c: { id: 3, tags: ["tag4", "tag5", "tag6"] },
      };

      const result = pluck(obj, "tags");

      expect(result).toEqual([
        ["tag1", "tag2"],
        ["tag3"],
        ["tag4", "tag5", "tag6"],
      ]);
    });

    test("plucks property from object values with null values", () => {
      const obj = {
        a: { name: "John", age: 25 },
        b: { name: null, age: 30 },
        c: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", null, "Bob"]);
    });

    test("plucks property from object values with undefined values", () => {
      const obj = {
        a: { name: "John", age: 25 },
        b: { name: undefined, age: 30 },
        c: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", undefined, "Bob"]);
    });

    test("plucks property from object values with missing properties", () => {
      const obj: Record<string, { name?: string; age: number }> = {
        a: { name: "John", age: 25 },
        b: { age: 30 }, // missing name
        c: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", undefined, "Bob"]);
    });

    test("plucks property from object values with all missing properties", () => {
      const obj: Record<string, { name?: string; age: number }> = {
        a: { age: 25 },
        b: { age: 30 },
        c: { age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual([undefined, undefined, undefined]);
    });

    test("plucks property from empty object", () => {
      const empty: Record<string, { name: string }> = {};

      const result = pluck(empty, "name");

      expect(result).toEqual([]);
    });

    test("plucks property from object with single property", () => {
      const single = { a: { name: "John", age: 25 } };

      const result = pluck(single, "name");

      expect(result).toEqual(["John"]);
    });

    test("plucks property from object with numeric keys", () => {
      const obj = {
        1: { name: "John", age: 25 },
        2: { name: "Jane", age: 30 },
        3: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    test("plucks property from object with string keys", () => {
      const obj = {
        "1": { name: "John", age: 25 },
        "2": { name: "Jane", age: 30 },
        "3": { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });

    test("plucks property from object with mixed key types", () => {
      const obj = {
        a: { name: "John", age: 25 },
        "1": { name: "Jane", age: 30 },
        2: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toHaveLength(3);
      expect(result).toContain("John");
      expect(result).toContain("Jane");
      expect(result).toContain("Bob");
    });
  });

  describe("Special values", () => {
    test("plucks property from array with NaN values", () => {
      const items = [
        { value: NaN, name: "item1" },
        { value: 42, name: "item2" },
        { value: NaN, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([NaN, 42, NaN]);
    });

    test("plucks property from array with Infinity values", () => {
      const items = [
        { value: Infinity, name: "item1" },
        { value: 42, name: "item2" },
        { value: -Infinity, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([Infinity, 42, -Infinity]);
    });

    test("plucks property from array with +0 and -0 values", () => {
      const items = [
        { value: +0, name: "item1" },
        { value: -0, name: "item2" },
        { value: 42, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([+0, -0, 42]);
    });

    test("plucks property from array with empty strings", () => {
      const items = [
        { value: "", name: "item1" },
        { value: "hello", name: "item2" },
        { value: "", name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual(["", "hello", ""]);
    });

    test("plucks property from array with zero values", () => {
      const items = [
        { value: 0, name: "item1" },
        { value: 42, name: "item2" },
        { value: 0, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([0, 42, 0]);
    });

    test("plucks property from array with boolean values", () => {
      const items = [
        { value: true, name: "item1" },
        { value: false, name: "item2" },
        { value: true, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([true, false, true]);
    });
  });

  describe("Edge cases", () => {
    test("plucks property from array with very large numbers", () => {
      const items = [
        { value: Number.MAX_SAFE_INTEGER, name: "item1" },
        { value: Number.MIN_SAFE_INTEGER, name: "item2" },
        { value: 42, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        42,
      ]);
    });

    test("plucks property from array with very small numbers", () => {
      const items = [
        { value: Number.EPSILON, name: "item1" },
        { value: -Number.EPSILON, name: "item2" },
        { value: 42, name: "item3" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual([Number.EPSILON, -Number.EPSILON, 42]);
    });

    test("plucks property from array with mixed data types", () => {
      const items = [
        { value: "hello", name: "item1" },
        { value: 42, name: "item2" },
        { value: true, name: "item3" },
        { value: null, name: "item4" },
        { value: undefined, name: "item5" },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual(["hello", 42, true, null, undefined]);
    });

    test("plucks property from array with nested objects", () => {
      const items = [
        { nested: { deep: { value: "hello" } } },
        { nested: { deep: { value: "world" } } },
        { nested: { deep: { value: "test" } } },
      ];

      const result = pluck(items, "nested");

      expect(result).toEqual([
        { deep: { value: "hello" } },
        { deep: { value: "world" } },
        { deep: { value: "test" } },
      ]);
    });

    test("plucks property from array with circular references", () => {
      const circular: any = { name: "circular" };
      circular.self = circular;

      const items = [
        { name: "normal", value: 42 },
        circular,
        { name: "another", value: 24 },
      ];

      const result = pluck(items, "name");

      expect(result).toEqual(["normal", "circular", "another"]);
    });

    test("plucks property from array with functions as values", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      const fn3 = () => 3;

      const items = [
        { name: "fn1", fn: fn1 },
        { name: "fn2", fn: fn2 },
        { name: "fn3", fn: fn3 },
      ];

      const result = pluck(items, "fn");

      expect(result).toEqual([fn1, fn2, fn3]);
    });

    test("plucks property from array with arrays as values", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const arr3 = [7, 8, 9];

      const items = [
        { name: "arr1", data: arr1 },
        { name: "arr2", data: arr2 },
        { name: "arr3", data: arr3 },
      ];

      const result = pluck(items, "data");

      expect(result).toEqual([arr1, arr2, arr3]);
    });

    test("plucks property from array with objects as values", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const obj3 = { e: 5, f: 6 };

      const items = [
        { name: "obj1", data: obj1 },
        { name: "obj2", data: obj2 },
        { name: "obj3", data: obj3 },
      ];

      const result = pluck(items, "data");

      expect(result).toEqual([obj1, obj2, obj3]);
    });
  });

  describe("Type safety", () => {
    test("preserves array element type", () => {
      const users: Array<{ name: string; age: number }> = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(users, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
      expect(result.every((name) => typeof name === "string")).toBe(true);
    });

    test("preserves object value type", () => {
      const obj: Record<string, { name: string; age: number }> = {
        a: { name: "John", age: 25 },
        b: { name: "Jane", age: 30 },
        c: { name: "Bob", age: 20 },
      };

      const result = pluck(obj, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
      expect(result.every((name) => typeof name === "string")).toBe(true);
    });

    test("handles generic types", () => {
      const items: Array<{ id: number; name: string }> = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ];

      const result = pluck(items, "id");

      expect(result).toEqual([1, 2, 3]);
      expect(result.every((id) => typeof id === "number")).toBe(true);
    });

    test("handles union types", () => {
      const items: Array<{ value: string | number | boolean }> = [
        { value: "hello" },
        { value: 42 },
        { value: true },
      ];

      const result = pluck(items, "value");

      expect(result).toEqual(["hello", 42, true]);
    });

    test("handles optional properties", () => {
      const items: Array<{ name: string; age?: number }> = [
        { name: "John", age: 25 },
        { name: "Jane" }, // age is optional
        { name: "Bob", age: 20 },
      ];

      const result = pluck(items, "age");

      expect(result).toEqual([25, undefined, 20]);
    });
  });

  describe("Consistency with native methods", () => {
    test("array behavior matches native map approach", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result1 = pluck(users, "name");
      const result2 = users.map((user) => user.name);

      expect(result1).toEqual(result2);
      expect(result1).toEqual(["John", "Jane", "Bob"]);
    });

    test("object behavior matches Object.values().map() approach", () => {
      const obj = {
        a: { name: "John", age: 25 },
        b: { name: "Jane", age: 30 },
        c: { name: "Bob", age: 20 },
      };

      const result1 = pluck(obj, "name");
      const result2 = Object.values(obj).map((item) => item.name);

      expect(result1).toEqual(result2);
      expect(result1).toEqual(["John", "Jane", "Bob"]);
    });

    test("handles empty collections consistently", () => {
      const emptyArray: any[] = [];
      const emptyObj: Record<string, { name: string }> = {};

      const result1 = pluck(emptyArray, "name");
      const result2 = emptyArray.map((item) => item.name);
      const result3 = pluck(emptyObj, "name");
      const result4 = Object.values(emptyObj).map((item: any) => item.name);

      expect(result1).toEqual(result2);
      expect(result3).toEqual(result4);
      expect(result1).toEqual([]);
      expect(result3).toEqual([]);
    });

    test("handles missing properties consistently", () => {
      const items = [
        { name: "John", age: 25 },
        { age: 30 }, // missing name
        { name: "Bob", age: 20 },
      ];

      const result1 = pluck(items, "name");
      const result2 = items.map((item) => item.name);

      expect(result1).toEqual(result2);
      expect(result1).toEqual(["John", undefined, "Bob"]);
    });

    itProp.prop([fc.array(fc.string(), { maxLength: 50 })])(
      "[🎲] is equivalent to native Array.map for plucking 'length' from strings",
      (arr) => {
        expect(pluck(arr, "length")).toEqual(arr.map((s) => s.length));
      }
    );
  });

  describe("Function behavior", () => {
    test("does not modify original array", () => {
      const original = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];
      const originalCopy = [...original];

      pluck(original, "name");

      expect(original).toEqual(originalCopy);
    });

    test("does not modify original object", () => {
      const original = {
        a: { name: "John", age: 25 },
        b: { name: "Jane", age: 30 },
        c: { name: "Bob", age: 20 },
      };
      const originalCopy = { ...original };

      pluck(original, "name");

      expect(original).toEqual(originalCopy);
    });

    test("returns new array", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(users, "name");

      expect(result).not.toBe(users);
      expect(Array.isArray(result)).toBe(true);
    });

    test("returns array of property values", () => {
      const users = [
        { name: "John", age: 25 },
        { name: "Jane", age: 30 },
        { name: "Bob", age: 20 },
      ];

      const result = pluck(users, "name");

      expect(result).toEqual(["John", "Jane", "Bob"]);
    });
  });

  describe("Complex use cases", () => {
    test("plucks property from array of user objects", () => {
      const users = [
        { id: 1, name: "John", email: "john@example.com", active: true },
        { id: 2, name: "Jane", email: "jane@example.com", active: false },
        { id: 3, name: "Bob", email: "bob@example.com", active: true },
      ];

      const result = pluck(users, "email");

      expect(result).toEqual([
        "john@example.com",
        "jane@example.com",
        "bob@example.com",
      ]);
    });

    test("plucks property from object of product objects", () => {
      const products = {
        laptop: {
          id: 1,
          name: "Laptop",
          price: 999.99,
          category: "Electronics",
        },
        phone: { id: 2, name: "Phone", price: 699.99, category: "Electronics" },
        book: { id: 3, name: "Book", price: 19.99, category: "Books" },
      };

      const result = pluck(products, "price");

      expect(result).toEqual([999.99, 699.99, 19.99]);
    });

    test("plucks property from array of nested objects", () => {
      const items = [
        { user: { profile: { firstName: "John", lastName: "Doe" } } },
        { user: { profile: { firstName: "Jane", lastName: "Smith" } } },
        { user: { profile: { firstName: "Bob", lastName: "Johnson" } } },
      ];

      const result = pluck(items, "user");

      expect(result).toEqual([
        { profile: { firstName: "John", lastName: "Doe" } },
        { profile: { firstName: "Jane", lastName: "Smith" } },
        { profile: { firstName: "Bob", lastName: "Johnson" } },
      ]);
    });

    test("plucks property from object of nested objects", () => {
      const obj = {
        a: { user: { profile: { firstName: "John", lastName: "Doe" } } },
        b: { user: { profile: { firstName: "Jane", lastName: "Smith" } } },
        c: { user: { profile: { firstName: "Bob", lastName: "Johnson" } } },
      };

      const result = pluck(obj, "user");

      expect(result).toEqual([
        { profile: { firstName: "John", lastName: "Doe" } },
        { profile: { firstName: "Jane", lastName: "Smith" } },
        { profile: { firstName: "Bob", lastName: "Johnson" } },
      ]);
    });

    test("plucks property from array of objects with computed properties", () => {
      const items = [
        { name: "John", age: 25, isAdult: true },
        { name: "Jane", age: 17, isAdult: false },
        { name: "Bob", age: 30, isAdult: true },
      ];

      const result = pluck(items, "isAdult");

      expect(result).toEqual([true, false, true]);
    });

    test("plucks property from object of objects with computed properties", () => {
      const obj = {
        a: { name: "John", age: 25, isAdult: true },
        b: { name: "Jane", age: 17, isAdult: false },
        c: { name: "Bob", age: 30, isAdult: true },
      };

      const result = pluck(obj, "isAdult");

      expect(result).toEqual([true, false, true]);
    });

    test("plucks property from array of objects with methods", () => {
      const items = [
        { name: "John", age: 25, greet: () => "Hello, I'm John" },
        { name: "Jane", age: 30, greet: () => "Hello, I'm Jane" },
        { name: "Bob", age: 20, greet: () => "Hello, I'm Bob" },
      ];

      const result = pluck(items, "greet");

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Function);
      expect(result[1]).toBeInstanceOf(Function);
      expect(result[2]).toBeInstanceOf(Function);
    });

    test("plucks property from object of objects with methods", () => {
      const obj = {
        a: { name: "John", age: 25, greet: () => "Hello, I'm John" },
        b: { name: "Jane", age: 30, greet: () => "Hello, I'm Jane" },
        c: { name: "Bob", age: 20, greet: () => "Hello, I'm Bob" },
      };

      const result = pluck(obj, "greet");

      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(Function);
      expect(result[1]).toBeInstanceOf(Function);
      expect(result[2]).toBeInstanceOf(Function);
    });
  });
});
