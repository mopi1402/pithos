import { describe, it, expect, vi } from "vitest";
import { createLiteObservable } from "./observer-lite";

describe("createLiteObservable", () => {
  it("notifies subscribed listeners", () => {
    const obs = createLiteObservable<number>();
    const fn = vi.fn();

    obs.subscribe(fn);
    obs.notify(42);

    expect(fn).toHaveBeenCalledWith(42);
  });

  it("notifies multiple listeners", () => {
    const obs = createLiteObservable<string>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    obs.subscribe(fn1);
    obs.subscribe(fn2);
    obs.notify("hello");

    expect(fn1).toHaveBeenCalledWith("hello");
    expect(fn2).toHaveBeenCalledWith("hello");
  });

  it("does nothing when no listeners", () => {
    const obs = createLiteObservable<number>();
    expect(() => obs.notify(1)).not.toThrow();
  });

  it("unsubscribes via returned function", () => {
    const obs = createLiteObservable<number>();
    const fn = vi.fn();

    const unsub = obs.subscribe(fn);
    unsub();
    obs.notify(1);

    expect(fn).not.toHaveBeenCalled();
  });

  it("unsubscribing one listener does not affect others", () => {
    const obs = createLiteObservable<number>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const unsub1 = obs.subscribe(fn1);
    obs.subscribe(fn2);
    unsub1();
    obs.notify(1);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith(1);
  });

  it("clear removes all listeners", () => {
    const obs = createLiteObservable<number>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    obs.subscribe(fn1);
    obs.subscribe(fn2);
    obs.clear();
    obs.notify(1);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it("can re-subscribe after clear", () => {
    const obs = createLiteObservable<number>();
    const fn = vi.fn();

    obs.subscribe(fn);
    obs.clear();
    obs.subscribe(fn);
    obs.notify(7);

    expect(fn).toHaveBeenCalledWith(7);
  });
});
