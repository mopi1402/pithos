//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-30
/**
 * Creates an array of unique values present in all arrays, using an iteratee for comparison.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - An array of arrays to inspect.
 * @param iteratee - A function that returns the comparison value for each element.
 * @returns A new array containing elements present in all input arrays.
 * @since 1.1.0
 *
 * @performance O(n × m) where n = first array length, m = number of arrays.
 *
 * @example
 * ```typescript
 * intersectionBy(
 *   [[{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }]],
 *   (item) => item.id
 * );
 * // => [{ id: 2 }]
 *
 * intersectionBy([[1.2, 2.4], [2.5, 3.1]], Math.floor);
 * // => [2.4]
 * ```
 */
export function intersectionBy<T>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => unknown
): T[] {
  if (arrays.length === 0) return [];

  const [first, ...rest] = arrays;

  // Stryker disable next-line ConditionalExpression: equivalent mutant, filter on empty array returns []
  if (first.length === 0) return [];

  const sets = rest.map((arr) => new Set(arr.map(iteratee)));
  const seen = new Set<unknown>();

  return first.filter((item) => {
    const value = iteratee(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return sets.every((set) => set.has(value));
  });
}
