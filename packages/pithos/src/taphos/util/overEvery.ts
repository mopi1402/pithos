/**
 * Creates a function that checks if all of the predicates return truthy when invoked with the arguments it receives.
 *
 * @template T - The type of the value to check.
 * @param predicates - The predicates to check.
 * @returns A function that returns true if all predicates pass.
 * @deprecated Use `predicates.every(fn => fn(value))` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array.every() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const isPositiveEven = overEvery([n => n > 0, n => n % 2 === 0]);
 * isPositiveEven(4);   // => true
 * isPositiveEven(-2);  // => false
 *
 * // ✅ Recommended approach
 * const predicates = [(n: number) => n > 0, (n: number) => n % 2 === 0];
 * const isPositiveEven = (n: number) => predicates.every(fn => fn(n));
 * isPositiveEven(4);   // => true
 * isPositiveEven(-2);  // => false
 * ```
 */
export function overEvery<T>(
  predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  return (value: T) => predicates.every((predicate) => predicate(value));
}
