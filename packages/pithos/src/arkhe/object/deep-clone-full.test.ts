import { describe, it, expect } from "vitest";
import { deepCloneFull } from "./deep-clone-full";

describe("deepCloneFull", () => {
  it("returns primitives and functions as-is", () => {
    expect(deepCloneFull(null)).toBeNull();
    expect(deepCloneFull(undefined)).toBeUndefined();
    expect(deepCloneFull(42)).toBe(42);
    expect(deepCloneFull("str")).toBe("str");
    expect(deepCloneFull(true)).toBe(true);
    const sym = Symbol();
    expect(deepCloneFull(sym)).toBe(sym);
    const fn = () => {};
    expect(deepCloneFull(fn)).toBe(fn);
  });

  it("clones arrays deeply", () => {
    // INTENTIONAL test for sparse arrays
    // eslint-disable-next-line no-sparse-arrays
    const arr = [[1], , [2]];
    const cloned = deepCloneFull(arr);
    expect(cloned).toEqual(arr);
    expect(cloned[0]).not.toBe(arr[0]);
    expect(1 in cloned).toBe(false);
  });

  it("clones plain objects with symbol keys and null prototype", () => {
    const sym = Symbol();
    const nullProto = Object.create(null);
    nullProto.x = 1;
    const obj = { a: { b: 1 }, [sym]: nullProto };
    const cloned = deepCloneFull(obj);
    expect(cloned.a).toEqual(obj.a);
    expect(cloned.a).not.toBe(obj.a);
    expect(Object.getPrototypeOf(cloned[sym])).toBeNull();
  });

  it("handles circular references", () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    const cloned = deepCloneFull(obj);
    expect(cloned.self).toBe(cloned);
    expect(cloned.self).not.toBe(obj);
  });

  it("clones ArrayBuffer and SharedArrayBuffer", () => {
    const ab = new ArrayBuffer(4);
    new Uint8Array(ab).set([1, 2, 3, 4]);
    expect(new Uint8Array(deepCloneFull(ab))).toEqual(new Uint8Array(ab));

    const sab = new SharedArrayBuffer(4);
    new Uint8Array(sab).set([5, 6, 7, 8]);
    expect(new Uint8Array(deepCloneFull(sab))).toEqual(new Uint8Array(sab));
  });

  it("clones TypedArrays with offset", () => {
    const buffer = new ArrayBuffer(16);
    new Uint8Array(buffer).set([0, 0, 0, 0, 1, 2, 3, 4]);
    const view = new Uint8Array(buffer, 4, 4);
    const cloned = deepCloneFull(view);
    expect(Array.from(cloned)).toEqual([1, 2, 3, 4]);
    expect(cloned.byteOffset).toBe(0);
    view[0] = 99;
    expect(cloned[0]).toBe(1);
  });

  it("clones DataView with offset", () => {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer, 4, 8);
    view.setInt32(0, 42);
    const cloned = deepCloneFull(view);
    expect(cloned.getInt32(0)).toBe(42);
    expect(cloned.byteOffset).toBe(0);
  });

  it("clones Buffer", () => {
    const buf = Buffer.from([1, 2, 3]);
    const cloned = deepCloneFull(buf);
    expect(Buffer.isBuffer(cloned)).toBe(true);
    expect(cloned).toEqual(buf);
  });

  it("clones Blob and File", () => {
    const blob = new Blob(["x"], { type: "text/plain" });
    expect(deepCloneFull(blob).type).toBe("text/plain");

    const file = new File(["x"], "f.txt", { lastModified: 123 });
    const clonedFile = deepCloneFull(file);
    expect(clonedFile.name).toBe("f.txt");
    expect(clonedFile.lastModified).toBe(123);
  });

  it("clones boxed primitives", () => {
    expect(deepCloneFull(new Boolean(true)).valueOf()).toBe(true);
    expect(deepCloneFull(new Number(42)).valueOf()).toBe(42);
    expect(deepCloneFull(new String("s")).valueOf()).toBe("s");
  });

  it("clones Date and RegExp", () => {
    const date = new Date(1000);
    expect(deepCloneFull(date).getTime()).toBe(1000);

    const regex = /a/g;
    regex.lastIndex = 5;
    const cloned = deepCloneFull(regex);
    expect(cloned.flags).toBe("g");
    expect(cloned.lastIndex).toBe(5);
  });

  it("clones Map and Set deeply with circular refs", () => {
    const map = new Map<unknown, unknown>([[{ k: 1 }, { v: 2 }]]);
    map.set("self", map);
    const clonedMap = deepCloneFull(map);
    expect(clonedMap.get("self")).toBe(clonedMap);

    const set = new Set([{ a: 1 }]);
    const clonedSet = deepCloneFull(set);
    expect(Array.from(clonedSet)[0]).toEqual({ a: 1 });
  });

  it("clones Error and subclasses", () => {
    const err = new TypeError("msg");
    const cloned = deepCloneFull(err);
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
    const cloned = deepCloneFull(new Foo(42));
    expect(cloned).toBeInstanceOf(Foo);
    expect(cloned.get()).toBe(42);
  });

  it("[👾] clones nested primitives and null values", () => {
    const obj = { a: 42, b: null, c: "str" };
    const cloned = deepCloneFull(obj);
    expect(cloned.a).toBe(42);
    expect(cloned.b).toBeNull();
    expect(cloned.c).toBe("str");
  });

  it("[👾] plain object clone has Object prototype", () => {
    const obj = { x: 1 };
    const cloned = deepCloneFull(obj);
    expect(Object.getPrototypeOf(cloned)).toBe(Object.prototype);
  });

  it("[👾] ArrayBuffer clone is independent from source", () => {
    const ab = new ArrayBuffer(4);
    const view = new Uint8Array(ab);
    view.set([1, 2, 3, 4]);
    const cloned = deepCloneFull(ab);
    view[0] = 99;
    expect(new Uint8Array(cloned)[0]).toBe(1);
  });

  it("[👾] SharedArrayBuffer clone is independent from source", () => {
    const sab = new SharedArrayBuffer(4);
    const view = new Uint8Array(sab);
    view.set([1, 2, 3, 4]);
    const cloned = deepCloneFull(sab);
    view[0] = 99;
    expect(new Uint8Array(cloned)[0]).toBe(1);
  });

  it("[👾] DataView with non-zero offset clones correct slice", () => {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer, 8, 4);
    view.setUint8(0, 42);
    view.setUint8(3, 99);
    const cloned = deepCloneFull(view);
    expect(cloned.byteLength).toBe(4);
    expect(cloned.getUint8(0)).toBe(42);
    expect(cloned.getUint8(3)).toBe(99);
  });

  it("[👾] Blob clone has callable slice method", async () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    const cloned = deepCloneFull(blob);
    const sliced = cloned.slice(0, 2);
    expect(sliced).toBeInstanceOf(Blob);
    expect(await sliced.text()).toBe("he");
  });

  it("[👾] File clone has callable text method", async () => {
    const file = new File(["hello"], "test.txt");
    const cloned = deepCloneFull(file);
    expect(await cloned.text()).toBe("hello");
  });
});
