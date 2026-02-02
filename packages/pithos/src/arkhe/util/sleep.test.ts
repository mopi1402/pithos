import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sleep } from "./sleep";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after specified duration", async () => {
    const promise = sleep(1000);
    let resolved = false;

    promise.then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1000);

    expect(resolved).toBe(true);
    await promise;
  });

  it("resolves immediately for zero duration", async () => {
    const promise = sleep(0);
    let resolved = false;

    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(resolved).toBe(true);
    await promise;
  });

  it("throws RangeError for negative duration", () => {
    expect(() => sleep(-1)).toThrow(RangeError);
    expect(() => sleep(-1)).toThrow("Duration must not be negative");
  });

  it("returns a promise that resolves", async () => {
    const promise = sleep(100);

    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();
  });

  it("[🎯] handles large duration", async () => {
    const promise = sleep(10000);
    let resolved = false;

    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(9999);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  it("[🎯] returns a Promise", () => {
    const result = sleep(100);
    expect(result).toBeInstanceOf(Promise);
  });
});
