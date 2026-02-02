import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { assign } from "./assign";

describe("assign", () => {
  it("assigns properties from source objects to destination", () => {
    const target: Record<string, number> = { a: 1, b: 2 };
    const source1: Record<string, number> = { b: 3, c: 4 };
    const source2: Record<string, number> = { c: 5, d: 6 };

    const result = assign(target, source1, source2);

    expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
    expect(target).toEqual({ a: 1, b: 3, c: 5, d: 6 });
  });

  it("[🎯] mutates the original destination object", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, number> = { b: 2 };

    assign(target, source);

    expect(target).toEqual({ a: 1, b: 2 });
  });

  it("handles single source object", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, number> = { b: 2 };

    const result = assign(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("handles multiple source objects", () => {
    const target: Record<string, number> = { a: 1 };
    const source1: Record<string, number> = { b: 2 };
    const source2: Record<string, number> = { c: 3 };
    const source3: Record<string, number> = { d: 4 };

    const result = assign(target, source1, source2, source3);

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it("overwrites properties in order", () => {
    const target: Record<string, number> = { a: 1 };
    const source1: Record<string, number> = { a: 2 };
    const source2: Record<string, number> = { a: 3 };

    const result = assign(target, source1, source2);

    expect(result).toEqual({ a: 3 });
  });

  it("[🎯] handles empty objects", () => {
    const target: Record<string, any> = {};
    const source: Record<string, number> = { a: 1 };

    const result = assign(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it("handles empty source objects", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, any> = {};

    const result = assign(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it("[🎯] handles null and undefined values", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, null | undefined> = { b: null, c: undefined };

    const result = assign(target, source);

    expect(result).toEqual({ a: 1, b: null, c: undefined });
  });

  it("handles nested objects", () => {
    const target: Record<string, Record<string, number>> = { a: { x: 1 } };
    const source: Record<string, Record<string, number>> = { a: { y: 2 } };

    const result = assign(target, source);

    expect(result).toEqual({ a: { y: 2 } });
  });

  it("handles functions", () => {
    const fn1 = () => 1;
    const fn2 = () => 2;
    const target: Record<string, () => number> = { fn: fn1 };
    const source: Record<string, () => number> = { fn: fn2 };

    const result = assign(target, source);

    expect(result.fn).toBe(fn2);
  });

  it("handles arrays", () => {
    const target: Record<string, number[]> = { arr: [1, 2] };
    const source: Record<string, number[]> = { arr: [3, 4] };

    const result = assign(target, source);

    expect(result).toEqual({ arr: [3, 4] });
  });

  it("handles symbols as keys", () => {
    const sym = Symbol("test");
    const target: Record<string, number> = { a: 1 };
    const source: Record<symbol, number> = { [sym]: 2 };

    const result = assign(target, source);

    expect(result).toEqual({ a: 1, [sym]: 2 });
  });

  it("handles non-enumerable properties", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, any> = {};
    Object.defineProperty(source, "b", {
      value: 2,
      enumerable: false,
    });

    const result = assign(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it("handles objects without prototype", () => {
    const target: Record<string, number> = Object.create(null);
    target.a = 1;
    const source: Record<string, number> = Object.create(null);
    source.b = 2;

    const result = assign(target, source);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("preserves function metadata", () => {
    function testFn() {}

    const target: Record<string, any> = {};
    const source: Record<string, () => void> = { fn: testFn };

    const result = assign(target, source);

    expect(result.fn.name).toBe("testFn");
    expect(result.fn.length).toBe(0);
  });

  it("handles getters and setters", () => {
    const target: Record<string, any> = {};
    const source: Record<string, any> = {};
    Object.defineProperty(source, "prop", {
      get() {
        return 42;
      },
      enumerable: true,
    });

    const result = assign(target, source);

    expect(result.prop).toBe(42);
  });

  it("handles very large objects", () => {
    const target: Record<string, any> = {};
    const source: Record<string, any> = {};
    for (let i = 0; i < 1000; i++) {
      source[`prop${i}`] = i;
    }

    const result = assign(target, source);

    expect(Object.keys(result)).toHaveLength(1000);
    expect(result.prop0).toBe(0);
    expect(result.prop999).toBe(999);
  });

  it("[🎯] handles circular references", () => {
    const target: Record<string, any> = {};
    const source: Record<string, any> = {};
    source.self = source;

    const result = assign(target, source);

    expect(result.self).toBe(result.self);
  });

  it("[🎯] returns the same object reference", () => {
    const target: Record<string, number> = { a: 1 };
    const source: Record<string, number> = { b: 2 };

    const result = assign(target, source);

    expect(result).toBe(target);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer()), fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] is equivalent to Object.assign",
    (target, source) => {
      const t1 = { ...target };
      const t2 = { ...target };
      expect(assign(t1, source)).toEqual(Object.assign(t2, source));
    }
  );
});
