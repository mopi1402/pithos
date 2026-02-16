/**
 * Creates a function that gets the argument at index n.
 *
 * @param n - The index of the argument to return.
 * @returns A function that returns the nth argument.
 * @deprecated Use an inline arrow function `(...args) => args[n]` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const getSecond = nthArg(1);
 * getSecond('a', 'b', 'c');  // => 'b'
 *
 * // ✅ Recommended approach
 * const getSecond = (...args: string[]) => args[1];
 * getSecond('a', 'b', 'c');  // => 'b'
 * ```
 */
export function nthArg(n: number): (...args: unknown[]) => unknown {
  return (...args: unknown[]) => {
    const index = n < 0 ? args.length + n : n;
    return args[index];
  };
}
