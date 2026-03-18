/**
 * Functional Iterator Pattern.
 *
 * In OOP, the Iterator pattern requires a Collection interface, an Iterator
 * interface, and concrete implementations that decouple traversal from the
 * underlying data structure.
 * In functional TypeScript, iterators are lazy sequences built on the native
 * `Iterable` protocol, created via `createIterable` which decouples traversal
 * logic from data sources.
 *
 * JavaScript already has the Iterator protocol (`Symbol.iterator`, `for...of`).
 * The core of this module is the **constructor** layer:
 * - `createIterable` - the GoF concept: decouple traversal from structure
 * - `lazyRange` - lazy numeric sequences (finite or infinite)
 * - `iterate` - unfold from a seed function
 *
 * A minimal set of **companion operators** (`map`, `filter`, `take`) and
 * **consumers** (`toArray`, `reduce`) is included to make the constructors
 * usable in practice (e.g. bounding an infinite `lazyRange` with `take`).
 * These are not general-purpose collection utilities - they exist to serve
 * the pattern.
 *
 * @module eidos/iterator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { lazyRange, map, filter, take, toArray } from "@pithos/core/eidos/iterator/iterator";
 *
 * const result = toArray(
 *   take(5)(
 *     filter((n: number) => n % 2 === 0)(
 *       lazyRange(0, Infinity)
 *     )
 *   )
 * );
 * // [0, 2, 4, 6, 8]
 * ```
 */

import { some, none } from "@zygos/option";
import type { Option } from "@zygos/option";

// -------------------------------------------------------------------------------------
// Constructors
// -------------------------------------------------------------------------------------

/**
 * Creates a lazy, re-iterable sequence from a factory that produces a "next" function.
 *
 * The factory is called each time `[Symbol.iterator]()` is invoked, ensuring
 * the iterable can be traversed multiple times. Each "next" call returns
 * `Some(value)` for the next element or `None` to signal completion.
 *
 * This is the core of the GoF Iterator pattern: it decouples traversal logic
 * (the `next` function) from the data source.
 *
 * @template T - The element type
 * @param factory - A function that creates a stateful "next" supplier
 * @returns A lazy Iterable
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Iterate over a tree in depth-first order
 * const treeIter = createIterable(() => {
 *   const stack = [rootNode];
 *   return () => {
 *     if (stack.length === 0) return none;
 *     const node = stack.pop();
 *     if (!node) return none;
 *     stack.push(...node.children);
 *     return some(node.value);
 *   };
 * });
 *
 * for (const value of treeIter) { ... }
 * ```
 */
export function createIterable<T>(factory: () => () => Option<T>): Iterable<T> {
  return {
    [Symbol.iterator](): Iterator<T> {
      const next = factory();
      return {
        next(): IteratorResult<T> {
          const result = next();
          if (result._tag === "None") return { done: true, value: undefined };
          return { done: false, value: result.value };
        },
      };
    },
  };
}

/**
 * Creates a lazy numeric range.
 *
 * Supports both ascending and descending ranges, as well as infinite ranges
 * (use `take` to bound them).
 *
 * @param start - Start value (inclusive)
 * @param end - End value (exclusive), defaults to Infinity
 * @param step - Step increment, defaults to 1
 * @returns A lazy Iterable of numbers
 * @since 2.4.0
 *
 * @example
 * ```ts
 * toArray(lazyRange(0, 5));       // [0, 1, 2, 3, 4]
 * toArray(lazyRange(0, 10, 3));   // [0, 3, 6, 9]
 * toArray(lazyRange(5, 0, -1));   // [5, 4, 3, 2, 1]
 * ```
 */
export function lazyRange(
  start: number,
  end: number = Infinity,
  step: number = 1,
): Iterable<number> {
  return createIterable(() => {
    let current = start;
    return () => {
      if (step > 0 ? current >= end : current <= end) return none;
      const value = current;
      current += step;
      return some(value);
    };
  });
}

/**
 * Creates an infinite iterable by repeatedly applying a function to a seed.
 *
 * Produces: seed, f(seed), f(f(seed)), ...
 *
 * @template T - The element type
 * @param seed - The initial value
 * @param f - The function to apply repeatedly
 * @returns An infinite lazy Iterable
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Powers of 2
 * toArray(take(5)(iterate(1, (n) => n * 2))); // [1, 2, 4, 8, 16]
 * ```
 */
export function iterate<T>(seed: T, f: (value: T) => T): Iterable<T> {
  return createIterable(() => {
    let current = seed;
    let started = false;
    return () => {
      if (!started) {
        started = true;
        return some(current);
      }
      current = f(current);
      return some(current);
    };
  });
}

// -------------------------------------------------------------------------------------
// Companion operators (minimal set to make constructors usable)
// -------------------------------------------------------------------------------------

/**
 * Lazily transforms each element.
 *
 * @template A - Input element type
 * @template B - Output element type
 * @param f - The mapping function
 * @returns A function that transforms an iterable
 * @since 2.4.0
 */
export function map<A, B>(f: (a: A) => B): (source: Iterable<A>) => Iterable<B> {
  return (source: Iterable<A>): Iterable<B> =>
    createIterable(() => {
      const iter = source[Symbol.iterator]();
      return () => {
        const { done, value } = iter.next();
        if (done) return none;
        return some(f(value));
      };
    });
}

/**
 * Lazily filters elements by a predicate.
 *
 * @template A - Element type
 * @param predicate - The filter predicate
 * @returns A function that filters an iterable
 * @since 2.4.0
 */
export function filter<A>(predicate: (a: A) => boolean): (source: Iterable<A>) => Iterable<A> {
  return (source: Iterable<A>): Iterable<A> =>
    createIterable(() => {
      const iter = source[Symbol.iterator]();
      return () => {
        while (true) {
          const { done, value } = iter.next();
          if (done) return none;
          if (predicate(value)) return some(value);
        }
      };
    });
}

/**
 * Lazily takes the first n elements.
 *
 * Essential for bounding infinite iterables.
 *
 * @template A - Element type
 * @param n - Number of elements to take
 * @returns A function that limits an iterable
 * @since 2.4.0
 */
export function take<A>(n: number): (source: Iterable<A>) => Iterable<A> {
  return (source: Iterable<A>): Iterable<A> =>
    createIterable(() => {
      const iter = source[Symbol.iterator]();
      let remaining = n;
      return () => {
        if (remaining <= 0) return none;
        const { done, value } = iter.next();
        if (done) return none;
        remaining--;
        return some(value);
      };
    });
}

// -------------------------------------------------------------------------------------
// Consumers
// -------------------------------------------------------------------------------------

/**
 * Collects all elements into an array.
 *
 * Do not use on infinite iterables without `take` first.
 *
 * @template A - Element type
 * @param source - The iterable to collect
 * @returns An array of all elements
 * @since 2.4.0
 */
export function toArray<A>(source: Iterable<A>): A[] {
  return [...source];
}

/**
 * Reduces an iterable to a single value.
 *
 * @template A - Element type
 * @template B - Accumulator type
 * @param f - The reducer function
 * @param seed - The initial accumulator
 * @returns A function that reduces an iterable
 * @since 2.4.0
 */
export function reduce<A, B>(f: (acc: B, a: A) => B, seed: B): (source: Iterable<A>) => B {
  return (source: Iterable<A>): B => {
    let acc = seed;
    for (const item of source) {
      acc = f(acc, item);
    }
    return acc;
  };
}

