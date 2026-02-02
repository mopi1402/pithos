import { describe, it, expect, vi } from "vitest";
import { delay } from "./delay";

describe("delay", () => {
  it("[🎯] delays function execution", async () => {
    const fn = vi.fn();
    delay(fn, 50);
    expect(fn).not.toHaveBeenCalled();
    await new Promise((r) => setTimeout(r, 60));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("[🎯] passes arguments to function", async () => {
    const fn = vi.fn();
    delay(fn, 10, "a", 1);
    await new Promise((r) => setTimeout(r, 20));
    expect(fn).toHaveBeenCalledWith("a", 1);
  });

  it("returns timer id", () => {
    const fn = vi.fn();
    const id = delay(fn, 1000);
    expect(id).toBeDefined();
    clearTimeout(id);
  });

  it("[🎯] can be cancelled with clearTimeout", async () => {
    const fn = vi.fn();
    const id = delay(fn, 50);
    clearTimeout(id);
    await new Promise((r) => setTimeout(r, 60));
    expect(fn).not.toHaveBeenCalled();
  });
});
