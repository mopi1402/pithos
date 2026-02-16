/**
 * Applies a transformation to a value when a predicate is true.
 *
 * @template T - The type of the input value.
 * @template Result - The type of the transformed value.
 * @param value - The value to potentially transform.
 * @param predicate - Function that returns true to apply transformation.
 * @param transformation - The function to apply when predicate is true.
 * @returns The transformed value if predicate is true, otherwise the original value.
 * @since 2.0.0
 *
 * @note Logical opposite of `unless`.
 *
 * @see unless
 *
 * @example
 * ```typescript
 * when(4, (n) => n % 2 === 0, (n) => n * 2);
 * // => 8 (4 is even, predicate true, transforms)
 *
 * when(3, (n) => n % 2 === 0, (n) => n * 2);
 * // => 3 (3 is odd, predicate false, skips)
 *
 * when('hello world', (s) => s.length > 10, (s) => s.slice(0, 10) + '...');
 * // => 'hello worl...'
 * ```
 */
export function when<T, Result>(
  value: T,
  predicate: (value: T) => boolean,
  transformation: (value: T) => Result
): T | Result {
  return predicate(value) ? transformation(value) : value;
}
