/**
 * Creates a function that negates the result of the predicate.
 *
 * @template Args - The argument types of the predicate.
 * @param predicate - The predicate to negate.
 * @returns The new negated function.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const isEven = (n: number) => n % 2 === 0;
 * const isOdd = negate(isEven);
 *
 * isOdd(1); // => true
 * isOdd(2); // => false
 *
 * // Use with array methods
 * [1, 2, 3, 4, 5].filter(negate(isEven));
 * // => [1, 3, 5]
 *
 * // With multiple arguments
 * const includes = (arr: number[], val: number) => arr.includes(val);
 * const excludes = negate(includes);
 * excludes([1, 2, 3], 4); // => true
 * ```
 */
export function negate<Args extends unknown[]>(
  predicate: (...args: Args) => unknown
): (...args: Args) => boolean {
  return (...args) => !predicate(...args);
}
