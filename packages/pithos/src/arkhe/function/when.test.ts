import { describe, it, expect } from "vitest";
import { when } from "./when";

describe("when", () => {
  it("applies transformation when predicate is true", () => {
    expect(
      when(
        5,
        (x: number) => x > 0,
        (x) => x * 2
      )
    ).toBe(10);
  });

  it("[🎯] returns original value when predicate is false", () => {
    expect(
      when(
        -5,
        (x: number) => x > 0,
        (x) => x * 2
      )
    ).toBe(-5);
  });

  it("works with different input and output types", () => {
    expect(
      when(
        "hi",
        (s: string) => s.length > 5,
        (s) => s.length
      )
    ).toBe("hi");
    expect(
      when(
        "hello world",
        (s: string) => s.length > 5,
        (s) => s.length
      )
    ).toBe(11);
  });
});
