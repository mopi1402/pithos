/**
 * Creates a new object by swapping keys and values.
 *
 * @template T - The type of the input object.
 * @param object - The object to invert.
 * @returns A new object with keys and values swapped.
 * @since 2.0.0
 *
 * @note Duplicate values: last key wins.
 * @note Only enumerable string keys are included (Symbol keys are ignored).
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
  const keys = Object.keys(object);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[object[key as keyof T]] = key;
  }

  return result as Record<T[keyof T], keyof T>;
}
