import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toPairs } from "./toPairs";

describe("toPairs", () => {
  it("converts object to array of key-value pairs", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1 };
    const result = toPairs(obj);
    expect(result).not.toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });

  it("[🎯] handles empty objects", () => {
    const obj = {};
    const result = toPairs(obj);
    expect(result).toEqual([]);
  });

  it("[🎯] handles null", () => {
    const result = toPairs(null);
    expect(result).toEqual([]);
  });

  it("[🎯] handles undefined", () => {
    const result = toPairs(undefined);
    expect(result).toEqual([]);
  });

  it("handles arrays", () => {
    const arr = [1, 2, 3];
    const result = toPairs(arr);
    expect(result).toEqual([
      ["0", 1],
      ["1", 2],
      ["2", 3],
    ]);
  });

  it("handles strings", () => {
    const str = "hello";
    const result = toPairs(str);
    expect(result).toEqual([
      ["0", "h"],
      ["1", "e"],
      ["2", "l"],
      ["3", "l"],
      ["4", "o"],
    ]);
  });

  it("handles functions", () => {
    function testFn() {}
    testFn.prop = "value";
    const result = toPairs(testFn);
    expect(result).toEqual([["prop", "value"]]);
  });

  it("handles Date objects", () => {
    const date = new Date();
    const result = toPairs(date);
    expect(result).toEqual([]);
  });

  it("handles RegExp objects", () => {
    const regex = /test/;
    const result = toPairs(regex);
    expect(result).toEqual([]);
  });

  it("handles Map objects", () => {
    const map = new Map();
    map.set("key", "value");
    const result = toPairs(map);
    expect(result).toEqual([]);
  });

  it("handles Set objects", () => {
    const set = new Set();
    set.add("value");
    const result = toPairs(set);
    expect(result).toEqual([]);
  });

  it("handles primitive values", () => {
    expect(toPairs(42)).toEqual([]);
    expect(toPairs("hello")).toEqual([
      ["0", "h"],
      ["1", "e"],
      ["2", "l"],
      ["3", "l"],
      ["4", "o"],
    ]);
    expect(toPairs(true)).toEqual([]);
  });

  it("handles symbols as keys", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    const result = toPairs(obj);
    expect(result).toEqual([]);
  });

  it("handles numeric keys", () => {
    const obj = { 0: "zero", 1: "one" };
    const result = toPairs(obj);
    expect(result).toEqual([
      ["0", "zero"],
      ["1", "one"],
    ]);
  });

  it("handles non-enumerable properties", () => {
    const obj = {};
    Object.defineProperty(obj, "hidden", {
      value: 42,
      enumerable: false,
    });
    const result = toPairs(obj);
    expect(result).toEqual([]);
  });

  it("handles objects without prototype", () => {
    const obj = Object.create(null);
    obj.x = 42;
    obj.y = 24;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["x", 42],
      ["y", 24],
    ]);
  });

  it("handles getters and setters", () => {
    const obj = {};
    Object.defineProperty(obj, "prop", {
      get() {
        return 42;
      },
      enumerable: true,
    });
    const result = toPairs(obj);
    expect(result).toEqual([["prop", 42]]);
  });

  it("handles very large objects", () => {
    const obj: Record<string, any> = {};
    for (let i = 0; i < 1000; i++) {
      obj[`prop${i}`] = i;
    }
    const result = toPairs(obj);
    expect(result).toHaveLength(1000);
    expect(result[0]).toEqual(["prop0", 0]);
    expect(result[999]).toEqual(["prop999", 999]);
  });

  it("[🎯] handles circular references", () => {
    const obj: Record<string, any> = {};
    obj.self = obj;
    const result = toPairs(obj);
    expect(result).toEqual([["self", obj]]);
  });

  it("handles mixed key types", () => {
    const obj = {
      string: "value",
      42: "number",
      [Symbol("symbol")]: "symbol",
    };
    const result = toPairs(obj);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(["string", "value"]);
    expect(result).toContainEqual(["42", "number"]);
  });

  it("handles objects with deleted properties", () => {
    const obj: Record<string, any> = { a: 1, b: 2 };
    delete obj.b;
    const result = toPairs(obj);
    expect(result).toEqual([["a", 1]]);
  });

  it("handles objects with properties set to undefined", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = undefined;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", undefined],
    ]);
  });

  it("handles objects with properties set to null", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = null;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", null],
    ]);
  });

  it("handles objects with properties set to false", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = false;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", false],
    ]);
  });

  it("handles objects with properties set to empty string", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = "";
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", ""],
    ]);
  });

  it("handles objects with properties set to zero", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = 0;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", 0],
    ]);
  });

  it("handles objects with properties set to NaN", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = NaN;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", NaN],
    ]);
  });

  it("handles objects with properties set to Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = Infinity;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", Infinity],
    ]);
  });

  it("handles objects with properties set to -Infinity", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = -Infinity;
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", -Infinity],
    ]);
  });

  it("handles objects with properties set to functions", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = () => {};
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", obj.b],
    ]);
  });

  it("handles objects with properties set to arrays", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = [1, 2, 3];
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", [1, 2, 3]],
    ]);
  });

  it("handles objects with properties set to objects", () => {
    const obj: Record<string, any> = { a: 1 };
    obj.b = { c: 2 };
    const result = toPairs(obj);
    expect(result).toEqual([
      ["a", 1],
      ["b", { c: 2 }],
    ]);
  });

  it("handles objects with properties set to objects with prototype", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value" }]]);
  });

  it("handles objects with properties set to objects with prototype chain", () => {
    const obj: Record<string, any> = {};
    obj.a = {};
    obj.a.b = "value";
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value" }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value" }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: undefined }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value", _b: "value" }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value", _b: "value" }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value", _b: "value" }]]);
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
    const result = toPairs(obj);
    expect(result).toEqual([["a", { b: "value", _b: "value" }]]);
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] is equivalent to Object.entries",
    (obj) => {
      expect(toPairs(obj)).toEqual(Object.entries(obj));
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] length equals number of own properties",
    (obj) => {
      expect(toPairs(obj).length).toBe(Object.keys(obj).length);
    }
  );
});
