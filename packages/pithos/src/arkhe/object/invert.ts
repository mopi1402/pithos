//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-18
/**
 * Creates a new object by swapping keys and values.
 *
 * @template T - The type of the input object.
 * @param object - The object to invert.
 * @returns A new object with keys and values swapped.
 * @since 1.1.0
 *
 * @note Duplicate values: last key wins.
 * @note Symbol keys are included via Reflect.ownKeys.
 *
 * @performance O(n) time & space.
 *
 * @example
 * ```typescript
 * invert({ a: 1, b: 2, c: 3 });
 * // => { 1: 'a', 2: 'b', 3: 'c' }
 *
 * invert({ a: 1, b: 1, c: 2 });
 * // => { 1: 'b', 2: 'c' }
 *
 * const statusCodes = { success: 200, notFound: 404 };
 * const codeToStatus = invert(statusCodes);
 * codeToStatus[200]; // => 'success'
 * ```
 */
export function invert<T extends Record<PropertyKey, PropertyKey>>(
  object: T
): Record<T[keyof T], keyof T> {
  const result = {} as Record<PropertyKey, PropertyKey>;

  for (const key of Reflect.ownKeys(object)) {
    const value = object[key as keyof T];
    result[value] = key;
  }

  return result as Record<T[keyof T], keyof T>;
}
