import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("[🎯] invokes immediately on leading edge by default", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throttles subsequent calls within wait period", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("invokes on trailing edge with latest arguments", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1);
    throttled(2);
    throttled(3);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("allows new call after wait period", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2); // leading + leading (no trailing, args consumed)
  });

  it("cancel stops pending invocation", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1);
    throttled(2);
    throttled.cancel();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it("preserves this context", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);
    const obj = { throttled };

    obj.throttled();
    expect(fn.mock.contexts[0]).toBe(obj);
  });

  it("clears pending timeout when interval has passed before it fires", () => {
    vi.setSystemTime(0);
    const fn = vi.fn();
    const clearSpy = vi.spyOn(global, "clearTimeout");
    const throttled = throttle(fn, 100);

    throttled(); // schedules trailing call at t=100

    vi.setSystemTime(150); // advance clock without executing timers
    throttled(); // should clear previous timeout and reschedule

    expect(clearSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throws RangeError for negative wait", () => {
    const fn = vi.fn();
    expect(() => throttle(fn, -1)).toThrow(RangeError);
    expect(() => throttle(fn, -1)).toThrow("wait must be non-negative");
  });

  it("throws RangeError for non-finite wait", () => {
    const fn = vi.fn();
    expect(() => throttle(fn, Infinity)).toThrow(RangeError);
    expect(() => throttle(fn, Infinity)).toThrow("wait must be finite");
    expect(() => throttle(fn, NaN)).toThrow(RangeError);
    expect(() => throttle(fn, NaN)).toThrow("wait must be finite");
  });

  it("throws RangeError for negative infinity (caught by negative check)", () => {
    const fn = vi.fn();
    expect(() => throttle(fn, -Infinity)).toThrow(RangeError);
    expect(() => throttle(fn, -Infinity)).toThrow("wait must be non-negative");
  });

  it("[👾] accepts wait of 0", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 0);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] cancel without pending call is safe", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    // Cancel without any pending call should not throw
    throttled.cancel();
    expect(fn).not.toHaveBeenCalled();
  });

  it("[👾] trailing call happens after wait period with correct args", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    // First call - immediate
    throttled(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    // Second call within wait period - stored for trailing
    throttled(2);
    expect(fn).toHaveBeenCalledTimes(1);

    // Advance past wait period - trailing should fire
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(2);
  });

  it("[👾] no trailing call if no pending args", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    // Single call - no trailing needed
    throttled(1);
    expect(fn).toHaveBeenCalledTimes(1);

    // Advance time - no additional calls
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] updates pending args on multiple calls during throttle period", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1); // immediate
    throttled(2); // pending
    throttled(3); // replaces pending

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("[👾] reuses existing timeout instead of creating new one", () => {
    const setTimeoutSpy = vi.spyOn(global, "setTimeout");
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1); // immediate, no timeout yet
    throttled(2); // creates timeout

    const callsAfterFirst = setTimeoutSpy.mock.calls.length;

    throttled(3); // should NOT create new timeout, just update args

    // If mutant changes !timeoutId to true, a new setTimeout would be called
    expect(setTimeoutSpy.mock.calls.length).toBe(callsAfterFirst);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

});
