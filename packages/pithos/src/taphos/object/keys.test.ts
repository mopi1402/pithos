import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { keys } from "./keys";

describe("keys", () => {
  it("returns array of property names", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = keys(obj);
    expect(result).toEqual(["a", "b", "c"]);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1 };
    const result = keys(obj);
    expect(result).not.toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });

  it("[🎯] handles empty objects", () => {
    const obj = {};
    const result = keys(obj);
    expect(result).toEqual([]);
  });

  it("[🎯] handles null", () => {
    const result = keys(null);
    expect(result).toEqual([]);
  });

  it("[🎯] handles undefined", () => {
    const result = keys(undefined);
    expect(result).toEqual([]);
  });

  it("handles arrays", () => {
    const arr = [1, 2, 3];
    const result = keys(arr);
    expect(result).toEqual(["0", "1", "2"]);
  });

  it("handles strings", () => {
    const str = "hello";
    const result = keys(str);
    expect(result).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("handles functions", () => {
    function testFn() {}
    testFn.prop = "value";
    const result = keys(testFn);
    expect(result).toEqual(["prop"]);
  });

  it("handles Date objects", () => {
    const date = new Date();
    const result = keys(date);
    expect(result).toEqual([]);
  });

  it("handles RegExp objects", () => {
    const regex = /test/;
    const result = keys(regex);
    expect(result).toEqual([]);
  });

  it("handles Map objects", () => {
    const map = new Map();
    map.set("key", "value");
    const result = keys(map);
    expect(result).toEqual([]);
  });

  it("handles Set objects", () => {
    const set = new Set();
    set.add("value");
    const result = keys(set);
    expect(result).toEqual([]);
  });

  it("handles primitive values", () => {
    expect(keys(42)).toEqual([]);
    expect(keys("hello")).toEqual(["0", "1", "2", "3", "4"]);
    expect(keys(true)).toEqual([]);
  });

  it("handles symbols as keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    const result = keys(obj);
    expect(result).toEqual([]);
  });

  it("handles numeric keys", () => {
    const obj = { 0: "zero", 1: "one" };
    const result = keys(obj);
    expect(result).toEqual(["0", "1"]);
  });

  it("handles non-enumerable properties", () => {
    const obj = {};
    Object.defineProperty(obj, "hidden", {
      value: 42,
      enumerable: false,
    });
    const result = keys(obj);
    expect(result).toEqual([]);
  });

  it("handles objects without prototype", () => {
    const obj = Object.create(null);
    obj.x = 42;
    obj.y = 24;
    const result = keys(obj);
    expect(result).toEqual(["x", "y"]);
  });

  it("handles getters and setters", () => {
    const obj = {};
    Object.defineProperty(obj, "prop", {
      get() {
        return 42;
      },
      enumerable: true,
    });
    const result = keys(obj);
    expect(result).toEqual(["prop"]);
  });

  it("handles very large objects", () => {
    const obj: Record<string, any> = {};
    for (let i = 0; i < 1000; i++) {
      obj[`prop${i}`] = i;
    }
    const result = keys(obj);
    expect(result).toHaveLength(1000);
    expect(result[0]).toBe("prop0");
    expect(result[999]).toBe("prop999");
  });

  it("[🎯] handles circular references", () => {
    const obj: Record<string, any> = {};
    obj.self = obj;
    const result = keys(obj);
    expect(result).toEqual(["self"]);
  });

  it("handles mixed key types", () => {
    const obj = {
      string: "value",
      42: "number",
      [Symbol("symbol")]: "symbol",
    };
    const result = keys(obj);
    expect(result).toHaveLength(2);
    expect(result).toContain("string");
    expect(result).toContain("42");
  });

  it("handles objects with deleted properties", () => {
    const obj: Record<string, any> = { a: 1, b: 2 };
    delete obj.b;
    const result = keys(obj);
    expect(result).toEqual(["a"]);
  });

  it("handles objects with properties set to undefined", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = undefined;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to null", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = null;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to false", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = false;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to empty string", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = "";
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to zero", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = 0;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to NaN", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = NaN;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = Infinity;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to -Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = -Infinity;
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to functions", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = () => {};
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to arrays", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = [1, 2, 3];
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to objects", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = { c: 2 };
    const result = keys(obj);
    expect(result).toEqual(["a", "b"]);
  });

  it("handles objects with properties set to objects with prototype", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = keys(obj);
    expect(result).toEqual(["a"]);
  });

  it("handles objects with properties set to objects with prototype chain", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
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
    const result = keys(obj);
    expect(result).toEqual(["a"]);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] is equivalent to Object.keys",
    (obj) => {
      expect(keys(obj)).toEqual(Object.keys(obj));
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] length equals number of own properties",
    (obj) => {
      expect(keys(obj).length).toBe(Object.keys(obj).length);
    }
  );
});
