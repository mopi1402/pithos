import { describe, it, expect } from "vitest";
import { unset } from "./unset";

describe("unset", () => {
  it("removes property at path", () => {
    const result = unset({ a: { b: { c: 3 } } }, "a.b.c");
    expect(result).toEqual({ a: { b: {} } });
  });

  it("[🎯] returns new object (immutable)", () => {
    const original = { a: 1 };
    const result = unset(original, "a");
    expect(result).not.toBe(original);
    expect(original.a).toBe(1);
  });

  it("handles array path", () => {
    const result = unset({ a: { b: 1 } }, ["a", "b"]);
    expect(result).toEqual({ a: {} });
  });

  it("[🎯] handles empty path", () => {
    const original = { a: 1 };
    const result = unset(original, "");
    expect(result).toEqual({ a: 1 });
    // Verify it returns the original object for empty path (optimization)
    expect(result).toBe(original);
  });

  it("[👾] empty array path returns original object", () => {
    const original = { a: 1 };
    const result = unset(original, []);
    expect(result).toBe(original);
  });

  it("[🎯] handles missing path gracefully", () => {
    const result = unset({ a: 1 }, "b.c.d");
    expect(result).toEqual({ a: 1 });
  });

  it("[🎯] returns object when object is null", () => {
    expect(unset(null as unknown as object, "a")).toBe(null);
  });

  it("[🎯] returns object when object is undefined", () => {
    expect(unset(undefined as unknown as object, "a")).toBe(undefined);
  });

  it("uses deepClone when path contains symbol", () => {
    const sym = Symbol("test");
    const object = { a: { [sym]: { b: 1 } } };
    const result = unset(object, ["a", sym, "b"]);
    expect(result).toEqual({ a: { [sym]: {} } });
    expect(result).not.toBe(object);
  });

  it("[👾] uses structuredClone when path has no symbols", () => {
    // This test verifies that structuredClone is used for non-symbol paths
    // structuredClone doesn't preserve symbols, so we can detect which clone method was used
    const sym = Symbol("extra");
    const object = { a: { b: 1 }, [sym]: "preserved" };
    const result = unset(object, "a.b");
    // structuredClone loses symbols, so the symbol property should be gone
    expect(result[sym as keyof typeof result]).toBeUndefined();
  });

  it("[👾] handles path through non-object value", () => {
    // When traversing through a non-object (like a number), should return early
    const object = { a: 5 };
    const result = unset(object, "a.b.c");
    expect(result).toEqual({ a: 5 });
  });

  it("[👾] handles path through null value", () => {
    const object = { a: null };
    const result = unset(object as { a: null | { b: number } }, "a.b");
    expect(result).toEqual({ a: null });
  });
});
