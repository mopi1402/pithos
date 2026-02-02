import { describe, it, expect } from "vitest";
import { get } from "./get";

describe("get", () => {
  it("gets value by string path", () => {
    expect(get({ a: { b: 2 } }, "a.b")).toBe(2);
  });

  it("gets value by array path", () => {
    expect(get({ a: { b: 2 } }, ["a", "b"])).toBe(2);
  });

  it("returns undefined for non-existent path", () => {
    expect(get({ a: 1 }, "b.c")).toBeUndefined();
  });

  it("returns default value for non-existent path", () => {
    expect(get({ a: 1 }, "b.c", "default")).toBe("default");
  });

  it("returns default value for null/undefined object", () => {
    expect(get(null, "a", "default")).toBe("default");
    expect(get(undefined, "a", "default")).toBe("default");
  });

  it("handles array index in path", () => {
    expect(get({ a: [1, 2, 3] }, "a[1]")).toBe(2);
    expect(get({ a: [1, 2, 3] }, ["a", 1])).toBe(2);
  });

  it("returns default when traversing through primitive", () => {
    expect(get({ a: "string" }, "a.b", "default")).toBe("default");
  });

  it("returns value when current is not undefined", () => {
    const obj = { a: { b: null } };
    expect(get(obj, "a.b")).toBe(null);
    expect(get(obj, "a.b", "default")).toBe(null);
  });

  it("returns default when current is explicitly undefined", () => {
    const obj = { a: { b: undefined } };
    expect(get(obj, "a.b")).toBeUndefined();
    expect(get(obj, "a.b", "default")).toBe("default");
  });

  it("blocks access to __proto__ for security", () => {
    const obj = { a: 1 };
    expect(get(obj, "__proto__", "default")).toBe("default");
    expect(get(obj, "__proto__")).toBeUndefined();
    expect(get(obj, ["__proto__"], "default")).toBe("default");
    // Even if __proto__ exists as a regular property
    const objWithProto = { __proto__: "hacked" };
    expect(get(objWithProto, "__proto__", "default")).toBe("default");
  });

  it("blocks access to constructor for security", () => {
    const obj = { a: 1 };
    expect(get(obj, "constructor", "default")).toBe("default");
    expect(get(obj, "constructor")).toBeUndefined();
    expect(get(obj, ["constructor"], "default")).toBe("default");
    // Even if constructor exists as a regular property
    const objWithConstructor = { constructor: "hacked" };
    expect(get(objWithConstructor, "constructor", "default")).toBe("default");
  });

  it("blocks access to prototype for security", () => {
    const obj = { a: 1 };
    expect(get(obj, "prototype", "default")).toBe("default");
    expect(get(obj, "prototype")).toBeUndefined();
    expect(get(obj, ["prototype"], "default")).toBe("default");
    // Even if prototype exists as a regular property
    const objWithPrototype = { prototype: "hacked" };
    expect(get(objWithPrototype, "prototype", "default")).toBe("default");
  });

  it("blocks access to __proto__/constructor/prototype in nested paths", () => {
    const obj = { a: { b: 1 } };
    expect(get(obj, "a.__proto__", "default")).toBe("default");
    expect(get(obj, "a.constructor", "default")).toBe("default");
    expect(get(obj, "a.prototype", "default")).toBe("default");
    expect(get(obj, ["a", "__proto__"], "default")).toBe("default");
    expect(get(obj, ["a", "constructor"], "default")).toBe("default");
    expect(get(obj, ["a", "prototype"], "default")).toBe("default");
  });

  it("[👾] returns default for null object with empty path", () => {
    expect(get(null, [], "default")).toBe("default");
    expect(get(null, "", "default")).toBe("default");
  });

  it("[👾] returns default when intermediate property is null", () => {
    const obj = { a: null };
    expect(get(obj, "a.b", "default")).toBe("default");
    expect(get(obj, ["a", "b"], "default")).toBe("default");
  });

  it("[👾] returns default when traversing through number (blocks method access)", () => {
    const obj = { a: 42 };
    expect(get(obj, "a.toFixed", "default")).toBe("default");
    expect(get(obj, ["a", "toFixed"], "default")).toBe("default");
  });

});
