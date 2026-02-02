import { describe, it, expect } from "vitest";
import { deepClone } from "./deep-clone";

describe("deepClone", () => {
  it("returns primitives and functions as-is", () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
    expect(deepClone(42)).toBe(42);
    expect(deepClone("str")).toBe("str");
    expect(deepClone(true)).toBe(true);
    const sym = Symbol();
    expect(deepClone(sym)).toBe(sym);
    const fn = () => {};
    expect(deepClone(fn)).toBe(fn);
  });

  it("clones arrays deeply with sparse support", () => {
    // INTENTIONAL test for sparse arrays
    // eslint-disable-next-line no-sparse-arrays
    const arr = [[1], , [2]];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned[0]).not.toBe(arr[0]);
    expect(1 in cloned).toBe(false);
  });

  it("clones plain objects with symbol keys and null prototype", () => {
    const sym = Symbol();
    const nullProto = Object.create(null);
    nullProto.x = 1;
    const obj = { a: { b: 1 }, [sym]: nullProto };
    const cloned = deepClone(obj);
    expect(cloned.a).toEqual(obj.a);
    expect(cloned.a).not.toBe(obj.a);
    expect(Object.getPrototypeOf(cloned[sym])).toBeNull();
  });

  it("handles circular references", () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    const cloned = deepClone(obj);
    expect(cloned.self).toBe(cloned);
    expect(cloned.self).not.toBe(obj);
  });

  it("clones Date and RegExp", () => {
    const date = new Date(1000);
    expect(deepClone(date).getTime()).toBe(1000);

    const regex = /a/g;
    regex.lastIndex = 5;
    const cloned = deepClone(regex);
    expect(cloned.flags).toBe("g");
    expect(cloned.lastIndex).toBe(5);
  });

  it("clones Map with circular refs", () => {
    const map = new Map<string, unknown>();
    map.set("self", map);
    const clonedMap = deepClone(map);
    expect(clonedMap.get("self")).toBe(clonedMap);
  });

  it("clones Map keys deeply", () => {
    const key = { k: 1 };
    const map = new Map([[key, { v: 2 }]]);
    const clonedMap = deepClone(map);
    const clonedKey = [...clonedMap.keys()][0];
    expect(clonedKey).toEqual({ k: 1 });
    expect(clonedKey).not.toBe(key);
  });

  it("clones Error and subclasses", () => {
    const err = new TypeError("msg");
    const cloned = deepClone(err);
    expect(cloned).toBeInstanceOf(TypeError);
    expect(cloned.message).toBe("msg");
  });

  it("clones custom classes preserving prototype", () => {
    class Foo {
      constructor(public x: number) {}
      get() {
        return this.x;
      }
    }
    const cloned = deepClone(new Foo(42));
    expect(cloned).toBeInstanceOf(Foo);
    expect(cloned.get()).toBe(42);
  });
  it("clones Set with deep elements", () => {
    const inner = { a: 1 };
    const set = new Set([inner, { b: 2 }]);
    const result = deepClone(set);

    const values = [...result];
    expect(values).toHaveLength(2);
    expect(values[0]).toEqual({ a: 1 });
    expect(values[0]).not.toBe(inner);
    expect(values[1]).toEqual({ b: 2 });
  });

  it("handles circular references in Set", () => {
    const set = new Set<unknown>();
    set.add(set);
    const result = deepClone(set);
    expect([...result][0]).toBe(result);
  });

  it("[👾] clones nested null values correctly", () => {
    const obj = { a: { b: null } };
    const cloned = deepClone(obj);
    expect(cloned.a.b).toBeNull();
  });

  it("[👾] plain object clone has Object prototype", () => {
    const obj = { x: 1 };
    const cloned = deepClone(obj);
    expect(Object.getPrototypeOf(cloned)).toBe(Object.prototype);
  });
});
