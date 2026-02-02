//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates an array of unique values present in all arrays, using a comparator for equality.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - An array of arrays to inspect.
 * @param comparator - A function that returns true if two elements are equivalent.
 * @returns A new array containing elements present in all input arrays.
 * @since 1.1.0
 *
 * @performance O(n² × m) — custom comparators cannot leverage Set optimization.
 *
 * @example
 * ```typescript
 * intersectionWith(
 *   [[{ x: 1 }, { x: 2 }], [{ x: 2 }, { x: 3 }]],
 *   (a, b) => a.x === b.x
 * );
 * // => [{ x: 2 }]
 *
 * intersectionWith(
 *   [[1.1, 2.2], [2.3, 3.1]],
 *   (a, b) => Math.floor(a) === Math.floor(b)
 * );
 * // => [2.2]
 * ```
 */
export function intersectionWith<T>(
  arrays: readonly (readonly T[])[],
  comparator: (a: T, b: T) => boolean
): T[] {
  if (arrays.length === 0) return [];

  const [first, ...rest] = arrays;

  // Stryker disable next-line ConditionalExpression: equivalent mutant, filter on empty array returns []
  if (first.length === 0) return [];

  const isInAllArrays = (item: T): boolean =>
    rest.every((arr) => arr.some((other) => comparator(item, other)));

  const isUnique = (item: T, index: number): boolean =>
    first.findIndex((other) => comparator(item, other)) === index;

  return first.filter(
    (item, index) => isUnique(item, index) && isInAllArrays(item)
  );
}
