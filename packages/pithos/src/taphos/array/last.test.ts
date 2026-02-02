import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { last } from "./last";

describe("last", () => {
  describe("should return the last element of array", () => {
    it("should return last element from numbers array", () => {
      const numbers = [1, 2, 3, 4, 5];
      expect(last(numbers)).toBe(5);
    });

    it("should return last element from strings array", () => {
      const strings = ["hello", "world", "test"];
      expect(last(strings)).toBe("test");
    });

    it("should return last element from mixed types array", () => {
      const mixed = [1, "hello", true, null];
      expect(last(mixed)).toBe(null);
    });

    it("should return last element from objects array", () => {
      const objects = [{ a: 1 }, { b: 2 }, { c: 3 }];
      expect(last(objects)).toEqual({ c: 3 });
    });

    it("should return last element from functions array", () => {
      const fn1 = () => 1;
      const fn2 = () => 2;
      const fn3 = () => 3;
      const functions = [fn1, fn2, fn3];
      expect(last(functions)).toBe(fn3);
    });

    it("should return last element from arrays array", () => {
      const arrays = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      expect(last(arrays)).toEqual([5, 6]);
    });
  });

  describe("should handle edge cases", () => {
    it("should return undefined for empty array", () => {
      expect(last([])).toBeUndefined();
    });

    it("should return the element for single element array", () => {
      expect(last([42])).toBe(42);
      expect(last(["single"])).toBe("single");
      expect(last([null])).toBe(null);
      expect(last([undefined])).toBe(undefined);
    });

    it("should return undefined for array with undefined elements", () => {
      const arr = [1, undefined, 3];
      expect(last(arr)).toBe(3);
    });

    it("should return null for array ending with null", () => {
      const arr = [1, 2, null];
      expect(last(arr)).toBe(null);
    });

    it("should return empty string for array ending with empty string", () => {
      const arr = ["a", "b", ""];
      expect(last(arr)).toBe("");
    });

    it("should return zero for array ending with zero", () => {
      const arr = [1, 2, 0];
      expect(last(arr)).toBe(0);
    });

    it("should return false for array ending with false", () => {
      const arr = [true, true, false];
      expect(last(arr)).toBe(false);
    });
  });

  describe("should handle special values", () => {
    it("should return NaN for array ending with NaN", () => {
      const arr = [1, 2, NaN];
      expect(last(arr)).toBeNaN();
    });

    it("should return Infinity for array ending with Infinity", () => {
      const arr = [1, 2, Infinity];
      expect(last(arr)).toBe(Infinity);
    });

    it("should return -Infinity for array ending with -Infinity", () => {
      const arr = [1, 2, -Infinity];
      expect(last(arr)).toBe(-Infinity);
    });

    it("should return BigInt for array ending with BigInt", () => {
      const arr = [1, 2, BigInt(123)];
      expect(last(arr)).toBe(BigInt(123));
    });

    it("should return Symbol for array ending with Symbol", () => {
      const sym = Symbol("test");
      const arr = [1, 2, sym];
      expect(last(arr)).toBe(sym);
    });
  });

  describe("should handle sparse arrays", () => {
    it("should handle sparse array", () => {
      const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
      expect(last(sparse)).toBe(3);
    });

    it("should handle array with holes", () => {
      const arr = new Array(3);
      arr[0] = "a";
      arr[2] = "c";
      expect(last(arr)).toBe("c");
    });

    it("should handle array with undefined holes", () => {
      const arr = new Array(3);
      arr[0] = "a";
      arr[1] = undefined;
      arr[2] = "c";
      expect(last(arr)).toBe("c");
    });
  });

  describe("should handle typed arrays", () => {
    it("should work with Int32Array converted to regular array", () => {
      const typedArray = new Int32Array([1, 2, 3]);
      const regularArray = Array.from(typedArray);
      expect(last(regularArray)).toBe(3);
    });

    it("should work with Uint8Array converted to regular array", () => {
      const uint8Array = new Uint8Array([65, 66, 67]); // ASCII for 'A', 'B', 'C'
      const regularArray = Array.from(uint8Array);
      expect(last(regularArray)).toBe(67);
    });

    it("should work with Float64Array converted to regular array", () => {
      const floatArray = new Float64Array([1.1, 2.2, 3.3]);
      const regularArray = Array.from(floatArray);
      expect(last(regularArray)).toBe(3.3);
    });
  });

  describe("should preserve original array", () => {
    it("should not modify original array", () => {
      const original = [1, 2, 3];
      const originalCopy = [...original];
      last(original);
      expect(original).toEqual(originalCopy);
    });
  });

  describe("should handle large arrays", () => {
    it("should work with large array", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      expect(last(largeArray)).toBe(999);
    });

    it("should work with array of objects", () => {
      const largeObjectArray = Array.from({ length: 100 }, (_, i) => ({
        id: i,
      }));
      const lastObject = last(largeObjectArray);
      expect(lastObject).toEqual({ id: 99 });
    });
  });

  describe("should handle array-like objects", () => {
    it("should work with arguments object", () => {
      function testFunction(...args: number[]) {
        return last(Array.from(args));
      }
      expect(testFunction(1, 2, 3)).toBe(3);
    });

    it("should work with NodeList-like object", () => {
      const nodeListLike = {
        0: "a",
        1: "b",
        2: "c",
        length: 3,
      };
      expect(last(Array.from(nodeListLike))).toBe("c");
    });
  });

  describe("type safety", () => {
    it("should maintain type safety", () => {
      const numbers: number[] = [1, 2, 3];
      const result: number | undefined = last(numbers);
      expect(typeof result).toBe("number");
    });

    it("should work with generic types", () => {
      const strings: string[] = ["a", "b", "c"];
      const result = last(strings);
      expect(typeof result).toBe("string");
    });

    it("should return undefined type for empty array", () => {
      const empty: number[] = [];
      const result = last(empty);
      expect(result).toBeUndefined();
    });
  });

  describe("should handle nested structures", () => {
    it("should return last nested object", () => {
      const nested = [
        { data: { value: 1 } },
        { data: { value: 2 } },
        { data: { value: 3 } },
      ];
      expect(last(nested)).toEqual({ data: { value: 3 } });
    });

    it("should return last nested array", () => {
      const nested = [
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
        [
          [9, 10],
          [11, 12],
        ],
      ];
      expect(last(nested)).toEqual([
        [9, 10],
        [11, 12],
      ]);
    });
  });

  describe("should handle edge cases with special objects", () => {
    it("should return last Date object", () => {
      const dates = [
        new Date("2023-01-01"),
        new Date("2023-01-02"),
        new Date("2023-01-03"),
      ];
      expect(last(dates)).toEqual(new Date("2023-01-03"));
    });

    it("should return last RegExp object", () => {
      const regexes = [/a/, /b/, /c/];
      expect(last(regexes)).toEqual(/c/);
    });

    it("should return last Error object", () => {
      const errors = [
        new Error("error1"),
        new Error("error2"),
        new Error("error3"),
      ];
      expect(last(errors)).toEqual(new Error("error3"));
    });

    it("should return last Map object", () => {
      const maps = [new Map(), new Map(), new Map()];
      expect(last(maps)).toBeInstanceOf(Map);
    });

    it("should return last Set object", () => {
      const sets = [new Set(), new Set(), new Set()];
      expect(last(sets)).toBeInstanceOf(Set);
    });
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] equivalent to arr[arr.length - 1]",
    (arr) => {
      expect(last(arr)).toBe(arr[arr.length - 1]);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] non-empty array returns defined value",
    (arr) => {
      expect(last(arr)).toBe(arr[arr.length - 1]);
    }
  );
});
