import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defer } from "./defer";

describe("defer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("defers execution to next tick", async () => {
    const fn = vi.fn().mockReturnValue(42);
    const promise = defer(fn);

    expect(fn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(0);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(await promise).toBe(42);
  });

  it("[🎯] handles async function", async () => {
    const promise = defer(() => Promise.resolve("async"));
    await vi.advanceTimersByTimeAsync(0);
    expect(await promise).toBe("async");
  });

  it("[🎯] rejects on error", async () => {
    vi.useRealTimers();
    await expect(
      defer(() => {
        throw new Error("fail");
      })
    ).rejects.toThrow("fail");
  });

  it("[🎯] rejects on async error", async () => {
    vi.useRealTimers();
    await expect(
      defer(() => Promise.reject(new Error("async fail")))
    ).rejects.toThrow("async fail");
  });
});
