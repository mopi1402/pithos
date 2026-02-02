import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { castArray } from "./castArray";
import { toArray } from "../../arkhe/array/to-array";

describe("castArray", () => {
  describe("wrapper behavior", () => {
    it("castArray is a wrapper of toArray function", () => {
      expect(castArray).not.toBe(toArray);
      
      const testValues = [1, [1, 2, 3], "hello", null, undefined, true, false];
      
      testValues.forEach((value) => {
        expect(castArray(value)).toEqual(toArray(value));
      });
    });
  });

  describe("basic functionality", () => {
    it("[🎯] returns array as-is when value is already an array", () => {
      expect(castArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(castArray([])).toEqual([]);
      expect(castArray(["hello", "world"])).toEqual(["hello", "world"]);
      expect(castArray([null])).toEqual([null]);
      expect(castArray([undefined])).toEqual([undefined]);
    });

    it("wraps non-array values in an array", () => {
      expect(castArray(1)).toEqual([1]);
      expect(castArray("hello")).toEqual(["hello"]);
      expect(castArray(true)).toEqual([true]);
      expect(castArray(false)).toEqual([false]);
      expect(castArray(null)).toEqual([null]);
      expect(castArray(undefined)).toEqual([undefined]);
    });

    it("[🎯] preserves reference for arrays", () => {
      const originalArray = [1, 2, 3];
      const result = castArray(originalArray);
      expect(result).toBe(originalArray);
    });

    it("creates new array for non-arrays", () => {
      const value = "hello";
      const result = castArray(value);
      expect(result).not.toBe(value);
      expect(result).toEqual([value]);
    });
  });

  describe("primitive types", () => {
    it("handles numbers", () => {
      expect(castArray(0)).toEqual([0]);
      expect(castArray(-0)).toEqual([-0]);
      expect(castArray(42)).toEqual([42]);
      expect(castArray(-42)).toEqual([-42]);
      expect(castArray(3.14)).toEqual([3.14]);
      expect(castArray(-3.14)).toEqual([-3.14]);
    });

    it("handles special number values", () => {
      expect(castArray(NaN)).toEqual([NaN]);
      expect(castArray(Infinity)).toEqual([Infinity]);
      expect(castArray(-Infinity)).toEqual([-Infinity]);
      expect(castArray(Number.MAX_VALUE)).toEqual([Number.MAX_VALUE]);
      expect(castArray(Number.MIN_VALUE)).toEqual([Number.MIN_VALUE]);
    });

    it("handles strings", () => {
      expect(castArray("")).toEqual([""]);
      expect(castArray("hello")).toEqual(["hello"]);
      expect(castArray("0")).toEqual(["0"]);
      expect(castArray("123")).toEqual(["123"]);
      expect(castArray("café")).toEqual(["café"]);
      expect(castArray("🚀")).toEqual(["🚀"]);
    });

    it("handles booleans", () => {
      expect(castArray(true)).toEqual([true]);
      expect(castArray(false)).toEqual([false]);
    });

    it("handles nullish values", () => {
      expect(castArray(null)).toEqual([null]);
      expect(castArray(undefined)).toEqual([undefined]);
    });

    it("handles symbols", () => {
      const sym = Symbol("test");
      expect(castArray(sym)).toEqual([sym]);
      expect(castArray(Symbol.iterator)).toEqual([Symbol.iterator]);
    });

    it("handles bigints", () => {
      expect(castArray(123n)).toEqual([123n]);
      expect(castArray(BigInt(456))).toEqual([BigInt(456)]);
    });
  });

  describe("objects and functions", () => {
    it("handles plain objects", () => {
      const obj = { a: 1, b: 2 };
      expect(castArray(obj)).toEqual([obj]);
      expect(castArray({})).toEqual([{}]);
    });

    it("handles functions", () => {
      const fn = () => {};
      const fn2 = function () {};
      expect(castArray(fn)).toEqual([fn]);
      expect(castArray(fn2)).toEqual([fn2]);
      expect(castArray(Math.max)).toEqual([Math.max]);
    });

    it("handles built-in objects", () => {
      const date = new Date();
      const regex = /test/;
      const map = new Map();
      const set = new Set();

      expect(castArray(date)).toEqual([date]);
      expect(castArray(regex)).toEqual([regex]);
      expect(castArray(map)).toEqual([map]);
      expect(castArray(set)).toEqual([set]);
    });

    it("handles class instances", () => {
      class TestClass {}
      const instance = new TestClass();
      expect(castArray(instance)).toEqual([instance]);
    });
  });

  describe("nested arrays", () => {
    it("handles nested arrays", () => {
      expect(castArray([[]])).toEqual([[]]);
      expect(
        castArray([
          [1, 2],
          [3, 4],
        ])
      ).toEqual([
        [1, 2],
        [3, 4],
      ]);
      expect(castArray([1, [2, [3]]])).toEqual([1, [2, [3]]]);
    });

    it("handles arrays with mixed types", () => {
      const mixedArray = [1, "hello", true, null, undefined, {}, []];
      expect(castArray(mixedArray)).toEqual(mixedArray);
    });
  });

  describe("edge cases", () => {
    it("handles empty arrays", () => {
      expect(castArray([])).toEqual([]);
      expect(castArray([[]])).toEqual([[]]);
    });

    it("handles arrays with nullish values", () => {
      expect(castArray([null])).toEqual([null]);
      expect(castArray([undefined])).toEqual([undefined]);
      expect(castArray([null, undefined])).toEqual([null, undefined]);
    });

    it("handles very large arrays", () => {
      const largeArray = new Array(1000).fill(0);
      expect(castArray(largeArray)).toBe(largeArray);
    });

    it("handles sparse arrays", () => {
      const sparseArray = [1, , 3]; // eslint-disable-line no-sparse-arrays
      expect(castArray(sparseArray)).toBe(sparseArray);
    });
  });

  describe("type safety", () => {
    it("preserves type information", () => {
      const stringValue: string = "hello";
      const result = castArray(stringValue);
      expect(result).toEqual(["hello"]);
      expect(typeof result[0]).toBe("string");
    });

    it("handles union types", () => {
      const value: string | number = "test";
      const result = castArray(value);
      expect(result).toEqual(["test"]);
    });

    it("handles generic types", () => {
      const value: unknown = "hello";
      const result = castArray(value);
      expect(result).toEqual(["hello"]);
    });
  });

  describe("consistency with Array.isArray", () => {
    it("matches Array.isArray behavior", () => {
      const testValues = [
        [],
        [1, 2, 3],
        "hello",
        42,
        true,
        null,
        undefined,
        {},
        () => {},
        new Date(),
        /test/,
        Symbol("test"),
        123n,
      ];

      testValues.forEach((value) => {
        const isArray = Array.isArray(value);
        const result = castArray(value);

        if (isArray) {
          expect(result).toBe(value);
        } else {
          expect(result).toEqual([value]);
          expect(result).not.toBe(value);
        }
      });
    });
  });

  describe("real-world usage patterns", () => {
    it("handles API responses", () => {
      const singleItem = { id: 1, name: "test" };
      const multipleItems = [{ id: 1 }, { id: 2 }];

      expect(castArray(singleItem)).toEqual([singleItem]);
      expect(castArray(multipleItems)).toBe(multipleItems);
    });

    it("handles configuration values", () => {
      const singleConfig = "development";
      const multipleConfigs = ["development", "production"];

      expect(castArray(singleConfig)).toEqual([singleConfig]);
      expect(castArray(multipleConfigs)).toBe(multipleConfigs);
    });

    it("handles user inputs", () => {
      const singleInput = "user@example.com";
      const multipleInputs = ["user1@example.com", "user2@example.com"];

      expect(castArray(singleInput)).toEqual([singleInput]);
      expect(castArray(multipleInputs)).toBe(multipleInputs);
    });
  });

  describe("performance considerations", () => {
    it("handles repeated operations efficiently", () => {
      const results = [];
      for (let i = 0; i < 1000; i++) {
        results.push(castArray(i));
      }
      expect(results.every((r, i) => r[0] === i)).toBe(true);
    });

    it("handles large values", () => {
      const largeString = "a".repeat(10000);
      const result = castArray(largeString);
      expect(result).toEqual([largeString]);
    });
  });

  describe("deprecation notice", () => {
    it("works as documented in examples", () => {
      // Test the examples from the JSDoc comments
      expect(castArray(1)).toEqual([1]);
      expect(castArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(castArray("hello")).toEqual(["hello"]);
      expect(castArray(null)).toEqual([null]);
    });

    it("matches recommended approach behavior", () => {
      const toArray = <T>(value: T | T[]): T[] =>
        Array.isArray(value) ? value : [value];

      const testValues = [1, [1, 2, 3], "hello", null, undefined, true, false];

      testValues.forEach((value) => {
        expect(castArray(value)).toEqual(toArray(value));
      });
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.array(fc.anything())])(
      "[🎲] arrays are returned by reference",
      (arr) => {
        expect(castArray(arr)).toBe(arr);
      }
    );

    itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
      "[🎲] non-arrays are wrapped in array",
      (value) => {
        const result = castArray(value);
        expect(result).toEqual([value]);
        expect(result).toHaveLength(1);
      }
    );
  });
});
