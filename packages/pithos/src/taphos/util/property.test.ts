import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { property } from "./property";

describe("property", () => {
  it("returns property value", () => {
    const getName = property("name");
    expect(getName({ name: "fred" })).toBe("fred");
  });

  it("works with map", () => {
    const users = [{ name: "fred" }, { name: "barney" }];
    expect(users.map(property("name"))).toEqual(["fred", "barney"]);
  });

  it("[🎯] handles numeric keys", () => {
    const getFirst = property(0);
    expect(getFirst(["a", "b"])).toBe("a");
  });

  itProp.prop([fc.string(), fc.anything()])(
    "[🎲] retrieves property value correctly",
    (key, value) => {
      const obj = { [key]: value };
      const fn = property(key);
      expect(fn(obj)).toBe(value);
    }
  );
});
