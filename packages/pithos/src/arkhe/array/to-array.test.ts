import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toArray } from "./to-array";

describe("toArray", () => {
  it("wraps single value", () => {
    expect(toArray(1)).toEqual([1]);
  });

  it("returns array as-is", () => {
    expect(toArray([1, 2])).toEqual([1, 2]);
  });

  it("handles empty array", () => {
    expect(toArray([])).toEqual([]);
  });

  it("handles string value", () => {
    expect(toArray("hello")).toEqual(["hello"]);
  });

  it("does not flatten nested arrays", () => {
    expect(toArray([[1], [2]])).toEqual([[1], [2]]);
  });

  it("[🎯] union type branch: wraps non-array value", () => {
    expect(toArray(5)).toEqual([5]);
  });

  it("[🎯] union type branch: returns array unchanged", () => {
    const arr = [1, 2, 3];
    expect(toArray(arr)).toBe(arr);
  });

  itProp.prop([fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.object())])(
    "[🎲] non-array value is wrapped in single-element array",
    (value) => {
      const result = toArray(value);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(value);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      toArray(arr);
      expect(arr).toEqual(original);
    }
  );
});
