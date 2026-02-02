import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { chunk } from "./chunk";

describe("chunk", () => {
  it("splits array into chunks of given size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("handles exact division", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("handles size larger than array", () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("throws RangeError for size = 0", () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
  });

  it("throws RangeError for negative size", () => {
    expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError);
  });

  it("throws RangeError for non-integer size", () => {
    expect(() => chunk([1, 2, 3], 2.5)).toThrow(RangeError);
  });

  it("throws with correct error message", () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(
      "Size must be a positive integer"
    );
  });

  it("returns empty for empty array", () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it("handles size of 1", () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it("[🎯] size equals array length returns single chunk", () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  itProp.prop([fc.array(fc.anything()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] number of chunks equals ceil(length / size)",
    (arr, size) => {
      const chunks = chunk(arr, size);
      expect(chunks.length).toBe(Math.ceil(arr.length / size));
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] flattened chunks equal original array",
    (arr, size) => {
      const chunks = chunk(arr, size);
      const flattened = chunks.flat();
      expect(flattened).toEqual(arr);
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] all chunks except last have correct size",
    (arr, size) => {
      const chunks = chunk(arr, size);
      for (let i = 0; i < chunks.length - 1; i++) {
        expect(chunks[i]).toHaveLength(size);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] last chunk has size <= chunkSize",
    (arr, size) => {
      const chunks = chunk(arr, size);
      if (chunks.length > 0) {
        expect(chunks[chunks.length - 1].length).toBeLessThanOrEqual(size);
      }
    }
  );

  itProp.prop([fc.array(fc.integer()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] does not mutate original array",
    (arr, size) => {
      const original = [...arr];
      chunk(arr, size);
      expect(arr).toEqual(original);
    }
  );
});
