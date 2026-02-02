import { describe, it, expect, vi, afterEach } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns array with same elements", () => {
    const array = [1, 2, 3, 4, 5];
    const result = shuffle(array);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns new array instance", () => {
    const array = [1, 2, 3];
    const result = shuffle(array);
    expect(result).not.toBe(array);
  });

  it("does not mutate original array", () => {
    const array = [1, 2, 3, 4, 5];
    const original = [...array];
    shuffle(array);
    expect(array).toEqual(original);
  });

  it("returns empty array for empty input", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("handles single element array", () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it("maintains correct length", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(shuffle(array)).toHaveLength(10);
  });

  it("works with different types", () => {
    const strings = ["a", "b", "c"];
    const result = shuffle(strings);
    expect(result.sort()).toEqual(["a", "b", "c"]);
  });

  it("[👾] performs Fisher-Yates shuffle correctly", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toEqual([1, 4, 2, 5, 3]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result has same length as input",
    (arr) => {
      const result = shuffle(arr);
      expect(result.length).toBe(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result contains all original elements",
    (arr) => {
      const result = shuffle(arr);
      expect(result.sort()).toEqual([...arr].sort());
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] returns new array instance",
    (arr) => {
      const result = shuffle(arr);
      expect(result).not.toBe(arr);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result has no duplicates if input has none",
    (arr) => {
      const uniqueInput = Array.from(new Set(arr));
      const result = shuffle(uniqueInput);
      const uniqueResult = new Set(result);
      expect(uniqueResult.size).toBe(uniqueInput.length);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const original = [...arr];
      shuffle(arr);
      expect(arr).toEqual(original);
    }
  );
});
