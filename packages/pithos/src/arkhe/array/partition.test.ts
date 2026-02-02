import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { partition } from "./partition";

describe("partition", () => {
  it("splits array by predicate", () => {
    expect(partition([1, 2, 3, 4], (x) => x % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("returns empty arrays for empty input", () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it("all truthy when predicate always true", () => {
    expect(partition([1, 2, 3], () => true)).toEqual([[1, 2, 3], []]);
  });

  it("all falsy when predicate always false", () => {
    expect(partition([1, 2, 3], () => false)).toEqual([[], [1, 2, 3]]);
  });

  it("provides index to predicate", () => {
    expect(partition([1, 2, 3], (_, i) => i < 2)).toEqual([[1, 2], [3]]);
  });

  it("provides array to predicate", () => {
    expect(partition([1, 2, 1], (v, _, arr) => v === arr[0])).toEqual([
      [1, 1],
      [2],
    ]);
  });

  it("[🎯] type guard overload narrows types correctly", () => {
    const mixed: (string | number)[] = [1, "a", 2, "b", 3];
    const isString = (v: string | number): v is string => typeof v === "string";
    const [strings, numbers] = partition(mixed, isString);

    expect(strings).toEqual(["a", "b"]);
    expect(numbers).toEqual([1, 2, 3]);

    const upperStrings: string[] = strings.map((s) => s.toUpperCase());
    expect(upperStrings).toEqual(["A", "B"]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] both partitions combined equal original length",
    (arr) => {
      const [truthy, falsy] = partition(arr, (x) => x % 2 === 0);
      expect(truthy.length + falsy.length).toBe(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] all truthy elements satisfy predicate",
    (arr) => {
      const [truthy] = partition(arr, (x) => x > 0);
      expect(truthy.every((x) => x > 0)).toBe(true);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] all falsy elements fail predicate",
    (arr) => {
      const [, falsy] = partition(arr, (x) => x > 0);
      expect(falsy.every((x) => x <= 0)).toBe(true);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] preserves relative order within each partition",
    (arr) => {
      const predicate = (x: number) => x % 2 === 0;
      const [truthy, falsy] = partition(arr, predicate);

      const expectedTruthy = arr.filter(predicate);
      const expectedFalsy = arr.filter((x) => !predicate(x));

      expect(truthy).toEqual(expectedTruthy);
      expect(falsy).toEqual(expectedFalsy);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      partition(arr, (x) => x % 2 === 0);
      expect(arr).toEqual(original);
    }
  );
});
