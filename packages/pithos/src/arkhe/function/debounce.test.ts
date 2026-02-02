import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delays invocation until after wait period", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resets delay on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("invokes with latest arguments", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1);
    debounced(2);
    debounced(3);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it("[🎯] invokes immediately when immediate=true", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // no trailing call
  });

  it("blocks subsequent immediate calls until timeout clears", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);

    debounced();
    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    debounced();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cancel stops pending invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it("flush forces immediate execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1, 2);
    expect(fn).not.toHaveBeenCalled();

    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1, 2);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // no additional call after flush
  });

  it("flush clears pending timeout", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.flush();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // only called once via flush
  });

  it("flush uses latest arguments", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1);
    debounced(2);
    debounced(3);
    debounced.flush();

    expect(fn).toHaveBeenCalledWith(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("flush preserves this context", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    const obj = { debounced };

    obj.debounced();
    debounced.flush();

    expect(fn.mock.contexts[0]).toBe(obj);
  });

  it("flush works with immediate mode", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);

    debounced(1);
    expect(fn).toHaveBeenCalledTimes(1); // immediate call
    expect(fn).toHaveBeenCalledWith(1);

    debounced(2);
    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("preserves this context", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    const obj = { debounced };

    obj.debounced();
    vi.advanceTimersByTime(100);

    expect(fn.mock.contexts[0]).toBe(obj);
  });

  it("throws RangeError for negative wait", () => {
    const fn = vi.fn();
    expect(() => debounce(fn, -1)).toThrow(RangeError);
    expect(() => debounce(fn, -1)).toThrow("wait must be non-negative");
  });

  it("throws RangeError for non-finite wait", () => {
    const fn = vi.fn();
    expect(() => debounce(fn, Infinity)).toThrow(RangeError);
    expect(() => debounce(fn, Infinity)).toThrow("wait must be finite");
    expect(() => debounce(fn, NaN)).toThrow(RangeError);
    expect(() => debounce(fn, NaN)).toThrow("wait must be finite");
  });

  it("throws RangeError for negative infinity (caught by negative check)", () => {
    const fn = vi.fn();
    expect(() => debounce(fn, -Infinity)).toThrow(RangeError);
    expect(() => debounce(fn, -Infinity)).toThrow("wait must be non-negative");
  });

  it("[👾] accepts wait of 0", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);
    debounced();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] flush without pending call does not invoke", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    // Call flush without any pending debounced call
    debounced.flush();
    expect(fn).not.toHaveBeenCalled();
  });

  it("[👾] cancel without pending call is safe", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    // Cancel without any pending call should not throw
    debounced.cancel();
    expect(fn).not.toHaveBeenCalled();
  });

  it("[👾] flush clears timeout to prevent double invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1);
    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);

    // The timeout should be cleared, so advancing time should not call again
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("[👾] cancel clears timeout to prevent invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced(1);
    debounced.cancel();

    // The timeout should be cleared
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });
});
