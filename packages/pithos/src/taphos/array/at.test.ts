import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { at } from "./at";

describe("at", () => {
  describe("Basic cases", () => {
    test("gets element at positive index", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(at(arr, 0)).toBe(1);
      expect(at(arr, 2)).toBe(3);
      expect(at(arr, 4)).toBe(5);
    });

    test("gets element at negative index", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(at(arr, -1)).toBe(5);
      expect(at(arr, -2)).toBe(4);
      expect(at(arr, -5)).toBe(1);
    });
  });

  describe("Empty array", () => {
    test("returns undefined for empty array", () => {
      const arr: number[] = [];
      expect(at(arr, 0)).toBeUndefined();
      expect(at(arr, -1)).toBeUndefined();
      expect(at(arr, 5)).toBeUndefined();
    });
  });

  describe("Out of bounds", () => {
    test("returns undefined for positive index out of bounds", () => {
      const arr = [1, 2, 3];
      expect(at(arr, 3)).toBeUndefined();
      expect(at(arr, 10)).toBeUndefined();
    });

    test("returns undefined for negative index out of bounds", () => {
      const arr = [1, 2, 3];
      expect(at(arr, -4)).toBeUndefined();
      expect(at(arr, -10)).toBeUndefined();
    });
  });

  describe("Single element array", () => {
    test("gets the only element", () => {
      const arr = [42];
      expect(at(arr, 0)).toBe(42);
      expect(at(arr, -1)).toBe(42);
    });

    test("returns undefined for out of bounds", () => {
      const arr = [42];
      expect(at(arr, 1)).toBeUndefined();
      expect(at(arr, -2)).toBeUndefined();
    });
  });

  describe("Different data types", () => {
    test("works with strings", () => {
      const arr = ["a", "b", "c"];
      expect(at(arr, 1)).toBe("b");
      expect(at(arr, -1)).toBe("c");
    });

    test("works with objects", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const arr = [obj1, obj2];
      expect(at(arr, 0)).toBe(obj1);
      expect(at(arr, -1)).toBe(obj2);
    });

    test("works with mixed types", () => {
      const arr = [1, "hello", true, null];
      expect(at(arr, 0)).toBe(1);
      expect(at(arr, 1)).toBe("hello");
      expect(at(arr, 2)).toBe(true);
      expect(at(arr, 3)).toBe(null);
      expect(at(arr, -1)).toBe(null);
    });
  });

  describe("Edge cases", () => {
    test("handles null and undefined in array", () => {
      const arr = [1, null, 3, undefined];
      expect(at(arr, 1)).toBe(null);
      expect(at(arr, 3)).toBeUndefined();
    });

    test("handles NaN in array", () => {
      const arr = [1, NaN, 3];
      expect(at(arr, 1)).toBeNaN();
    });

    test("handles +0 and -0", () => {
      const arr = [+0, 1, -0];
      expect(at(arr, 0)).toBe(+0);
      expect(at(arr, 2)).toBe(-0);
    });
  });

  describe("Decimal indices", () => {
    test("handles decimal indices (returns undefined)", () => {
      const arr = [1, 2, 3];
      expect(at(arr, 1.5)).toBeUndefined();
      expect(at(arr, -1.5)).toBeUndefined();
    });

    test("handles decimal indices close to integers", () => {
      const arr = [1, 2, 3];
      expect(at(arr, 1.9)).toBeUndefined();
      expect(at(arr, 0.1)).toBeUndefined();
    });
  });

  describe("Special index values", () => {
    test("handles NaN as index", () => {
      const arr = [1, 2, 3];
      expect(at(arr, NaN)).toBeUndefined();
    });

    test("handles Infinity as index", () => {
      const arr = [1, 2, 3];
      expect(at(arr, Infinity)).toBeUndefined();
      expect(at(arr, -Infinity)).toBeUndefined();
    });

    test("handles very large numbers", () => {
      const arr = [1, 2, 3];
      expect(at(arr, Number.MAX_SAFE_INTEGER)).toBeUndefined();
      expect(at(arr, -Number.MAX_SAFE_INTEGER)).toBeUndefined();
    });
  });

  describe("Immutability", () => {
    test("does not modify original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      at(arr, 2);
      expect(arr).toEqual(original);
    });
  });

  describe("Consistency with examples", () => {
    test("matches documented examples", () => {
      const numbers = [1, 2, 3, 4, 5];

      // Examples from JSDoc
      expect(at(numbers, 0)).toBe(1); // first
      expect(at(numbers, -1)).toBe(5); // last
      expect(at(numbers, -2)).toBe(4); // second last
    });
  });

  describe("Large arrays", () => {
    test("handles large arrays", () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      expect(at(arr, 0)).toBe(0);
      expect(at(arr, 999)).toBe(999);
      expect(at(arr, -1)).toBe(999);
      expect(at(arr, -1000)).toBe(0);
    });
  });

  describe("Sparse arrays", () => {
    test("handles sparse arrays", () => {
      const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays
      expect(at(arr, 0)).toBe(1);
      expect(at(arr, 1)).toBeUndefined();
      expect(at(arr, 2)).toBe(3);
    });
  });

  describe("Type safety", () => {
    test("preserves type information", () => {
      const stringArr = ["a", "b", "c"];
      const stringResult = at(stringArr, 1);
      expect(typeof stringResult).toBe("string");

      const numberArr = [1, 2, 3];
      const numberResult = at(numberArr, 1);
      expect(typeof numberResult).toBe("number");
    });
  });

  describe("Comparison with native behavior", () => {
    test("differs from native Array.at for decimal indices", () => {
      const arr = [1, 2, 3];

      // Our function returns undefined for decimal indices
      expect(at(arr, 1.5)).toBeUndefined();

      // Native Array.at would return the element at index 1 (if available)
      // This is a difference in behavior - our function is more strict
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: -100, max: 100 })])(
    "[🎲] returns correct element for integer indices",
    (arr, index) => {
      const len = arr.length;
      const normalizedIndex = index < 0 ? len + index : index;
      const expected =
        normalizedIndex < 0 || normalizedIndex >= len
          ? undefined
          : arr[normalizedIndex];
      expect(at(arr, index)).toBe(expected);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] at(arr, 0) equals arr[0]",
    (arr) => {
      expect(at(arr, 0)).toBe(arr[0]);
    }
  );

  itProp.prop([fc.array(fc.integer(), { minLength: 1 })])(
    "[🎲] at(arr, -1) equals arr[arr.length - 1]",
    (arr) => {
      expect(at(arr, -1)).toBe(arr[arr.length - 1]);
    }
  );
});
