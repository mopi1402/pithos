import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { lastIndexOf } from "./lastIndexOf";

describe("lastIndexOf", () => {
  describe("Basic cases", () => {
    test("finds last occurrence of value", () => {
      const arr = [1, 2, 3, 2, 4];
      expect(lastIndexOf(arr, 2)).toBe(3);
    });

    test("returns -1 if value does not exist", () => {
      const arr = [1, 2, 3, 4];
      expect(lastIndexOf(arr, 5)).toBe(-1);
    });

    test("finds unique value", () => {
      const arr = [1, 2, 3, 4];
      expect(lastIndexOf(arr, 3)).toBe(2);
    });
  });

  describe("Empty array", () => {
    test("returns -1 for empty array", () => {
      expect(lastIndexOf([], 1)).toBe(-1);
    });
  });

  describe("With fromIndex", () => {
    test("finds last occurrence before fromIndex", () => {
      const arr = [1, 2, 3, 2, 4, 2];
      expect(lastIndexOf(arr, 2, 4)).toBe(3);
    });

    test("finds value at exact fromIndex", () => {
      const arr = [1, 2, 3, 2, 4];
      expect(lastIndexOf(arr, 2, 3)).toBe(3);
    });

    test("returns correct index when occurrence exists before fromIndex", () => {
      const arr = [1, 2, 3, 4, 2];
      expect(lastIndexOf(arr, 2, 2)).toBe(1);
    });

    test("with negative fromIndex", () => {
      const arr = [1, 2, 3, 2, 4];
      expect(lastIndexOf(arr, 2, -2)).toBe(3);
    });

    test("with very negative fromIndex (out of bounds)", () => {
      const arr = [1, 2, 3];
      expect(lastIndexOf(arr, 1, -10)).toBe(-1);
    });

    test("with fromIndex greater than array length", () => {
      const arr = [1, 2, 3, 2];
      expect(lastIndexOf(arr, 2, 10)).toBe(3);
    });
  });

  describe("Different data types", () => {
    test("with strings", () => {
      const arr = ["a", "b", "c", "b"];
      expect(lastIndexOf(arr, "b")).toBe(3);
    });

    test("with objects (reference equality)", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const arr = [obj1, obj2, obj1];
      expect(lastIndexOf(arr, obj1)).toBe(2);
    });

    test("with different objects but same content", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(lastIndexOf(arr, { id: 1 })).toBe(-1);
    });

    test("with booleans", () => {
      const arr = [true, false, true, false];
      expect(lastIndexOf(arr, true)).toBe(2);
    });

    test("with null and undefined", () => {
      const arr = [1, null, 3, null, undefined];
      expect(lastIndexOf(arr, null)).toBe(3);
      expect(lastIndexOf(arr, undefined)).toBe(4);
    });
  });

  describe("Edge cases", () => {
    test("with NaN", () => {
      const arr = [1, NaN, 3, NaN];
      expect(lastIndexOf(arr, NaN)).toBe(-1);
    });

    test("with +0 and -0", () => {
      const arr = [+0, 1, -0];
      expect(lastIndexOf(arr, +0)).toBe(2);
      expect(lastIndexOf(arr, -0)).toBe(2);
    });

    test("array with single element", () => {
      expect(lastIndexOf([5], 5)).toBe(0);
      expect(lastIndexOf([5], 3)).toBe(-1);
    });

    test("all elements are identical", () => {
      const arr = [2, 2, 2, 2];
      expect(lastIndexOf(arr, 2)).toBe(3);
      expect(lastIndexOf(arr, 2, 1)).toBe(1);
    });
  });

  describe("Type coercion on fromIndex", () => {
    test("undefined as fromIndex defaults to end", () => {
      const arr = [1, 2, 3, 2, 4];
      expect(lastIndexOf(arr, 2, undefined)).toBe(3);
    });

    test("null as fromIndex becomes 0", () => {
      const arr = [1, 2, 3, 2];
      expect(lastIndexOf(arr, 2, null as any)).toBe(-1);
    });

    test("numeric string as fromIndex", () => {
      const arr = [1, 2, 3, 2, 4];
      expect(lastIndexOf(arr, 2, "2" as any)).toBe(1);
    });

    test("empty string as fromIndex becomes 0", () => {
      const arr = [1, 2, 3];
      expect(lastIndexOf(arr, 1, "" as any)).toBe(0);
    });
  });

  describe("Consistency with native Array.lastIndexOf", () => {
    const testCases = [
      { arr: [1, 2, 3, 2, 4], value: 2 },
      { arr: [1, 2, 3, 2, 4], value: 2, fromIndex: undefined },
      { arr: [1, 2, 3, 2, 4], value: 2, fromIndex: 3 },
      { arr: [1, 2, 3, 2, 4], value: 5 },
      { arr: [], value: 1 },
      { arr: [1, 2, 3], value: 2, fromIndex: -1 },
      { arr: [1, 2, 3], value: 2, fromIndex: -10 },
      { arr: [1, 2, 3], value: 2, fromIndex: 10 },
      { arr: [1, 2, 3], value: 2, fromIndex: null as any },
      { arr: [1, 2, 3], value: 2, fromIndex: "" as any },
      { arr: [1, 2, 3, 2], value: 2, fromIndex: "2" as any },
    ];

    testCases.forEach(({ arr, value, fromIndex }, index) => {
      test(`case ${index + 1
        }: consistency with native - arr=[${arr}], value=${value}, fromIndex=${fromIndex}`, () => {
          const customResult =
            fromIndex === undefined
              ? lastIndexOf(arr, value)
              : lastIndexOf(arr, value, fromIndex);
          const nativeResult =
            fromIndex === undefined
              ? arr.lastIndexOf(value)
              : arr.lastIndexOf(value, fromIndex);
          expect(customResult).toBe(nativeResult);
        });
    });
  });

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] equivalent to arr.lastIndexOf(value)",
    (arr, value) => {
      expect(lastIndexOf(arr, value)).toBe(arr.lastIndexOf(value));
    }
  );

  itProp.prop([
    fc.array(fc.integer()),
    fc.integer(),
    fc.integer({ min: -100, max: 100 }),
  ])("[🎲] equivalent to arr.lastIndexOf(value, fromIndex)", (arr, value, fromIndex) => {
    expect(lastIndexOf(arr, value, fromIndex)).toBe(arr.lastIndexOf(value, fromIndex));
  });
});
