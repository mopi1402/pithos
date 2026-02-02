import { describe, it, expect } from "vitest";
import { has } from "./has";

describe("has", () => {
  it("returns true for own property", () => {
    expect(has({ a: 1 }, "a")).toBe(true);
  });

  it("returns false for non-existent property", () => {
    expect(has({ a: 1 }, "b")).toBe(false);
  });

  it("returns false for inherited property", () => {
    const obj = Object.create({ inherited: true });
    expect(has(obj, "inherited")).toBe(false);
  });

  it("[🎯] works with Object.create(null)", () => {
    const bare = Object.create(null);
    bare.x = 42;
    expect(has(bare, "x")).toBe(true);
    expect(has(bare, "y")).toBe(false);
  });

  it("[🎯] returns true for property with undefined value", () => {
    const obj = { a: 1, b: undefined };
    expect(has(obj, "b")).toBe(true);
  });
});
