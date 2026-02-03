/**
 * Applies a transformation to a value when a predicate is false, otherwise returns the original value.
 *
 * This is the logical opposite of `when`.
 *
 * @template T - The type of the input value.
 * @template Result - The type of the transformed value.
 * @param value - The value to potentially transform.
 * @param predicate - A function that determines when NOT to apply the transformation.
 * @param transformation - The function to apply when the predicate is false.
 * @returns The transformed value if predicate is false, otherwise the original value.
 * @since 1.1.0
 *
 * @note Logical opposite of `when`.
 *
 * @see when
 *
 * @example
 * ```typescript
 * unless(4, (n) => n % 2 !== 0, (n) => n * 2);
 * // => 8 (4 is not odd, so transformation applies)
 *
 * unless(3, (n) => n % 2 !== 0, (n) => n * 2);
 * // => 3 (3 is odd, so no transformation)
 *
 * unless('hello', (s) => s.trim() === '', (s) => s.toUpperCase());
 * // => 'HELLO' (not empty, so transformation applies)
 *
 * unless('', (s) => s.trim() === '', (s) => s.toUpperCase());
 * // => '' (empty, so no transformation)
 * ```
 */
export function unless<T, Result>(
  value: T,
  predicate: (value: T) => boolean,
  transformation: (value: T) => Result
): T | Result {
  return predicate(value) ? value : transformation(value);
}
