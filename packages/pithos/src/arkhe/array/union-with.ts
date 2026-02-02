/**
 * Creates an array of unique values from all given arrays using a comparator function.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - The arrays to combine.
 * @param comparator - The function invoked to compare elements.
 * @returns A new array with unique elements.
 * @since 1.1.0
 *
 * @note First occurrence wins when duplicates are found.
 *
 * @performance O(n²) — custom comparators cannot leverage Set optimization.
 *
 * @example
 * ```typescript
 * const objects = [
 *   [{ x: 1, y: 2 }, { x: 2, y: 1 }],
 *   [{ x: 1, y: 2 }, { x: 3, y: 4 }]
 * ];
 *
 * unionWith(objects, (a, b) => a.x === b.x && a.y === b.y);
 * // => [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 4 }]
 * ```
 */
export function unionWith<T>(
  arrays: readonly (readonly T[])[],
  comparator: (a: T, b: T) => boolean
): T[] {
  // Stryker disable next-line ConditionalExpression: Early return optimization - empty arrays loop produces identical empty result
  if (arrays.length === 0) return [];

  const result: T[] = [];

  for (const array of arrays) {
    for (const item of array) {
      const isDuplicate = result.some((existing) => comparator(existing, item));
      if (!isDuplicate) {
        result.push(item);
      }
    }
  }

  return result;
}
