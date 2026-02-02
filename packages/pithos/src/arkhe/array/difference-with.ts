//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates an array of values from the first array that are not included in the second array,
 * using a comparator function to determine equality.
 *
 * @template T - The type of elements in the source array.
 * @template U - The type of elements in the values array (defaults to T).
 * @param array - The source array to inspect.
 * @param values - The array of values to exclude.
 * @param comparator - The function invoked to compare elements.
 * @returns A new array of filtered values.
 * @since 1.1.0
 *
 * @performance O(n × m) — custom comparators cannot leverage Set optimization.
 *
 * @example
 * ```typescript
 * // Same types
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }];
 * differenceWith(objects, [{ x: 1, y: 2 }], (a, b) => a.x === b.x && a.y === b.y);
 * // => [{ x: 2, y: 1 }]
 *
 * // Different types
 * differenceWith(
 *   [{ id: 1 }, { id: 2 }, { id: 3 }],
 *   [2, 4],
 *   (obj, id) => obj.id === id
 * );
 * // => [{ id: 1 }, { id: 3 }]
 *
 * // Tolerance comparison
 * differenceWith([1.1, 2.2, 3.3], [1.0, 3.0], (a, b) => Math.abs(a - b) < 0.5);
 * // => [2.2]
 * ```
 */
export function differenceWith<T, U = T>(
  array: readonly T[],
  values: readonly U[],
  comparator: (a: T, b: U) => boolean
): T[] {
  return array.filter(
    (item) => !values.some((value) => comparator(item, value))
  );
}
