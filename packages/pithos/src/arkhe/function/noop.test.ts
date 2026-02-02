import { describe, it, expect } from "vitest";
import { noop } from "./noop";

describe("noop", () => {
  it("[🎯] returns undefined regardless of arguments", () => {
    expect(noop()).toBeUndefined();
    // noop ignores arguments at runtime even though TypeScript signature has no params
    expect((noop as (...args: unknown[]) => void)(1, 2, 3)).toBeUndefined();
    expect((noop as (...args: unknown[]) => void)("ignored", { also: "ignored" })).toBeUndefined();
  });
});
