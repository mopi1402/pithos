import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { defaultsDeep } from "./defaults-deep";

describe("defaultsDeep", () => {
  // Core behavior
  it("assigns deep defaults for undefined values", () => {
    const target = { a: { b: undefined, c: 3 } };
    const source = { a: { b: 2, d: 4 }, e: 5 };

    expect(defaultsDeep(target, source)).toEqual({
      a: { b: 2, c: 3, d: 4 },
      e: 5,
    });
  });

  it("does not override defined values", () => {
    const result = defaultsDeep({ a: { b: 1 } }, { a: { b: 2 } });
    expect(result).toEqual({ a: { b: 1 } });
  });

  it("recurses if both are plain objects", () => {
    const result = defaultsDeep({ a: { c: 3 } }, { a: { b: 2 } });
    expect(result).toEqual({ a: { b: 2, c: 3 } });
  });

  it("handles deeply nested objects", () => {
    const result = defaultsDeep(
      { a: { b: { c: undefined } } },
      { a: { b: { c: { d: 1 } } } }
    );
    expect(result).toEqual({ a: { b: { c: { d: 1 } } } });
  });

  // Edge cases - @note behaviors
  it("[🎯] preserves null values in destination", () => {
    const result = defaultsDeep({ a: { b: null } }, { a: { b: "fallback" } });
    expect(result).toEqual({ a: { b: null } });
  });

  it("[🎯] replaces arrays instead of merging", () => {
    const result = defaultsDeep({ items: undefined }, { items: [1, 2] });
    expect(result).toEqual({ items: [1, 2] });
  });

  // Edge cases - boundaries
  it("[🎯] returns clone of target when no sources provided", () => {
    const target = { a: 1 };
    const result = defaultsDeep(target);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(target);
  });

  it("[🎯] handles empty target", () => {
    const result = defaultsDeep({}, { a: { b: 2 } });
    expect(result).toEqual({ a: { b: 2 } });
  });

  // Mutation tests
  it("[👾] does not recurse when target value is primitive", () => {
    const result = defaultsDeep({ a: 1 }, { a: { b: 2 } });
    expect(result.a).toBe(1);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] result is independent from source mutations",
    (source) => {
      const target = { existing: "value" };
      const result = defaultsDeep(target, source);

      for (const key of Object.keys(source)) {
        source[key] = "mutated";
      }
      expect(result.existing).toBe("value");
    }
  );

  itProp.prop([
    fc.dictionary(fc.string(), fc.anything()),
    fc.dictionary(fc.string(), fc.anything()),
  ])("[🎲] does not mutate target", (target, source) => {
    const original = structuredClone(target);
    defaultsDeep(target, source);
    expect(target).toEqual(original);
  });
});
