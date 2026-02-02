import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { tail } from "./tail";
import { last } from "./last";

describe("tail", () => {
  test("gets all but the first element", () => {
    expect(tail([1, 2, 3])).toEqual([2, 3]);
    expect(tail("abc".split(""))).toEqual(["b", "c"]);
  });

  test("returns empty array for single element", () => {
    expect(tail([1])).toEqual([]);
  });

  test("returns empty array for empty array", () => {
    expect(tail([])).toEqual([]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] equivalent to arr.slice(1)",
    (arr) => {
      expect(tail(arr)).toEqual(arr.slice(1));
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result length is max(0, arr.length - 1)",
    (arr) => {
      expect(tail(arr).length).toBe(Math.max(0, arr.length - 1));
    }
  );
});
