import { describe, it, expect } from "vitest";
import { zipObject } from "./zipObject";

describe("zipObject", () => {
  it("creates object from keys and values", () => {
    expect(zipObject(["a", "b"], [1, 2])).toEqual({ a: 1, b: 2 });
  });

  it("handles numeric keys", () => {
    expect(zipObject([0, 1, 2], ["a", "b", "c"])).toEqual({
      0: "a",
      1: "b",
      2: "c",
    });
  });

  it("handles symbol keys", () => {
    const sym1 = Symbol("a");
    const sym2 = Symbol("b");
    const result = zipObject([sym1, sym2], [1, 2]);
    expect(result[sym1]).toBe(1);
    expect(result[sym2]).toBe(2);
  });

  it("assigns undefined for missing values", () => {
    expect(zipObject(["a", "b", "c"], [1, 2])).toEqual({
      a: 1,
      b: 2,
      c: undefined,
    });
  });

  it("ignores extra values", () => {
    expect(zipObject(["a", "b"], [1, 2, 3, 4])).toEqual({ a: 1, b: 2 });
  });

  it("[🎯] handles empty arrays", () => {
    expect(zipObject([], [])).toEqual({});
  });

  it("[🎯] handles empty keys with values", () => {
    expect(zipObject([], [1, 2, 3])).toEqual({});
  });

  it("[🎯] handles single key-value pair", () => {
    expect(zipObject(["a"], [1])).toEqual({ a: 1 });
  });

  it("overwrites duplicate keys with last value", () => {
    expect(zipObject(["a", "a", "a"], [1, 2, 3])).toEqual({ a: 3 });
  });
});
