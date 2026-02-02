import { describe, it, expect, vi } from "vitest";
import { memoize } from "./memoize";

describe("memoize", () => {
  it("caches results for identical arguments", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoized(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("uses custom keyResolver when provided", () => {
    const fn = vi.fn((obj: { id: number; name: string }) =>
      obj.name.toUpperCase()
    );
    const memoized = memoize(fn, (obj) => String(obj.id));

    expect(memoized({ id: 1, name: "alice" })).toBe("ALICE");
    expect(memoized({ id: 1, name: "bob" })).toBe("ALICE"); // same id = cached
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("serializes functions in default key generation", () => {
    const fn = vi.fn((callback: () => void) => callback.name);
    const memoized = memoize(fn);

    function namedFn() {}
    const anonymous = function () {}; // truly anonymous

    expect(memoized(namedFn)).toBe("namedFn");
    expect(memoized(anonymous)).toBe("anonymous"); // V8 infers from variable name
    expect(fn).toHaveBeenCalledTimes(2);

    memoized(namedFn);
    expect(fn).toHaveBeenCalledTimes(2); // cached
  });

  it("serializes symbols in default key generation", () => {
    const fn = vi.fn((s: symbol) => s.toString());
    const memoized = memoize(fn);

    const sym = Symbol("test");
    expect(memoized(sym)).toBe("Symbol(test)");
    expect(memoized(sym)).toBe("Symbol(test)");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] symbols with different descriptions have different cache keys", () => {
    const fn = vi.fn((s: symbol) => s.description);
    const memoized = memoize(fn);

    const sym1 = Symbol("foo");
    const sym2 = Symbol("bar");

    expect(memoized(sym1)).toBe("foo");
    expect(memoized(sym2)).toBe("bar");
    // If symbol serialization is removed (mutant), both would serialize to undefined/null
    // and would share the same cache key, so fn would only be called once
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("serializes functions with empty name as anonymous", () => {
    const fn = vi.fn((cb: () => void) => cb());
    const memoized = memoize(fn);

    const noName = Object.defineProperty(() => "result", "name", { value: "" });

    memoized(noName);
    memoized(noName);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] empty function name uses 'anonymous' not empty string", () => {
    const fn = vi.fn((_cb: () => void) => "result");
    const memoized = memoize(fn);

    // Create two functions with empty names - they should have identical cache keys
    // because both should serialize to [Function: anonymous]
    const noName1 = Object.defineProperty(() => {}, "name", { value: "" });
    const noName2 = Object.defineProperty(() => {}, "name", { value: "" });

    memoized(noName1);
    memoized(noName2);

    // If mutant changes "anonymous" to "", both would still have same key [Function: ]
    // But the cache entry from noName1 would be used for noName2
    // This test actually passes with either behavior...

    // Create a function named "anonymous" to match what empty name should produce
    const namedAnonymous = Object.defineProperty(() => {}, "name", {
      value: "anonymous",
    });

    // Reset the mock to test clean
    fn.mockClear();
    memoized.clear();

    memoized(noName1);
    memoized(namedAnonymous);

    // noName1 -> [Function: anonymous]
    // namedAnonymous -> [Function: anonymous]
    // They should share the same cache key, so fn called only once
    // If mutant used "", noName1 would be [Function: ] and namedAnonymous [Function: anonymous]
    // They would have different keys, fn called twice
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("clears cache when clear() is called", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);

    memoized.clear();

    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(memoized.cache.size).toBe(1);
  });

  it("deletes specific cache entry when delete() is called", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(2); // both cached

    const deleted = memoized.delete(5);
    expect(deleted).toBe(true);
    expect(memoized.cache.size).toBe(1);

    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(3); // 5 was recalculated
    expect(memoized(10)).toBe(20);
    expect(fn).toHaveBeenCalledTimes(3); // 10 still cached
  });

  it("delete returns false for non-existent entries", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized.delete(5)).toBe(false);
    expect(memoized.delete(10)).toBe(false);
  });

  it("delete works with custom keyResolver", () => {
    const fn = vi.fn((obj: { id: number; name: string }) =>
      obj.name.toUpperCase()
    );
    const memoized = memoize(fn, (obj) => String(obj.id));

    expect(memoized({ id: 1, name: "alice" })).toBe("ALICE");
    expect(memoized({ id: 2, name: "bob" })).toBe("BOB");
    expect(fn).toHaveBeenCalledTimes(2);

    const deleted = memoized.delete({ id: 1, name: "anything" });
    expect(deleted).toBe(true);
    expect(memoized.cache.size).toBe(1);

    expect(memoized({ id: 1, name: "charlie" })).toBe("CHARLIE");
    expect(fn).toHaveBeenCalledTimes(3); // recalculated for id: 1
  });

  it("delete removes entry and requires recalculation", () => {
    const fn = vi.fn((x: number) => x * x);
    const memoized = memoize(fn);

    expect(memoized(3)).toBe(9);
    expect(memoized.cache.size).toBe(1);

    memoized.delete(3);
    expect(memoized.cache.size).toBe(0);

    expect(memoized(3)).toBe(9);
    expect(memoized.cache.size).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("delete returns false when cache.delete returns undefined (tests ?? false)", () => {
    const fn = vi.fn((x: number) => x * 2);
    // Custom cache that returns undefined instead of boolean for delete
    // This tests the ?? false fallback in memoized.delete
    class CustomCache {
      private readonly map = new Map<string, number>();
      set(key: string, value: number): void {
        this.map.set(key, value);
      }
      get(key: string): number | undefined {
        return this.map.get(key);
      }
      has(key: string): boolean {
        return this.map.has(key);
      }
      delete(_key: string): void {
        // Intentionally returns void (undefined) instead of boolean
        // This tests the ?? false conversion in memoized.delete
        this.map.delete(_key);
      }
      clear(): void {
        this.map.clear();
      }
      get size(): number {
        return this.map.size;
      }
    }

    const memoized = memoize(fn, { cache: new CustomCache() });

    // Delete on non-existent key: cache.delete returns undefined, memoized.delete converts to false via ?? false
    expect(memoized.delete(5)).toBe(false);

    // Delete on existing key: cache.delete returns undefined, memoized.delete converts to false via ?? false
    memoized(5); // Cache the value
    expect(memoized.delete(5)).toBe(false); // undefined ?? false = false
  });
});
