import { describe, it, expect, vi } from "vitest";
import { forIn } from "./forIn";

describe("forIn", () => {
  it("iterates over own properties", () => {
    const result: string[] = [];
    forIn({ a: 1, b: 2 }, (_, key) => result.push(key));
    expect(result).toContain("a");
    expect(result).toContain("b");
  });

  it("provides value, key, and object to iteratee", () => {
    const obj = { a: 1 };
    const fn = vi.fn();
    forIn(obj, fn);
    expect(fn).toHaveBeenCalledWith(1, "a", obj);
  });

  it("[🎯] handles empty object", () => {
    const fn = vi.fn();
    forIn({}, fn);
    expect(fn).not.toHaveBeenCalled();
  });
});
