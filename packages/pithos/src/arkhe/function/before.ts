/**
 * Creates a function that invokes func at most n-1 times.
 * Subsequent calls return the result of the last invocation.
 *
 * @template Args - The argument types of the function.
 * @template Return - The return type of the function.
 * @param func - The function to restrict.
 * @param n - The number of calls at which func is no longer invoked.
 * @returns The new restricted function. Returns `undefined` until func is first invoked.
 * @throws {RangeError} If n is negative or not an integer.
 * @see after - Inverse operation: invokes func only after n calls.
 * @since 2.0.0
 *
 * @note When n ≤ 1, func is never invoked and `undefined` is always returned.
 *
 * @example
 * ```typescript
 * let count = 0;
 * const increment = before(() => ++count, 3);
 *
 * increment(); // => 1
 * increment(); // => 2
 * increment(); // => 2 (no longer invoked)
 * increment(); // => 2
 *
 * // Use case: Initialize only once
 * const initialize = before(() => {
 *   console.log('Initializing...');
 *   return { ready: true };
 * }, 2);
 *
 * initialize(); // "Initializing..." => { ready: true }
 * initialize(); // => { ready: true } (cached)
 * ```
 */
export function before<Args extends unknown[], Return>(
    func: (...args: Args) => Return,
    n: number
  ): (...args: Args) => Return | undefined {
    // Stryker disable next-line EqualityOperator: n < 0 catches negative values
    if (n < 0) throw new RangeError("n must be non-negative");
    // Stryker disable next-line all: validates integer constraint
    if (!Number.isInteger(n)) throw new RangeError("n must be an integer");
  
    let count = 0;
    let lastResult: Return | undefined;
  
    return (...args) => {
      // Stryker disable next-line EqualityOperator: < n ensures func invoked exactly n-1 times
      if (++count < n) {
        lastResult = func(...args);
      }
      return lastResult;
    };
  }
  