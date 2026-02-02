import { describe, it, expect, vi } from "vitest";
import { after } from "./after";

describe("after", () => {
  it("returns undefined before n calls, then invokes", () => {
    const fn = vi.fn(() => "result");
    const afterThree = after(fn, 3);

    expect(afterThree()).toBeUndefined();
    expect(afterThree()).toBeUndefined();
    expect(fn).not.toHaveBeenCalled();

    expect(afterThree()).toBe("result");
    expect(afterThree()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("[🎯] throws RangeError when n < 0", () => {
    const fn = vi.fn(() => "result");

    expect(() => after(fn, -1)).toThrow(RangeError);
    expect(() => after(fn, -1)).toThrow("n must be non-negative");
  });

  it("[🎯] throws RangeError when n is not an integer", () => {
    const fn = vi.fn(() => "result");

    expect(() => after(fn, 1.5)).toThrow(RangeError);
    expect(() => after(fn, 1.5)).toThrow("n must be an integer");
    expect(() => after(fn, 2.7)).toThrow(RangeError);
    expect(() => after(fn, 2.7)).toThrow("n must be an integer");
    expect(() => after(fn, 0.5)).toThrow(RangeError);
    expect(() => after(fn, 0.5)).toThrow("n must be an integer");
  });

  it("[🎯] invokes immediately when n === 0", () => {
    const fn = vi.fn(() => "result");

    expect(after(fn, 0)()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to wrapped function", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const afterTwo = after(fn, 2);

    afterTwo(1, 2);
    expect(afterTwo(3, 4)).toBe(7);
    expect(fn).toHaveBeenCalledWith(3, 4);
  });

  it("maintains separate state per instance", () => {
    const fn1 = vi.fn(() => "a");
    const fn2 = vi.fn(() => "b");
    const after1 = after(fn1, 2);
    const after2 = after(fn2, 3);

    after1();
    after2();
    after2();

    expect(after1()).toBe("a");
    expect(after2()).toBe("b");
  });
});
