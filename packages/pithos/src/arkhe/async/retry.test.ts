import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { retry } from "./retry";

describe("retry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns result on success", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await retry(fn);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[🎯] attempts = 1 does not retry", async () => {
    vi.useRealTimers();
    const fn = vi.fn().mockRejectedValue(new Error("fail"));
    await expect(retry(fn, { attempts: 1 })).rejects.toThrow("fail");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");

    const promise = retry(fn, { delay: 100 });
    await vi.advanceTimersByTimeAsync(100);

    expect(await promise).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("respects attempts option", async () => {
    vi.useRealTimers();
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(retry(fn, { attempts: 3, delay: 1 })).rejects.toThrow("fail");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("applies backoff multiplier", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");

    const promise = retry(fn, { delay: 100, backoff: 2 });

    await vi.advanceTimersByTimeAsync(100); // first retry
    await vi.advanceTimersByTimeAsync(200); // second retry (100 * 2)

    expect(await promise).toBe("success");
  });

  it("respects maxDelay", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");

    const promise = retry(fn, { delay: 100, backoff: 10, maxDelay: 150 });

    await vi.advanceTimersByTimeAsync(100); // first retry
    await vi.advanceTimersByTimeAsync(150); // capped at maxDelay

    expect(await promise).toBe("success");
  });

  it("stops retrying when until returns false", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("non-retryable"));

    await expect(retry(fn, { until: () => false })).rejects.toThrow(
      "non-retryable"
    );

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes error to until function", async () => {
    const until = vi.fn().mockReturnValue(false);
    const error = new Error("test");
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retry(fn, { until })).rejects.toThrow();

    expect(until).toHaveBeenCalledWith(error);
  });

  it("[👾] does not sleep after last attempt", async () => {
    vi.useRealTimers();
    const sleepSpy = vi.spyOn(await import("@arkhe/util/sleep"), "sleep");
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(retry(fn, { attempts: 3, delay: 10 })).rejects.toThrow();

    // 3 attempts = 2 sleeps (pas de sleep après le dernier échec)
    expect(sleepSpy).toHaveBeenCalledTimes(2);
    sleepSpy.mockRestore();
  });

  it("[👾] increases delay with backoff multiplier", async () => {
    vi.useRealTimers();
    const sleepSpy = vi.spyOn(await import("@arkhe/util/sleep"), "sleep");
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(
      retry(fn, { attempts: 3, delay: 100, backoff: 2, jitter: 0 })
    ).rejects.toThrow();

    expect(sleepSpy).toHaveBeenNthCalledWith(1, 100);
    expect(sleepSpy).toHaveBeenNthCalledWith(2, 200);
    sleepSpy.mockRestore();
  });

  it("[👾] adds jitter to delay", async () => {
    vi.useRealTimers();
    const sleepSpy = vi.spyOn(await import("@arkhe/util/sleep"), "sleep");
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(
      retry(fn, { attempts: 2, delay: 100, jitter: 0.2 })
    ).rejects.toThrow();

    // delay + (delay * jitter * random) = 100 + (100 * 0.2 * 0.5) = 110
    expect(sleepSpy).toHaveBeenCalledWith(110);
    sleepSpy.mockRestore();
  });

  it("[👾] caps delay at maxDelay", async () => {
    vi.useRealTimers();
    const sleepSpy = vi.spyOn(await import("@arkhe/util/sleep"), "sleep");
    vi.spyOn(Math, "random").mockReturnValue(0);
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    await expect(
      retry(fn, {
        attempts: 3,
        delay: 100,
        backoff: 10,
        maxDelay: 150,
        jitter: 0,
      })
    ).rejects.toThrow();

    expect(sleepSpy).toHaveBeenNthCalledWith(1, 100);
    expect(sleepSpy).toHaveBeenNthCalledWith(2, 150); // capped
    sleepSpy.mockRestore();
  });
});
