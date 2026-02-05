import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { set } from "./set";

describe("set", () => {
  it("sets value at simple path", () => {
    expect(set({ a: 1 }, "b", 2)).toEqual({ a: 1, b: 2 });
  });

  it("sets value at nested string path", () => {
    expect(set({ a: { b: 1 } }, "a.c", 2)).toEqual({ a: { b: 1, c: 2 } });
  });

  it("sets value at array path", () => {
    expect(set({ a: 1 }, ["b", "c"], 2)).toEqual({ a: 1, b: { c: 2 } });
  });

  it("creates intermediate objects", () => {
    expect(set({}, "a.b.c", 1)).toEqual({ a: { b: { c: 1 } } });
  });

  it("creates intermediate arrays for numeric keys", () => {
    const result = set({}, "a.0.b", 1);
    expect(result).toEqual({ a: [{ b: 1 }] });
  });

  it("handles array index in string path", () => {
    expect(set({ a: [{ b: 1 }] }, "a.0.b", 2)).toEqual({ a: [{ b: 2 }] });
  });

  it("handles symbol keys", () => {
    const s = Symbol("s");
    expect(set({ a: 1 }, s, 2)).toEqual({ a: 1, [s]: 2 });
  });

  it("returns value when object is null", () => {
    expect(set(null, "a", 1)).toBe(1);
  });

  it("returns value when object is undefined", () => {
    expect(set(undefined, "a", 1)).toBe(1);
  });

  it("returns value when path is empty", () => {
    expect(set({ a: 1 }, [], 2)).toBe(2);
  });

  it("overwrites existing value", () => {
    expect(set({ a: { b: 1 } }, "a.b", 2)).toEqual({ a: { b: 2 } });
  });

  it("does not mutate original object", () => {
    const obj = { a: { b: 1 } };
    set(obj, "a.b", 2);
    expect(obj).toEqual({ a: { b: 1 } });
  });

  it("overwrites primitive with object when needed", () => {
    expect(set({ a: 1 }, "a.b", 2)).toEqual({ a: { b: 2 } });
  });

  it("uses deepClone when path contains symbol", () => {
    const sym = Symbol("test");
    const obj = { a: { b: 1 } };
    const result = set(obj, ["a", sym, "c"], 2);
    expect(result).toEqual({ a: { b: 1, [sym]: { c: 2 } } });
    expect(result.a).not.toBe(obj.a);
  });

  it("uses structuredClone when path has no symbol", () => {
    const obj = { a: { b: 1 } };
    const result = set(obj, "a.c", 2);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
    expect(result.a).not.toBe(obj.a);
  });

  // Mutation tests
  it("[👾] handles null intermediate value", () => {
    const result = set({ a: null }, "a.b", 1);
    expect(result).toEqual({ a: { b: 1 } });
  });

  it("[👾] creates array for string numeric key", () => {
    const result = set({} as { a: unknown[] }, ["a", "0", "b"], 1);
    expect(result).toEqual({ a: [{ b: 1 }] });
    expect(Array.isArray(result.a)).toBe(true);
  });

  it("[👾] creates object for non-numeric string key starting with digit", () => {
    const result = set({} as { a: Record<string, unknown> }, "a.1a.b", 1);
    expect(result).toEqual({ a: { "1a": { b: 1 } } });
    expect(Array.isArray(result.a)).toBe(false);
  });

  it("[👾] creates object for non-numeric string key ending with digit", () => {
    const result = set({} as { a: Record<string, unknown> }, "a.a1.b", 1);
    expect(result).toEqual({ a: { a1: { b: 1 } } });
    expect(Array.isArray(result.a)).toBe(false);
  });

  it("[👾] creates array for multi-digit string key", () => {
    const result = set({} as { a: unknown[] }, "a.12.b", 1);
    expect(Array.isArray(result.a)).toBe(true);
    expect(result.a[12]).toEqual({ b: 1 });
  });

  it("[👾] creates empty array for numeric index > 0", () => {
    const result = set(
      {} as { a: Array<{ b: number } | undefined> },
      "a.1.b",
      1
    );
    expect(result.a[0]).toBeUndefined();
    expect(result.a[1]).toEqual({ b: 1 });
    expect(result.a).toHaveLength(2);
  });

  it("[👾] creates array for multi-digit string key", () => {
    const result = set({} as { a: unknown[] }, ["a", "12", "b"], 1);
    expect(Array.isArray(result.a)).toBe(true);
    expect(result.a[12]).toEqual({ b: 1 });
    expect(result.a[12]).toEqual({ b: 1 });
  });

  it("[👾] creates array for key '9' via array path", () => {
    // Kills isAllDigits mutant c > 57 → c >= 57 (charCode of '9' is 57)
    const result = set({} as { a: unknown[] }, ["a", "9", "b"], 1);
    expect(Array.isArray(result.a)).toBe(true);
    expect(result.a[9]).toEqual({ b: 1 });
  });

  it("[👾] replaces null intermediate via array path", () => {
    // Kills current[key] == null || typeof ... mutants in the array-path loop
    const result = set({ a: null } as unknown as { a: { b: number } }, ["a", "b"], 1);
    expect(result).toEqual({ a: { b: 1 } });
  });

  it("[👾] replaces primitive intermediate via array path", () => {
    // Kills current[key] == null || false mutant — typeof "string" !== "object" must trigger
    const result = set({ a: "str" } as unknown as { a: { b: number } }, ["a", "b"], 1);
    expect(result).toEqual({ a: { b: 1 } });
  });

  it("[🎯] empty string key in array path creates object (isAllDigits guard)", () => {
    const result = set({}, ["a", "", "b"], 1);
    expect(result).toEqual({ a: { "": { b: 1 } } });
  });

  itProp.prop([
    fc.dictionary(fc.string(), fc.integer()),
    fc.string(),
    fc.integer(),
  ])("[🎲] does not mutate original object (simple)", (obj, path, value) => {
    const original = { ...obj };
    set(obj, path, value);
    expect(obj).toEqual(original);
  });
});
