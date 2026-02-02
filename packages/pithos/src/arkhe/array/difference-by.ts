//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates an array of values from the first array that are not present in the second array,
 * using an iteratee to compute the comparison value.
 *
 * @template T - The type of elements in the arrays.
 * @param array - The source array to filter.
 * @param values - The values to exclude.
 * @param iteratee - A function or property key to compute the comparison value.
 * @returns A new array containing elements whose computed values are not in `values`.
 * @since 1.1.0
 *
 * @performance O(n + m) time & space, uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * differenceBy([2.1, 1.2, 3.3], [2.3, 3.4], Math.floor);
 * // => [1.2]
 *
 * differenceBy(
 *   [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
 *   [{ id: 2, name: 'Bobby' }],
 *   'id'
 * );
 * // => [{ id: 1, name: 'Alice' }]
 * ```
 */
export function differenceBy<T>(
  array: readonly T[],
  values: readonly T[],
  iteratee: ((item: T) => unknown) | keyof T
): T[] {
  const getValue: (item: T) => unknown =
    typeof iteratee === "function" ? iteratee : (item) => item[iteratee];

  const excludeSet = new Set(values.map(getValue));

  return array.filter((item) => !excludeSet.has(getValue(item)));
}
