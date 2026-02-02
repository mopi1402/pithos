import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { wrap } from "./wrap";

describe("wrap", () => {
  it("wraps value with wrapper function", () => {
    const greet = wrap("Hello", (greeting, name: string) => `${greeting}, ${name}!`);
    expect(greet("World")).toBe("Hello, World!");
  });

  it("passes additional arguments to wrapper", () => {
    const fn = wrap(10, (n, a: number, b: number) => n + a + b);
    expect(fn(5, 3)).toBe(18);
  });

  it("[🎯] handles wrapper with no additional arguments", () => {
    const fn = wrap(42, (n) => n * 2);
    expect(fn()).toBe(84);
  });

  it("[🎯] handles null wrapped value", () => {
    const fn = wrap(null, (n) => n === null);
    expect(fn()).toBe(true);
  });

  it("[🎯] handles undefined wrapped value", () => {
    const fn = wrap(undefined, (n) => n === undefined);
    expect(fn()).toBe(true);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] wrapped value is always first argument",
    (wrapped, arg) => {
      const fn = wrap(wrapped, (first, second: number) => [first, second]);
      const result = fn(arg) as [number, number];
      expect(result[0]).toBe(wrapped);
      expect(result[1]).toBe(arg);
    }
  );

  itProp.prop([fc.string(), fc.string()])(
    "[🎲] string concatenation with wrapped value",
    (prefix, suffix) => {
      const fn = wrap(prefix, (p, s: string) => p + s);
      expect(fn(suffix)).toBe(prefix + suffix);
    }
  );
});
