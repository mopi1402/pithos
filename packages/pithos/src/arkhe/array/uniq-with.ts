/**
 * Creates a duplicate-free version of an array using a comparator function.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to inspect.
 * @param comparator - The function invoked to compare elements.
 * @returns A new array with unique elements.
 * @since 2.0.0
 *
 * @note First occurrence wins when duplicates are found.
 *
 * @performance O(n²) — custom comparators cannot leverage Set optimization.
 *
 * @example
 * ```typescript
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 2 }];
 *
 * uniqWith(objects, (a, b) => a.x === b.x && a.y === b.y);
 * // => [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 * ```
 */
export function uniqWith<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  const result: T[] = [];

  for (const item of array) {
    const isDuplicate = result.some((existing) => comparator(existing, item));
    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result;
}
