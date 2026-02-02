import { describe, it, expect } from "vitest";
import { update } from "./update";

describe("update", () => {
  it("updates value at path", () => {
    const result = update({ a: { b: { c: 3 } } }, "a.b.c", (n) => (n as number) * 2);
    expect(result).toEqual({ a: { b: { c: 6 } } });
  });

  it("[🎯] returns new object (immutable)", () => {
    const original = { a: 1 };
    const result = update(original, "a", (n) => (n as number) + 1);
    expect(result).not.toBe(original);
    expect(original.a).toBe(1);
  });

  it("handles array path", () => {
    const result = update({ a: { b: 1 } }, ["a", "b"], (n) => (n as number) * 3);
    expect(result).toEqual({ a: { b: 3 } });
  });

  it("[🎯] handles undefined values", () => {
    const result = update({ a: 1 }, "b", (n) => n ?? 10);
    expect(result).toEqual({ a: 1, b: 10 });
  });
});
