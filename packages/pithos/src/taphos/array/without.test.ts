import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { without } from "./without";
import { difference } from "../../arkhe/array/difference";

describe("without", () => {
  test("without is a wrapper of difference function", () => {
    expect(without).not.toBe(difference);
    
    const array = [1, 2, 3, 4, 5];
    
    const withoutResult = without(array, 2, 4);
    const differenceResult = difference(array, [2, 4]);
    
    expect(withoutResult).toEqual(differenceResult);
    expect(withoutResult).toEqual([1, 3, 5]);
  });

  test("[🎯] removes values immutably", () => {
    const arr = [1, 2, 3];
    const result = without(arr, 2);
    expect(result).toEqual([1, 3]);
    expect(arr).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] without no values returns copy of array",
    (arr) => {
      const result = without(arr);
      expect(result).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] result does not contain removed value",
    (arr, val) => {
      const result = without(arr, val);
      expect(result).not.toContain(val);
    }
  );
});
