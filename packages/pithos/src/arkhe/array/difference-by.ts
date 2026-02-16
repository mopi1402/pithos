/**
 * Creates an array of values from the first array that are not present in the second array,
 * using an iteratee to compute the comparison value.
 *
 * @template T - The type of elements in the arrays.
 * @param array - The source array to filter.
 * @param values - The values to exclude.
 * @param iteratee - A function or property key to compute the comparison value.
 * @returns A new array containing elements whose computed values are not in `values`.
 * @since 2.0.0
 *
 * @performance O(n + m) time & space, uses hash map for constant-time lookups.
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const excludeMap: Record<any, true> = Object.create(null);

  for (let i = 0; i < values.length; i++) {
    excludeMap[getValue(values[i]) as string] = true;
  }

  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (!excludeMap[getValue(array[i]) as string]) {
      result.push(array[i]);
    }
  }

  return result;
}
