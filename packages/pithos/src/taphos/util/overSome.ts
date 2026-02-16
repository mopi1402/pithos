/**
 * Creates a function that checks if any of the predicates return truthy when invoked with the arguments it receives.
 *
 * @template T - The type of the value to check.
 * @param predicates - The predicates to check.
 * @returns A function that returns true if any predicate passes.
 * @deprecated Use `predicates.some(fn => fn(value))` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array.some() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const isPositiveOrEven = overSome([n => n > 0, n => n % 2 === 0]);
 * isPositiveOrEven(-2);  // => true (even)
 * isPositiveOrEven(-3);  // => false
 *
 * // ✅ Recommended approach
 * const predicates = [(n: number) => n > 0, (n: number) => n % 2 === 0];
 * const isPositiveOrEven = (n: number) => predicates.some(fn => fn(n));
 * isPositiveOrEven(-2);  // => true (even)
 * isPositiveOrEven(-3);  // => false
 * ```
 */
export function overSome<T>(
  predicates: Array<(value: T) => boolean>
): (value: T) => boolean {
  return (value: T) => predicates.some((predicate) => predicate(value));
}
