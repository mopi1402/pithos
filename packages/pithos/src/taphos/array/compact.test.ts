import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { compact } from "./compact";

describe("compact", () => {
  it("should remove all falsy values from array", () => {
    const mixed = [1, 0, false, "", "hello", null, undefined];
    const result = compact(mixed);
    expect(result).toEqual([1, "hello"]);
  });

  it("should handle empty array", () => {
    const result = compact([]);
    expect(result).toEqual([]);
  });

  it("should handle array with only truthy values", () => {
    const truthy = [1, "hello", true, {}, []];
    const result = compact(truthy);
    expect(result).toEqual([1, "hello", true, {}, []]);
  });

  it("should handle array with only falsy values", () => {
    const falsy = [0, false, "", null, undefined, NaN];
    const result = compact(falsy);
    expect(result).toEqual([]);
  });

  it("should preserve original array", () => {
    const original = [1, 0, false, "test"];
    const copy = [...original];
    compact(original);
    expect(original).toEqual(copy);
  });

  it("should handle mixed types", () => {
    const mixed = [
      "string",
      0,
      true,
      false,
      null,
      undefined,
      42,
      "",
      "another string",
      NaN,
    ];
    const result = compact(mixed);
    expect(result).toEqual(["string", true, 42, "another string"]);
  });

  it("should handle objects and arrays", () => {
    const objects = [{ id: 1 }, null, [], undefined, { name: "test" }, false];
    const result = compact(objects);
    expect(result).toEqual([{ id: 1 }, [], { name: "test" }]);
  });

  it("should handle numbers including zero and NaN", () => {
    const numbers = [1, 0, -1, NaN, 3.14, -0];
    const result = compact(numbers);
    expect(result).toEqual([1, -1, 3.14]);
  });

  it("should handle strings including empty string", () => {
    const strings = ["hello", "", "world", " ", "test"];
    const result = compact(strings);
    expect(result).toEqual(["hello", "world", " ", "test"]);
  });

  it("should be equivalent to array.filter(Boolean)", () => {
    const testArrays = [
      [1, 0, false, "", "hello", null, undefined],
      ["a", "", "b", null, "c"],
      [true, false, 1, 0, "test"],
      [],
      [null, undefined, false, 0, ""],
    ];

    testArrays.forEach((array) => {
      const compactResult = compact(array);
      const filterResult = array.filter(Boolean);
      expect(compactResult).toEqual(filterResult);
    });
  });

  it("should handle single element arrays", () => {
    expect(compact([1])).toEqual([1]);
    expect(compact([0])).toEqual([]);
    expect(compact([""])).toEqual([]);
    expect(compact([null])).toEqual([]);
    expect(compact([undefined])).toEqual([]);
    expect(compact([false])).toEqual([]);
    expect(compact([true])).toEqual([true]);
  });

  it("should handle large arrays", () => {
    const truthyValues = Array.from({ length: 500 }, (_, i) => i + 1);
    const falsyValues = Array.from({ length: 500 }, () => null);
    const largeArray = [...truthyValues, ...falsyValues];
    const result = compact(largeArray);
    expect(result).toHaveLength(500);
    expect(result.every((val) => val !== null)).toBe(true);
    expect(result[0]).toBe(1);
    expect(result[499]).toBe(500);
  });

  itProp.prop([fc.array(fc.anything())])("[🎲] result length <= input length", (arr) => {
    expect(compact(arr).length).toBeLessThanOrEqual(arr.length);
  });

  itProp.prop([fc.array(fc.anything())])("[🎲] all results are truthy", (arr) => {
    const result = compact(arr);
    result.forEach((item) => expect(Boolean(item)).toBe(true));
  });

  itProp.prop([fc.array(fc.anything())])("[🎲] equivalent to filter(Boolean)", (arr) => {
    expect(compact(arr)).toEqual(arr.filter(Boolean));
  });
});
