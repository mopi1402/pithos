/**
 * Checks if a value is a Map instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Map, `false` otherwise.
 * @since 2.0.0
 *
 * @see isSet
 * @see isWeakMap
 *
 * @example
 * ```typescript
 * isMap(new Map());              // => true
 * isMap(new Map([['a', 1]]));    // => true
 * isMap({});                     // => false
 * isMap(new WeakMap());          // => false
 * ```
 */
export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  value instanceof Map;
