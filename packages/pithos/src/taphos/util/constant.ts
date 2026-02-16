/**
 * Creates a function that returns value.
 *
 * @template T - The type of the value.
 * @param value - The value to return.
 * @returns A function that returns the value.
 * @deprecated Use an inline arrow function `() => value` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const getDefault = constant({ user: 'guest' });
 * getDefault();  // => { user: 'guest' }
 *
 * // ✅ Recommended approach
 * const getDefault = () => ({ user: 'guest' });
 * getDefault();  // => { user: 'guest' }
 * ```
 */
export function constant<T>(value: T): () => T {
  return () => value;
}
