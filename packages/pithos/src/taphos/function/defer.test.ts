import { describe, it, expect, vi } from "vitest";
import { defer } from "./defer";

describe("defer", () => {
  it("[🎯] defers function execution", async () => {
    const fn = vi.fn();
    defer(fn);
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 10));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("[🎯] passes arguments to function", async () => {
    const fn = vi.fn();
    defer(fn, "a", 1, true);
    await new Promise((r) => setTimeout(r, 10));
    expect(fn).toHaveBeenCalledWith("a", 1, true);
  });

  it("returns timer id", () => {
    const fn = vi.fn();
    const id = defer(fn);
    expect(id).toBeDefined();
    clearTimeout(id);
  });

  it("[🎯] can be cancelled with clearTimeout", async () => {
    const fn = vi.fn();
    const id = defer(fn);
    clearTimeout(id);
    await new Promise((r) => setTimeout(r, 10));
    expect(fn).not.toHaveBeenCalled();
  });
});
