import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { tap } from "./tap";

describe("tap", () => {
  it("invokes interceptor with value", () => {
    const fn = vi.fn();
    tap(42, fn);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it("[🎯] returns original value", () => {
    expect(tap(42, () => {})).toBe(42);
  });

  it("[🎯] returns original value regardless of interceptor return", () => {
    expect(tap(42, () => 100)).toBe(42);
  });

  it("[🎯] handles object values", () => {
    const obj = { a: 1 };
    expect(tap(obj, () => {})).toBe(obj);
  });

  itProp.prop([fc.anything()])(
    "[🎲] always returns the original value",
    (value) => {
      const result = tap(value, () => "ignored");
      expect(result).toBe(value);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] interceptor is called with the value",
    (n) => {
      let captured: number | undefined;
      tap(n, (v) => { captured = v; });
      expect(captured).toBe(n);
    }
  );
});
