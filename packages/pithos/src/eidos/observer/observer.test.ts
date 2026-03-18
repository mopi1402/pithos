import { describe, it, expect, vi } from "vitest";
import { createObservable } from "./observer";

describe("createObservable", () => {
  // --- subscribe / notify ---

  it("notifies subscribed listeners", () => {
    const obs = createObservable<number>();
    const fn = vi.fn();

    obs.subscribe(fn);
    obs.notify(42);

    expect(fn).toHaveBeenCalledWith(42);
  });

  it("notifies multiple listeners", () => {
    const obs = createObservable<string>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    obs.subscribe(fn1);
    obs.subscribe(fn2);
    obs.notify("hello");

    expect(fn1).toHaveBeenCalledWith("hello");
    expect(fn2).toHaveBeenCalledWith("hello");
  });

  it("does nothing when no listeners", () => {
    const obs = createObservable<number>();

    expect(() => obs.notify(1)).not.toThrow();
  });

  // --- unsubscribe ---

  it("unsubscribes via returned function", () => {
    const obs = createObservable<number>();
    const fn = vi.fn();

    const unsub = obs.subscribe(fn);
    unsub();
    obs.notify(1);

    expect(fn).not.toHaveBeenCalled();
  });

  it("unsubscribing one listener does not affect others", () => {
    const obs = createObservable<number>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const unsub1 = obs.subscribe(fn1);
    obs.subscribe(fn2);
    unsub1();
    obs.notify(1);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith(1);
  });

  // --- once ---

  it("once listener fires only once", () => {
    const obs = createObservable<number>();
    const fn = vi.fn();

    obs.once(fn);
    obs.notify(1);
    obs.notify(2);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it("once can be manually unsubscribed before firing", () => {
    const obs = createObservable<number>();
    const fn = vi.fn();

    const unsub = obs.once(fn);
    unsub();
    obs.notify(1);

    expect(fn).not.toHaveBeenCalled();
  });

  // --- size ---

  it("tracks listener count", () => {
    const obs = createObservable<number>();

    expect(obs.size).toBe(0);

    const unsub1 = obs.subscribe(() => {});
    const unsub2 = obs.subscribe(() => {});

    expect(obs.size).toBe(2);

    unsub1();
    expect(obs.size).toBe(1);

    unsub2();
    expect(obs.size).toBe(0);
  });

  it("once listeners count toward size until fired", () => {
    const obs = createObservable<number>();

    obs.once(() => {});
    expect(obs.size).toBe(1);

    obs.notify(1);
    expect(obs.size).toBe(0);
  });

  // --- clear ---

  it("removes all listeners", () => {
    const obs = createObservable<number>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    obs.subscribe(fn1);
    obs.subscribe(fn2);
    obs.clear();
    obs.notify(1);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
    expect(obs.size).toBe(0);
  });

  // --- safeNotify (zygos integration) ---

  it("safeNotify returns Ok when all listeners succeed", () => {
    const obs = createObservable<number>();
    const fn = vi.fn();

    obs.subscribe(fn);
    const result = obs.safeNotify(42);

    expect(result.isOk()).toBe(true);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it("safeNotify collects errors and continues notifying", () => {
    const obs = createObservable<number>();
    const fn1 = vi.fn(() => {
      throw new Error("listener 1 failed");
    });
    const fn2 = vi.fn();

    obs.subscribe(fn1);
    obs.subscribe(fn2);
    const result = obs.safeNotify(42);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toHaveLength(1);
      expect(result.error[0].message).toBe("listener 1 failed");
    }
    // fn2 was still called despite fn1 throwing
    expect(fn2).toHaveBeenCalledWith(42);
  });

  it("safeNotify wraps non-Error throws", () => {
    const obs = createObservable<number>();
    obs.subscribe(() => {
      throw "string error";
    });

    const result = obs.safeNotify(1);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error[0]).toBeInstanceOf(Error);
      expect(result.error[0].message).toBe("string error");
    }
  });

  it("safeNotify returns Ok with no listeners", () => {
    const obs = createObservable<number>();
    const result = obs.safeNotify(1);

    expect(result.isOk()).toBe(true);
  });
});
