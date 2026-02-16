/**
 * Checks if a value is an array.
 *
 * @template T - The expected element type of the array.
 * @param value - The value to check.
 * @returns `true` if the value is an array, `false` otherwise.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * isArray([1, 2, 3]); // => true
 * isArray('hello');   // => false
 *
 * // Use instead
 * Array.isArray([1, 2, 3]); // => true
 * ```
 */
export const isArray = <T>(value: unknown): value is T[] =>
  Array.isArray(value);
