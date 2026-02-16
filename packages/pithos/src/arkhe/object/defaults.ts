/**
 * Assigns source properties to destination only where destination is undefined.
 *
 * @template T - The type of the destination object.
 * @param object - The destination object.
 * @param sources - The source objects.
 * @returns A new object with defaults applied (does not mutate original).
 * @since 2.0.0
 *
 * @note Only `undefined` values are replaced. `null` values are preserved.
 * @note Inherited properties (e.g., from Object.prototype) are not considered undefined.
 *
 * @performance O(n×m) where n = number of sources, m = average keys per source
 *
 * @example
 * ```typescript
 * const target = { a: 1, b: undefined, c: 3 };
 * const source = { b: 2, c: 4, d: 5 };
 *
 * defaults(target, source);
 * // => { a: 1, b: 2, c: 3, d: 5 }
 *
 * // Original is not mutated
 * target.b; // => undefined (unchanged)
 *
 * // null is preserved (not undefined)
 * defaults({ city: null }, { city: 'Paris' });
 * // => { city: null }
 *
 * // Multiple sources (first wins)
 * defaults({ a: 1 }, { b: 2 }, { b: 3, c: 4 });
 * // => { a: 1, b: 2, c: 4 }
 * ```
 */
export function defaults<T extends Record<string, unknown>>(
  object: T,
  ...sources: Record<string, unknown>[]
): T {
  const result = { ...object } as Record<string, unknown>;

  for (const source of sources) {
    for (const key in source) {
      if (
        Object.prototype.hasOwnProperty.call(source, key) &&
        result[key] === undefined
      ) {
        result[key] = source[key];
      }
    }
  }

  return result as T;
}
