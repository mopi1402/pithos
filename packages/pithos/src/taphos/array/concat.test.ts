import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { concat } from "./concat";

describe("concat", () => {
  it("should concatenate arrays and values", () => {
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    const nested = [5, 6];
    const result = concat(arr1, arr2, nested);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should handle empty arrays", () => {
    const result = concat([], [1, 2], []);
    expect(result).toEqual([1, 2]);
  });

  it("should concatenate single values", () => {
    const result = concat([1, 2], 3, 4, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should handle mixed arrays and values", () => {
    const result = concat([1], [2, 3], 4, [5, 6], 7);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("should preserve original arrays", () => {
    const original1 = [1, 2];
    const original2 = [3, 4];
    const copy1 = [...original1];
    const copy2 = [...original2];
    concat(original1, original2);
    expect(original1).toEqual(copy1);
    expect(original2).toEqual(copy2);
  });

  it("should handle string arrays", () => {
    const result = concat(["a", "b"], ["c", "d"], "e");
    expect(result).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("should handle object arrays", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const result = concat([obj1], [obj2], { id: 3 });
    expect(result).toEqual([obj1, obj2, { id: 3 }]);
  });

  it("should handle nested arrays", () => {
    const result = concat([1], [2, 3], [4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should handle no additional values", () => {
    const original = [1, 2, 3];
    const result = concat(original);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(original);
  });

  it("should handle null and undefined values", () => {
    const result = concat([1], null, undefined, [2]);
    expect(result).toEqual([1, null, undefined, 2]);
  });

  it("should handle boolean values", () => {
    const result = concat([true], [false], true);
    expect(result).toEqual([true, false, true]);
  });

  it("should be equivalent to native array.concat()", () => {
    const testCases = [
      { array: [1, 2], values: [[3, 4], 5] },
      { array: ["a"], values: ["b", ["c", "d"]] },
      { array: [], values: [1, 2, 3] },
      { array: [1], values: [] },
      { array: [1, 2], values: [3, [4, 5], 6] },
    ];

    testCases.forEach(({ array, values }) => {
      const concatResult = concat(array, ...values);
      const nativeResult = array.concat(...values);
      expect(concatResult).toEqual(nativeResult);
    });
  });

  it("should handle large arrays", () => {
    const largeArray1 = Array.from({ length: 1000 }, (_, i) => i);
    const largeArray2 = Array.from({ length: 1000 }, (_, i) => i + 1000);
    const result = concat(largeArray1, largeArray2);
    expect(result).toHaveLength(2000);
    expect(result[0]).toBe(0);
    expect(result[999]).toBe(999);
    expect(result[1000]).toBe(1000);
    expect(result[1999]).toBe(1999);
  });

  it("should handle single element arrays", () => {
    expect(concat([1], [2])).toEqual([1, 2]);
    expect(concat([1], 2)).toEqual([1, 2]);
    expect(concat([], [1])).toEqual([1]);
    expect(concat([1], [])).toEqual([1]);
  });

  it("should handle complex nested structures", () => {
    const complex = [{ items: [1, 2] }, { items: [3, 4] }];
    const result = concat(complex, { items: [5, 6] });
    expect(result).toEqual([
      { items: [1, 2] },
      { items: [3, 4] },
      { items: [5, 6] },
    ]);
  });

  itProp.prop([fc.array(fc.integer()), fc.array(fc.integer())])(
    "[🎲] equivalent to arr.concat(other)",
    (arr, other) => {
      expect(concat(arr, other)).toEqual(arr.concat(other));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not modify original array",
    (arr) => {
      const copy = [...arr];
      concat(arr, [1, 2, 3]);
      expect(arr).toEqual(copy);
    }
  );
});
