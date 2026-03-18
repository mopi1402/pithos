import { describe, it, expect, vi } from "vitest";
import { type Decorator, decorate, before, after, around } from "./decorator";

// --- Decorator type ---

describe("Decorator type", () => {
  it("is a higher-order function that preserves signature", () => {
    const upper: Decorator<string, string> = (fn) => (input) =>
      fn(input).toUpperCase();

    const greet = upper((name) => `hello, ${name}`);

    expect(greet("alice")).toBe("HELLO, ALICE");
  });
});

// --- decorate ---

describe("decorate", () => {
  it("applies a single decorator", () => {
    const double: Decorator<number, number> = (fn) => (n) => fn(n) * 2;

    const enhanced = decorate((n: number) => n + 1, double);

    expect(enhanced(5)).toBe(12); // (5 + 1) * 2
  });

  it("applies multiple decorators left-to-right", () => {
    const calls: string[] = [];

    const d1: Decorator<number, number> = (fn) => (n) => {
      calls.push("d1");
      return fn(n);
    };
    const d2: Decorator<number, number> = (fn) => (n) => {
      calls.push("d2");
      return fn(n);
    };

    const enhanced = decorate((n: number) => n, d1, d2);
    enhanced(1);

    // d2 is outermost, executes first, then d1
    expect(calls).toEqual(["d2", "d1"]);
  });

  it("returns the original function when no decorators", () => {
    const fn = (n: number) => n * 2;
    const enhanced = decorate(fn);

    expect(enhanced(5)).toBe(10);
  });
});

// --- before ---

describe("before", () => {
  it("runs hook before the function", () => {
    const order: string[] = [];

    const enhanced = decorate(
      (n: number) => {
        order.push("fn");
        return n * 2;
      },
      before((n) => {
        order.push(`before:${n}`);
      }),
    );

    const result = enhanced(5);

    expect(order).toEqual(["before:5", "fn"]);
    expect(result).toBe(10);
  });

  it("does not alter the return value", () => {
    const enhanced = decorate(
      (s: string) => s.toUpperCase(),
      before(() => {}),
    );

    expect(enhanced("hello")).toBe("HELLO");
  });
});

// --- after ---

describe("after", () => {
  it("runs hook after the function", () => {
    const order: string[] = [];

    const enhanced = decorate(
      (n: number) => {
        order.push("fn");
        return n * 2;
      },
      after((_input, output) => {
        order.push(`after:${output}`);
      }),
    );

    const result = enhanced(5);

    expect(order).toEqual(["fn", "after:10"]);
    expect(result).toBe(10);
  });

  it("receives both input and output", () => {
    const hook = vi.fn();

    const enhanced = decorate(
      (n: number) => n * 3,
      after(hook),
    );

    enhanced(7);

    expect(hook).toHaveBeenCalledWith(7, 21);
  });
});

// --- around ---

describe("around", () => {
  it("gives full control over execution", () => {
    const withDoubling = around<number, number>((fn, input) => {
      return fn(input) * 2;
    });

    const enhanced = withDoubling((n) => n + 1);

    expect(enhanced(5)).toBe(12); // (5 + 1) * 2
  });

  it("can implement caching", () => {
    let callCount = 0;
    const cache = new Map<string, number>();

    const withCache = around<string, number>((fn, key) => {
      const cached = cache.get(key);
      if (cached !== undefined) return cached;
      const result = fn(key);
      cache.set(key, result);
      return result;
    });

    const expensive = withCache((key) => {
      callCount++;
      return key.length;
    });

    expect(expensive("hello")).toBe(5);
    expect(expensive("hello")).toBe(5); // cached
    expect(callCount).toBe(1);
  });

  it("can implement retry", () => {
    let attempts = 0;

    const withRetry = around<number, string>((fn, input) => {
      try {
        return fn(input);
      } catch {
        return fn(input); // one retry
      }
    });

    const flaky = withRetry((n) => {
      attempts++;
      if (attempts < 2) throw new Error("flaky");
      return `ok:${n}`;
    });

    expect(flaky(42)).toBe("ok:42");
    expect(attempts).toBe(2);
  });

  it("can skip calling the original function", () => {
    const noop = around<number, string>(() => "intercepted");

    const fn = vi.fn(() => "original");
    const enhanced = noop(fn);

    expect(enhanced(1)).toBe("intercepted");
    expect(fn).not.toHaveBeenCalled();
  });
});

// --- composition ---

describe("composition", () => {
  it("before + after compose naturally", () => {
    const log: string[] = [];

    const enhanced = decorate(
      (n: number) => n * 2,
      before<number, number>((n) => log.push(`in:${n}`)),
      after<number, number>((_n, out) => log.push(`out:${out}`)),
    );

    const result = enhanced(5);

    expect(result).toBe(10);
    expect(log).toEqual(["in:5", "out:10"]);
  });

  it("around can replicate before + after", () => {
    const log: string[] = [];

    const enhanced = decorate(
      (n: number) => n * 2,
      around((fn, input) => {
        log.push(`before:${input}`);
        const output = fn(input);
        log.push(`after:${output}`);
        return output;
      }),
    );

    enhanced(3);

    expect(log).toEqual(["before:3", "after:6"]);
  });
});
