import { describe, it, expect } from "vitest";
import {
  createIterable,
  lazyRange,
  iterate,
  map,
  filter,
  take,
  toArray,
  reduce,
} from "./iterator";
import { some, none } from "@zygos/option";

// --- createIterable ---

describe("createIterable", () => {
  it("creates an iterable from a factory function", () => {
    const iter = createIterable(() => {
      let i = 0;
      return () => (i < 3 ? some(i++) : none);
    });

    expect(toArray(iter)).toEqual([0, 1, 2]);
  });

  it("can be iterated multiple times", () => {
    const iter = createIterable(() => {
      let i = 0;
      return () => (i < 2 ? some(i++) : none);
    });

    expect(toArray(iter)).toEqual([0, 1]);
    expect(toArray(iter)).toEqual([0, 1]);
  });

  it("works with for...of", () => {
    const iter = createIterable(() => {
      let i = 0;
      return () => (i < 3 ? some(i++) : none);
    });

    const result: number[] = [];
    for (const value of iter) {
      result.push(value);
    }

    expect(result).toEqual([0, 1, 2]);
  });

  it("handles empty iterables", () => {
    const iter = createIterable(() => () => none);

    expect(toArray(iter)).toEqual([]);
  });
});

// --- lazyRange ---

describe("lazyRange", () => {
  it("creates an ascending range", () => {
    expect(toArray(lazyRange(0, 5))).toEqual([0, 1, 2, 3, 4]);
  });

  it("creates a range with custom step", () => {
    expect(toArray(lazyRange(0, 10, 3))).toEqual([0, 3, 6, 9]);
  });

  it("creates a descending range", () => {
    expect(toArray(lazyRange(5, 0, -1))).toEqual([5, 4, 3, 2, 1]);
  });

  it("handles empty range when start equals end", () => {
    expect(toArray(lazyRange(5, 5))).toEqual([]);
  });

  it("handles empty range when step goes wrong direction", () => {
    expect(toArray(lazyRange(0, 5, -1))).toEqual([]);
    expect(toArray(lazyRange(5, 0, 1))).toEqual([]);
  });

  it("supports infinite range with take", () => {
    expect(toArray(take(5)(lazyRange(0, Infinity)))).toEqual([0, 1, 2, 3, 4]);
  });

  it("defaults end to Infinity", () => {
    expect(toArray(take(3)(lazyRange(10)))).toEqual([10, 11, 12]);
  });
});

// --- iterate ---

describe("iterate", () => {
  it("produces seed as first element", () => {
    const iter = iterate(1, (n) => n * 2);

    expect(toArray(take(1)(iter))).toEqual([1]);
  });

  it("applies function repeatedly", () => {
    const powers = iterate(1, (n) => n * 2);

    expect(toArray(take(5)(powers))).toEqual([1, 2, 4, 8, 16]);
  });

  it("works with non-numeric types", () => {
    const strings = iterate("a", (s) => s + "a");

    expect(toArray(take(4)(strings))).toEqual(["a", "aa", "aaa", "aaaa"]);
  });

  it("can be iterated multiple times", () => {
    const iter = iterate(0, (n) => n + 1);

    expect(toArray(take(3)(iter))).toEqual([0, 1, 2]);
    expect(toArray(take(3)(iter))).toEqual([0, 1, 2]);
  });
});

// --- map ---

describe("map", () => {
  it("transforms each element", () => {
    const doubled = map((n: number) => n * 2)(lazyRange(1, 4));

    expect(toArray(doubled)).toEqual([2, 4, 6]);
  });

  it("is lazy", () => {
    let calls = 0;
    const mapped = map((n: number) => {
      calls++;
      return n * 2;
    })(lazyRange(0, 100));

    // No calls until consumed
    expect(calls).toBe(0);

    toArray(take(3)(mapped));
    expect(calls).toBe(3);
  });

  it("handles empty iterables", () => {
    const mapped = map((n: number) => n * 2)(lazyRange(0, 0));

    expect(toArray(mapped)).toEqual([]);
  });

  it("can change element type", () => {
    const strings = map((n: number) => `num:${n}`)(lazyRange(1, 4));

    expect(toArray(strings)).toEqual(["num:1", "num:2", "num:3"]);
  });
});

// --- filter ---

describe("filter", () => {
  it("keeps elements matching predicate", () => {
    const evens = filter((n: number) => n % 2 === 0)(lazyRange(0, 10));

    expect(toArray(evens)).toEqual([0, 2, 4, 6, 8]);
  });

  it("is lazy", () => {
    let calls = 0;
    const filtered = filter((n: number) => {
      calls++;
      return n % 2 === 0;
    })(lazyRange(0, 100));

    expect(calls).toBe(0);

    toArray(take(3)(filtered));
    // Called until 3 evens found: 0, 1, 2, 3, 4 = 5 calls
    expect(calls).toBe(5);
  });

  it("handles no matches", () => {
    const none = filter((n: number) => n > 100)(lazyRange(0, 10));

    expect(toArray(none)).toEqual([]);
  });

  it("handles all matches", () => {
    const all = filter(() => true)(lazyRange(0, 3));

    expect(toArray(all)).toEqual([0, 1, 2]);
  });
});

// --- take ---

describe("take", () => {
  it("takes first n elements", () => {
    expect(toArray(take(3)(lazyRange(0, 10)))).toEqual([0, 1, 2]);
  });

  it("takes all if n exceeds length", () => {
    expect(toArray(take(100)(lazyRange(0, 3)))).toEqual([0, 1, 2]);
  });

  it("takes none if n is 0", () => {
    expect(toArray(take(0)(lazyRange(0, 10)))).toEqual([]);
  });

  it("takes none if n is negative", () => {
    expect(toArray(take(-5)(lazyRange(0, 10)))).toEqual([]);
  });

  it("is lazy", () => {
    let calls = 0;
    const source = createIterable(() => {
      let i = 0;
      return () => {
        calls++;
        return i < 100 ? some(i++) : none;
      };
    });

    toArray(take(3)(source));
    expect(calls).toBe(3);
  });
});

// --- toArray ---

describe("toArray", () => {
  it("collects all elements", () => {
    expect(toArray(lazyRange(0, 5))).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns empty array for empty iterable", () => {
    expect(toArray(lazyRange(0, 0))).toEqual([]);
  });

  it("works with native arrays", () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

// --- reduce ---

describe("reduce", () => {
  it("reduces to a single value", () => {
    const sum = reduce((acc: number, n: number) => acc + n, 0)(lazyRange(1, 6));

    expect(sum).toBe(15);
  });

  it("returns seed for empty iterable", () => {
    const result = reduce((acc: number, n: number) => acc + n, 42)(lazyRange(0, 0));

    expect(result).toBe(42);
  });

  it("can change accumulator type", () => {
    const concat = reduce((acc: string, n: number) => acc + n, "")(lazyRange(1, 4));

    expect(concat).toBe("123");
  });
});

// --- Composition ---

describe("composition", () => {
  it("chains map, filter, take", () => {
    const result = toArray(
      take(5)(
        filter((n: number) => n % 2 === 0)(
          map((n: number) => n * 2)(lazyRange(0, Infinity))
        )
      )
    );

    // 0*2=0, 1*2=2, 2*2=4, 3*2=6, 4*2=8 (all even)
    expect(result).toEqual([0, 2, 4, 6, 8]);
  });

  it("example from module docs", () => {
    const result = toArray(
      take(5)(
        filter((n: number) => n % 2 === 0)(
          lazyRange(0, Infinity)
        )
      )
    );

    expect(result).toEqual([0, 2, 4, 6, 8]);
  });
});

// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] createIterable returns values from factory", () => {
    const iter = createIterable(() => {
      let i = 10;
      return () => (i < 13 ? some(i++) : none);
    });

    expect(toArray(iter)).toEqual([10, 11, 12]);
  });

  it("[👾] lazyRange respects start value", () => {
    expect(toArray(lazyRange(5, 8))).toEqual([5, 6, 7]);
  });

  it("[👾] lazyRange respects step value", () => {
    expect(toArray(lazyRange(0, 10, 2))).toEqual([0, 2, 4, 6, 8]);
  });

  it("[👾] lazyRange with step=0 returns empty (not infinite)", () => {
    // With step=0: step > 0 is false, so we check current <= end
    // 0 <= 5 is true, so we return none immediately
    // This tests that step > 0 (not step >= 0) is used
    // If mutation changes to step >= 0, it would produce infinite 0s
    const result = toArray(lazyRange(0, 5, 0));
    expect(result).toEqual([]);
  });

  it("[👾] iterate applies function to previous value", () => {
    const result = toArray(take(4)(iterate(2, (n) => n + 3)));

    expect(result).toEqual([2, 5, 8, 11]);
  });

  // These tests specifically target ArrowFunction mutations that replace
  // the curried functions with () => undefined
  
  it("[👾] map returns function, not undefined", () => {
    // If map is mutated to () => undefined, this will fail
    const mapFn = map((x: number) => x * 2);
    // Explicit check that it's a function
    if (typeof mapFn !== "function") {
      throw new Error("map should return a function");
    }
    const result = mapFn([1, 2, 3]);
    expect(toArray(result)).toEqual([2, 4, 6]);
  });

  it("[👾] filter returns function, not undefined", () => {
    // If filter is mutated to () => undefined, this will fail
    const filterFn = filter((x: number) => x % 2 === 0);
    // Explicit check that it's a function
    if (typeof filterFn !== "function") {
      throw new Error("filter should return a function");
    }
    const result = filterFn([1, 2, 3, 4]);
    expect(toArray(result)).toEqual([2, 4]);
  });

  it("[👾] take returns function, not undefined", () => {
    // If take is mutated to () => undefined, this will fail
    const takeFn = take<number>(2);
    // Explicit check that it's a function
    if (typeof takeFn !== "function") {
      throw new Error("take should return a function");
    }
    const result = takeFn([1, 2, 3, 4]);
    expect(toArray(result)).toEqual([1, 2]);
  });

  it("[👾] reduce returns function, not undefined", () => {
    // If reduce is mutated to () => undefined, this will fail
    const reduceFn = reduce((acc: number, x: number) => acc + x, 0);
    // Explicit check that it's a function
    if (typeof reduceFn !== "function") {
      throw new Error("reduce should return a function");
    }
    const result = reduceFn([1, 2, 3, 4]);
    expect(result).toBe(10);
  });
});
