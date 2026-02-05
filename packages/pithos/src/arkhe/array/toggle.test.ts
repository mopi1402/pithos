import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toggle } from "./toggle";

describe("toggle", () => {
  it("adds element when not present", () => {
    expect(toggle([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it("removes element when present", () => {
    expect(toggle([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("handles empty array", () => {
    expect(toggle([], 1)).toEqual([1]);
  });

  it("removes only first occurrence", () => {
    expect(toggle([1, 2, 1], 1)).toEqual([2, 1]);
  });

  it("does not mutate original array", () => {
    const arr = [1, 2, 3];
    toggle(arr, 2);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("[🎯] single element array removes element if present", () => {
    expect(toggle([1], 1)).toEqual([]);
  });

  it("[🎯] single element array adds element if not present", () => {
    expect(toggle([1], 2)).toEqual([1, 2]);
  });

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] toggling twice returns to original when element appears at most once",
    (arr, value) => {
      // Property only holds when element has 0 or 1 occurrences
      const count = arr.filter((x) => x === value).length;
      fc.pre(count <= 1);
      const once = toggle(arr, value);
      const twice = toggle(once, value);
      expect(twice.slice().sort()).toEqual(arr.slice().sort());
      expect(twice).toHaveLength(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] result differs by exactly one element",
    (arr, value) => {
      const result = toggle(arr, value);
      const diff = Math.abs(result.length - arr.length);
      expect(diff).toBe(1);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] relative order of other elements is preserved",
    (arr, value) => {
      const result = toggle(arr, value);
      const index = arr.indexOf(value);

      if (index === -1) {
        // Added: original elements are prefix of result
        expect(result.slice(0, arr.length)).toEqual(arr);
      } else {
        // Removed: elements before and after removed index maintain order
        const expected = [...arr.slice(0, index), ...arr.slice(index + 1)];
        expect(result).toEqual(expected);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer()])(
    "[🎲] does not mutate original array",
    (arr, value) => {
      const original = [...arr];
      toggle(arr, value);
      expect(arr).toEqual(original);
    }
  );
});
