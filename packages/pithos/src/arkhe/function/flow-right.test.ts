import { describe, it, expect } from "vitest";
import { flowRight, compose } from "./flow-right";

describe("flowRight", () => {
  it("composes functions right-to-left", () => {
    const add10 = (x: number) => x + 10;
    const multiply2 = (x: number) => x * 2;
    const square = (x: number) => x * x;

    const composed = flowRight(square, multiply2, add10);
    expect(composed(5)).toBe(900);
  });

  it("[🎯] returns identity function for empty input", () => {
    const identity = flowRight();
    expect(identity(42)).toBe(42);
    expect(identity("hello")).toBe("hello");
  });

  it("returns the function for single input", () => {
    const double = (x: number) => x * 2;
    const composed = flowRight(double);
    expect(composed(5)).toBe(10);
  });

  it("handles string transformations", () => {
    const trim = (s: string) => s.trim();
    const upper = (s: string) => s.toUpperCase();
    const exclaim = (s: string) => s + "!";

    const shout = flowRight(exclaim, upper, trim);
    expect(shout("  hello  ")).toBe("HELLO!");
  });

  it("handles two functions", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;

    const composed = flowRight(add1, double);
    expect(composed(5)).toBe(11);
  });

  it("handles type transformations", () => {
    const toString = (x: number) => String(x);
    const addPrefix = (s: string) => "num:" + s;

    const composed = flowRight(addPrefix, toString);
    expect(composed(42)).toBe("num:42");
  });
});

describe("compose", () => {
  it("is an alias for flowRight", () => {
    expect(compose).toBe(flowRight);
  });

  it("works the same as flowRight", () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;

    expect(compose(add1, double)(5)).toBe(flowRight(add1, double)(5));
  });
});
