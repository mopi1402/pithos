import { describe, it, expect } from "vitest";
import { invoke } from "./invoke";

describe("invoke", () => {
  it("invokes method at path", () => {
    const object = {
      a: { b: { greet: (name: string) => `Hello, ${name}!` } },
    };
    expect(invoke(object, "a.b.greet", ["World"])).toBe("Hello, World!");
  });

  it("[🎯] returns undefined if method not found", () => {
    expect(invoke({ a: 1 }, "a.b.c")).toBeUndefined();
  });

  it("[🎯] returns undefined if not a function", () => {
    expect(invoke({ a: { b: 42 } }, "a.b")).toBeUndefined();
  });

  it("handles array path", () => {
    const object = { a: { b: () => "result" } };
    expect(invoke(object, ["a", "b"])).toBe("result");
  });

  it("[👾] calls method with no arguments by default", () => {
    const object = {
      method: (...args: unknown[]) => args.length,
    };
    // When args is not provided, it should default to empty array
    expect(invoke(object, "method")).toBe(0);
  });
});
