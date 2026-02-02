import { describe, it, expect } from "vitest";
import { flip } from "./flip";

describe("flip", () => {
  it("reverses the first two arguments of a binary function", () => {
    const divide = (a: number, b: number) => a / b;
    const flipped = flip(divide);

    expect(divide(10, 2)).toBe(5);
    expect(flipped(2, 10)).toBe(5);
  });

  it("preserves remaining arguments in order", () => {
    const fn = (a: string, b: string, c: string, d: string) =>
      `${a}-${b}-${c}-${d}`;
    const flipped = flip(fn);

    expect(flipped("B", "A", "C", "D")).toBe("A-B-C-D");
  });

  it("[🎯] keeps rest parameters intact", () => {
    const fn = (a: number, b: number, ...rest: number[]) =>
      [a, b, ...rest].join(",");
    const flipped = flip(fn);

    expect(flipped(2, 1, 3, 4)).toBe("1,2,3,4");
  });

  it("works with functions returning different types", () => {
    const concat = (a: number, b: string) => `${b}:${a}`;
    const flipped = flip(concat);

    expect(flipped("prefix", 42)).toBe("prefix:42");
  });

  it("works with object arguments", () => {
    const hasProperty = (obj: Record<string, unknown>, key: string) =>
      key in obj;
    const hasKey = flip(hasProperty);

    expect(hasKey("name", { name: "John" })).toBe(true);
    expect(hasKey("age", { name: "John" })).toBe(false);
  });
});
