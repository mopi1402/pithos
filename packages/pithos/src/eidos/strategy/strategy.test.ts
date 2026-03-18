import { describe, it, expect } from "vitest";
import {
  type Strategy,
  createStrategies,
  safeStrategy,
  withFallback,
  withValidation,
} from "./strategy";
import { isSome, isNone } from "@zygos/option";
import { number } from "@kanon";

// --- Strategy type ---

describe("Strategy type", () => {
  it("is just a function", () => {
    const double: Strategy<number, number> = (n) => n * 2;

    expect(double(5)).toBe(10);
  });
});

// --- createStrategies ---

describe("createStrategies", () => {
  const sorting = createStrategies({
    asc: (data: number[]) => [...data].sort((a, b) => a - b),
    desc: (data: number[]) => [...data].sort((a, b) => b - a),
  });

  it("executes a strategy by key", () => {
    expect(sorting.execute("asc", [3, 1, 2])).toEqual([1, 2, 3]);
    expect(sorting.execute("desc", [3, 1, 2])).toEqual([3, 2, 1]);
  });

  it("returns a strategy function with use()", () => {
    const sortAsc = sorting.use("asc");

    expect(sortAsc([5, 3, 1])).toEqual([1, 3, 5]);
  });

  it("returns Some for existing key with get()", () => {
    const result = sorting.get("asc");

    expect(isSome(result)).toBe(true);
    if (isSome(result)) {
      expect(result.value([3, 1, 2])).toEqual([1, 2, 3]);
    }
  });

  it("returns None for unknown key with get()", () => {
    const result = sorting.get("unknown");

    expect(isNone(result)).toBe(true);
  });

  it("strategies are interchangeable at runtime", () => {
    const keys = ["asc", "desc"] as const;
    const data = [3, 1, 2];

    const results = keys.map((key) => sorting.execute(key, data));

    expect(results[0]).toEqual([1, 2, 3]);
    expect(results[1]).toEqual([3, 2, 1]);
  });
});

// --- safeStrategy (zygos integration) ---

describe("safeStrategy", () => {
  it("wraps success in Ok", () => {
    const parse = safeStrategy((input: string) => JSON.parse(input));
    const result = parse('{"ok":true}');

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ ok: true });
    }
  });

  it("wraps thrown error in Err", () => {
    const parse = safeStrategy((input: string) => JSON.parse(input));
    const result = parse("not json");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it("wraps non-Error throws in Err with Error wrapper", () => {
    const fail = safeStrategy(() => {
      throw "string error";
    });
    const result = fail(undefined as never);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("string error");
    }
  });
});

// --- withFallback ---

describe("withFallback", () => {
  it("uses primary when it succeeds", () => {
    const primary: Strategy<number, string> = (n) => `primary:${n}`;
    const fallback: Strategy<number, string> = (n) => `fallback:${n}`;

    const strategy = withFallback(primary, fallback);

    expect(strategy(42)).toBe("primary:42");
  });

  it("falls back when primary throws", () => {
    const primary: Strategy<number, string> = () => {
      throw new Error("boom");
    };
    const fallback: Strategy<number, string> = (n) => `fallback:${n}`;

    const strategy = withFallback(primary, fallback);

    expect(strategy(42)).toBe("fallback:42");
  });

  it("can be chained for multiple fallbacks", () => {
    const a: Strategy<number, string> = () => { throw new Error("a"); };
    const b: Strategy<number, string> = () => { throw new Error("b"); };
    const c: Strategy<number, string> = (n) => `c:${n}`;

    const strategy = withFallback(withFallback(a, b), c);

    expect(strategy(1)).toBe("c:1");
  });
});

// --- withValidation (kanon + bridges + zygos integration) ---

describe("withValidation", () => {
  const doublePositive = withValidation(
    number().min(0),
    (n) => n * 2,
  );

  it("returns Ok when input is valid", () => {
    const result = doublePositive(5);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(10);
    }
  });

  it("returns Err when input fails validation", () => {
    const result = doublePositive(-1);

    expect(result.isErr()).toBe(true);
  });

  it("returns Err when input is wrong type", () => {
    const result = doublePositive("hello");

    expect(result.isErr()).toBe(true);
  });

  it("is chainable with map", () => {
    const result = doublePositive(5).map((n) => `result:${n}`);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe("result:10");
    }
  });
});


// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] use() returns the actual strategy function", () => {
    const strategies = createStrategies({
      double: (n: number) => n * 2,
    });

    const fn = strategies.use("double");
    expect(fn(5)).toBe(10);
  });

  it("[👾] execute() calls the strategy with input", () => {
    const strategies = createStrategies({
      add10: (n: number) => n + 10,
    });

    expect(strategies.execute("add10", 5)).toBe(15);
  });

  it("[👾] withValidation returns the transformed result", () => {
    const transform = withValidation(number(), (n) => n * 3);
    const result = transform(7);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(21);
    }
  });
});
