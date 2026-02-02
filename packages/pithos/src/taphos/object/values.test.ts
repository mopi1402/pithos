import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { values } from "./values";

describe("values", () => {
  it("returns array of property values", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = values(obj);
    expect(result).toEqual([1, 2, 3]);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1 };
    const result = values(obj);
    expect(result).not.toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });

  it("[🎯] handles empty objects", () => {
    const obj = {};
    const result = values(obj);
    expect(result).toEqual([]);
  });

  it("[🎯] handles null", () => {
    const result = values(null);
    expect(result).toEqual([]);
  });

  it("[🎯] handles undefined", () => {
    const result = values(undefined);
    expect(result).toEqual([]);
  });

  it("handles arrays", () => {
    const arr = [1, 2, 3];
    const result = values(arr);
    expect(result).toEqual([1, 2, 3]);
  });

  it("handles strings", () => {
    const str = "hello";
    const result = values(str as any);
    expect(result).toEqual(["h", "e", "l", "l", "o"]);
  });

  it("handles functions", () => {
    function testFn() {}
    testFn.prop = "value";
    const result = values(testFn);
    expect(result).toEqual(["value"]);
  });

  it("handles Date objects", () => {
    const date = new Date();
    const result = values(date);
    expect(result).toEqual([]);
  });

  it("handles RegExp objects", () => {
    const regex = /test/;
    const result = values(regex);
    expect(result).toEqual([]);
  });

  it("handles Map objects", () => {
    const map = new Map();
    map.set("key", "value");
    const result = values(map);
    expect(result).toEqual([]);
  });

  it("handles Set objects", () => {
    const set = new Set();
    set.add("value");
    const result = values(set);
    expect(result).toEqual([]);
  });

  it("handles primitive values", () => {
    expect(values(42 as any)).toEqual([]);
    expect(values("hello" as any)).toEqual(["h", "e", "l", "l", "o"]);
    expect(values(true as any)).toEqual([]);
  });

  it("handles symbols as keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    const result = values(obj);
    expect(result).toEqual([]);
  });

  it("handles numeric keys", () => {
    const obj = { 0: "zero", 1: "one" };
    const result = values(obj);
    expect(result).toEqual(["zero", "one"]);
  });

  it("handles non-enumerable properties", () => {
    const obj = {};
    Object.defineProperty(obj, "hidden", {
      value: 42,
      enumerable: false,
    });
    const result = values(obj);
    expect(result).toEqual([]);
  });

  it("handles objects without prototype", () => {
    const obj = Object.create(null);
    obj.x = 42;
    obj.y = 24;
    const result = values(obj);
    expect(result).toEqual([42, 24]);
  });

  it("handles getters and setters", () => {
    const obj = {};
    Object.defineProperty(obj, "prop", {
      get() {
        return 42;
      },
      enumerable: true,
    });
    const result = values(obj);
    expect(result).toEqual([42]);
  });

  it("handles very large objects", () => {
    const obj: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      obj[`prop${i}`] = i;
    }
    const result = values(obj);
    expect(result).toHaveLength(1000);
    expect(result[0]).toBe(0);
    expect(result[999]).toBe(999);
  });

  it("[🎯] handles circular references", () => {
    const obj: Record<string, any> = {};
    obj.self = obj;
    const result = values(obj);
    expect(result).toEqual([obj]);
  });

  it("handles mixed key types", () => {
    const obj = {
      string: "value",
      42: "number",
      [Symbol("symbol")]: "symbol",
    };
    const result = values(obj);
    expect(result).toHaveLength(2);
    expect(result).toContain("value");
    expect(result).toContain("number");
  });

  it("handles objects with deleted properties", () => {
    const obj: Record<string, number> = { a: 1, b: 2 };
    delete obj.b;
    const result = values(obj);
    expect(result).toEqual([1]);
  });

  it("handles objects with properties set to undefined", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = undefined;
    const result = values(obj);
    expect(result).toEqual([1, undefined]);
  });

  it("handles objects with properties set to null", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = null;
    const result = values(obj);
    expect(result).toEqual([1, null]);
  });

  it("handles objects with properties set to false", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = false;
    const result = values(obj);
    expect(result).toEqual([1, false]);
  });

  it("handles objects with properties set to empty string", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = "";
    const result = values(obj);
    expect(result).toEqual([1, ""]);
  });

  it("handles objects with properties set to zero", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = 0;
    const result = values(obj);
    expect(result).toEqual([1, 0]);
  });

  it("handles objects with properties set to NaN", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = NaN;
    const result = values(obj);
    expect(result).toEqual([1, NaN]);
  });

  it("handles objects with properties set to Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = Infinity;
    const result = values(obj);
    expect(result).toEqual([1, Infinity]);
  });

  it("handles objects with properties set to -Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = -Infinity;
    const result = values(obj);
    expect(result).toEqual([1, -Infinity]);
  });

  it("handles objects with properties set to functions", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = () => {};
    const result = values(obj);
    expect(result).toEqual([1, obj.b]);
  });

  it("handles objects with properties set to arrays", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = [1, 2, 3];
    const result = values(obj);
    expect(result).toEqual([1, [1, 2, 3]]);
  });

  it("handles objects with properties set to objects", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = { c: 2 };
    const result = values(obj);
    expect(result).toEqual([1, { c: 2 }]);
  });

  it("handles objects with properties set to objects with prototype", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain and getters", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      get() {
        return "value";
      },
      enumerable: true,
    });
    const result = values(obj);
    expect(result).toEqual([{ b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain and setters", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      set(value) {
        this._b = value;
      },
      get() {
        return this._b;
      },
      enumerable: true,
    });
    const result = values(obj);
    expect(result).toEqual([{ b: undefined }]);
  });

  it("handles objects with properties set to objects with prototype chain and setters with value", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      set(value) {
        this._b = value;
      },
      get() {
        return this._b;
      },
      enumerable: true,
    });
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value", _b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain and setters with value and getter", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      set(value) {
        this._b = value;
      },
      get() {
        return this._b;
      },
      enumerable: true,
    });
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value", _b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain and setters with value and getter and enumerable", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      set(value) {
        this._b = value;
      },
      get() {
        return this._b;
      },
      enumerable: true,
    });
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value", _b: "value" }]);
  });

  it("handles objects with properties set to objects with prototype chain and setters with value and getter and enumerable and configurable", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    Object.defineProperty(obj.a, "b", {
      set(value) {
        this._b = value;
      },
      get() {
        return this._b;
      },
      enumerable: true,
      configurable: true,
    });
    obj.a.b = "value";
    const result = values(obj);
    expect(result).toEqual([{ b: "value", _b: "value" }]);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] is equivalent to Object.values",
    (obj) => {
      expect(values(obj)).toEqual(Object.values(obj));
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] length equals number of own properties",
    (obj) => {
      expect(values(obj).length).toBe(Object.keys(obj).length);
    }
  );
});
