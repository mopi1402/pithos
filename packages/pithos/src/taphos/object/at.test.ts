import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { at } from "./at";

describe("at", () => {
  it("returns values at paths", () => {
    const object = { a: [{ b: { c: 3 } }, 4] };
    expect(at(object, ["a[0].b.c", "a[1]"])).toEqual([3, 4]);
  });

  it("[🎯] returns undefined for missing paths", () => {
    expect(at({ a: 1 }, ["b"])).toEqual([undefined]);
  });

  it("handles nested array paths", () => {
    const object = { a: { b: 1 } };
    expect(at(object, [["a", "b"]])).toEqual([1]);
  });

  it("[🎯] handles empty paths array", () => {
    expect(at({ a: 1 }, [])).toEqual([]);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] returns array with same length as paths",
    (obj) => {
      const keys = Object.keys(obj);
      const result = at(obj, keys);
      expect(result.length).toBe(keys.length);
    }
  );
});
