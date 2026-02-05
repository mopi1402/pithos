import { describe, it, expect, vi } from "vitest";
import { memoize } from "./memoize";

describe("memoize", () => {
  it("caches results based on the first argument", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoized(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("uses first argument as cache key by default (ignores subsequent args)", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    // Same first arg, different second arg → returns cached result
    expect(memoized(1, 99)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("uses custom keyResolver when provided as function", () => {
    const fn = vi.fn((obj: { id: number; name: string }) =>
      obj.name.toUpperCase()
    );
    const memoized = memoize(fn, (obj) => obj.id);

    expect(memoized({ id: 1, name: "alice" })).toBe("ALICE");
    expect(memoized({ id: 1, name: "bob" })).toBe("ALICE"); // same id = cached
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("uses custom keyResolver when provided in options", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn, {
      keyResolver: (a, b) => `${a},${b}`,
    });

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    // Different second arg → different key → recomputed
    expect(memoized(1, 99)).toBe(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("uses reference equality for object arguments", () => {
    const fn = vi.fn((obj: { x: number }) => obj.x * 2);
    const memoized = memoize(fn);

    const obj = { x: 5 };
    expect(memoized(obj)).toBe(10);
    expect(memoized(obj)).toBe(10); // same reference = cached
    expect(fn).toHaveBeenCalledTimes(1);

    // Different reference, same shape → recomputed
    expect(memoized({ x: 5 })).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("handles function arguments by reference", () => {
    const fn = vi.fn((callback: () => void) => callback.name);
    const memoized = memoize(fn);

    function namedFn() {}
    const anonymous = function () {};

    expect(memoized(namedFn)).toBe("namedFn");
    expect(memoized(anonymous)).toBe("anonymous");
    expect(fn).toHaveBeenCalledTimes(2);

    memoized(namedFn);
    expect(fn).toHaveBeenCalledTimes(2); // cached
  });

  it("handles symbol arguments by reference", () => {
    const fn = vi.fn((s: symbol) => s.toString());
    const memoized = memoize(fn);

    const sym = Symbol("test");
    expect(memoized(sym)).toBe("Symbol(test)");
    expect(memoized(sym)).toBe("Symbol(test)");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("distinguishes different symbols", () => {
    const fn = vi.fn((s: symbol) => s.description);
    const memoized = memoize(fn);

    const sym1 = Symbol("foo");
    const sym2 = Symbol("bar");

    expect(memoized(sym1)).toBe("foo");
    expect(memoized(sym2)).toBe("bar");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("handles primitive arguments with value equality", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10); // same value = cached
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoized(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("correctly caches undefined return values", () => {
    const fn = vi.fn((_x: number) => undefined);
    const memoized = memoize(fn);

    expect(memoized(1)).toBeUndefined();
    expect(memoized(1)).toBeUndefined();
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
    const memoized = memoize(fn, (obj) => obj.id);

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
    class CustomCache {
      private readonly map = new Map<unknown, number>();
      set(key: unknown, value: number): void {
        this.map.set(key, value);
      }
      get(key: unknown): number | undefined {
        return this.map.get(key);
      }
      has(key: unknown): boolean {
        return this.map.has(key);
      }
      delete(_key: unknown): void {
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

    expect(memoized.delete(5)).toBe(false);

    memoized(5);
    expect(memoized.delete(5)).toBe(false); // undefined ?? false = false
  });

  it("preserves this binding", () => {
    const fn = function (this: { multiplier: number }, x: number) {
      return x * this.multiplier;
    };
    const memoized = memoize(fn);

    const obj = { multiplier: 3, compute: memoized };
    expect(obj.compute(5)).toBe(15);
  });

  it("exposes cache property", () => {
    const fn = (x: number) => x * 2;
    const memoized = memoize(fn);

    memoized(5);
    expect(memoized.cache.size).toBe(1);
    expect(memoized.cache.has(5)).toBe(true);
    expect(memoized.cache.get(5)).toBe(10);
  });

  it("supports custom cache implementation", () => {
    class LimitedCache<K, V> {
      private readonly map = new Map<K, V>();
      private readonly limit: number;
      constructor(limit: number) {
        this.limit = limit;
      }
      set(key: K, value: V): void {
        if (this.map.size >= this.limit) {
          const firstKey = this.map.keys().next().value;
          if (firstKey !== undefined) this.map.delete(firstKey);
        }
        this.map.set(key, value);
      }
      get(key: K): V | undefined {
        return this.map.get(key);
      }
      has(key: K): boolean {
        return this.map.has(key);
      }
      delete(key: K): boolean {
        return this.map.delete(key);
      }
      clear(): void {
        this.map.clear();
      }
      get size(): number {
        return this.map.size;
      }
    }

    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn, { cache: new LimitedCache(2) });

    memoized(1);
    memoized(2);
    memoized(3); // evicts 1

    expect(memoized.cache.size).toBe(2);
    expect(memoized.cache.has(1)).toBe(false);
    expect(memoized.cache.has(2)).toBe(true);
    expect(memoized.cache.has(3)).toBe(true);
  });
});
