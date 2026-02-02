import { describe, it, expect } from "vitest";
import { findKey } from "./find-key";

describe("findKey", () => {
  it("returns key of first matching element", () => {
    const users = {
      barney: { age: 36, active: true },
      fred: { age: 40, active: false },
      pebbles: { age: 1, active: true },
    };

    expect(findKey(users, (u) => u.age < 40)).toBe("barney");
  });

  it("returns undefined when no match found", () => {
    const users = {
      barney: { age: 36 },
      fred: { age: 40 },
    };

    expect(findKey(users, (u) => u.age > 100)).toBeUndefined();
  });

  it("[🎯] returns undefined for empty object", () => {
    expect(findKey({}, () => true)).toBeUndefined();
  });

  it("passes value, key, and object to predicate", () => {
    const obj = { a: 1, b: 2 };
    const calls: Array<[number, string]> = [];

    findKey(obj, (value, key) => {
      calls.push([value, key]);
      return false;
    });

    expect(calls).toContainEqual([1, "a"]);
    expect(calls).toContainEqual([2, "b"]);
  });

  it("works with simple values", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(findKey(obj, (v) => v === 2)).toBe("b");
  });

  it("only iterates own properties", () => {
    const proto = { inherited: true };
    const obj = Object.create(proto);
    obj.own = true;

    expect(findKey(obj, (_, key) => key === "inherited")).toBeUndefined();
    expect(findKey(obj, (_, key) => key === "own")).toBe("own");
  });

  it("handles single property object", () => {
    expect(findKey({ only: 42 }, (v) => v === 42)).toBe("only");
  });
});
