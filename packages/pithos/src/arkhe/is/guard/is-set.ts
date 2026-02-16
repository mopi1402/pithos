/**
 * Checks if a value is a Set instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Set, `false` otherwise.
 * @since 2.0.0
 *
 * @see isMap
 * @see isWeakSet
 *
 * @example
 * ```typescript
 * isSet(new Set());        // => true
 * isSet(new Set([1, 2]));  // => true
 * isSet([]);               // => false
 * isSet(new WeakSet());    // => false
 * isSet(new Map());        // => false
 * ```
 */
export const isSet = (value: unknown): value is Set<unknown> =>
  value instanceof Set;
