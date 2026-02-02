import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { mapValues } from "./map-values";

describe("mapValues", () => {
  it("transforms values using iteratee", () => {
    const users = {
      fred: { age: 40 },
      pebbles: { age: 1 },
    };

    expect(mapValues(users, (u) => u.age)).toEqual({
      fred: 40,
      pebbles: 1,
    });
  });

  it("doubles numeric values", () => {
    expect(mapValues({ a: 1, b: 2, c: 3 }, (n) => n * 2)).toEqual({
      a: 2,
      b: 4,
      c: 6,
    });
  });

  it("transforms strings", () => {
    expect(
      mapValues({ x: "hello", y: "world" }, (s) => s.toUpperCase())
    ).toEqual({
      x: "HELLO",
      y: "WORLD",
    });
  });

  it("returns empty object for empty input", () => {
    expect(mapValues({}, (x) => x)).toEqual({});
  });

  it("passes value, key, and object to iteratee", () => {
    const obj = { a: 1 };
    const calls: Array<[number, string]> = [];

    mapValues(obj, (value, key) => {
      calls.push([value, key]);
      return value;
    });

    expect(calls).toEqual([[1, "a"]]);
  });

  it("does not mutate original object", () => {
    const obj = { a: 1, b: 2 };
    const original = { ...obj };
    mapValues(obj, (n) => n * 2);
    expect(obj).toEqual(original);
  });

  it("only iterates own properties", () => {
    const proto = { inherited: 1 };
    const obj = Object.create(proto);
    obj.own = 2;

    const result = mapValues(obj, (v) => v * 10);
    expect(result).toEqual({ own: 20 });
    expect(result).not.toHaveProperty("inherited");
  });

  it("handles single property object", () => {
    expect(mapValues({ only: 5 }, (v) => v + 1)).toEqual({ only: 6 });
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      mapValues(obj, (v) => v);
      expect(obj).toEqual(original);
    }
  );
});
