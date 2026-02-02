import { describe, it, expect } from "vitest";
import { unless } from "./unless";

describe("unless", () => {
  it("[🎯] returns original value when predicate is true", () => {
    expect(
      unless(
        5,
        (x: number) => x > 0,
        (x) => x * -1
      )
    ).toBe(5);
  });

  it("applies transformation when predicate is false", () => {
    expect(
      unless(
        -5,
        (x: number) => x > 0,
        (x) => x * -1
      )
    ).toBe(5);
  });

  it("works with different input and output types", () => {
    expect(
      unless(
        "",
        (s: string) => s.length === 0,
        (s) => s.toUpperCase()
      )
    ).toBe("");
    expect(
      unless(
        "hello",
        (s: string) => s.length === 0,
        (s) => s.toUpperCase()
      )
    ).toBe("HELLO");
  });
});
