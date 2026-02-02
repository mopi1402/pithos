import { describe, it, expect, vi } from "vitest";
import { once } from "./once";

describe("once", () => {
  it("executes the function only once", () => {
    const fn = vi.fn(() => "result");
    const onceFn = once(fn);

    expect(onceFn()).toBe("result");
    expect(onceFn()).toBe("result");
    expect(onceFn()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("returns the first result for subsequent calls with different arguments", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const onceFn = once(fn);

    expect(onceFn(1, 2)).toBe(3);
    expect(onceFn(10, 20)).toBe(3); // still returns first result
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments correctly on first call", () => {
    const fn = vi.fn((name: string) => `Hello, ${name}!`);
    const onceFn = once(fn);

    expect(onceFn("Alice")).toBe("Hello, Alice!");
    expect(fn).toHaveBeenCalledWith("Alice");
  });

  it("[🎯] caches undefined result", () => {
    const fn = vi.fn(() => undefined);
    const onceFn = once(fn);

    expect(onceFn()).toBeUndefined();
    expect(onceFn()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
