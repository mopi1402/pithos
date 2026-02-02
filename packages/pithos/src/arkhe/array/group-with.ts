//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Groups adjacent elements that satisfy a predicate function.
 *
 * @template T - The type of elements in the array.
 * @param array - The input array to group.
 * @param predicate - A function that returns true if two adjacent elements should be grouped.
 * @returns An array of arrays, where each inner array contains consecutive elements that satisfy the predicate.
 * @since 1.1.0
 *
 * @performance O(n) time & space, single pass with early returns for empty/single-element arrays.
 *
 * @example
 * ```typescript
 * groupWith([0, 1, 2, 4, 5], (a, b) => a + 1 === b);
 * // => [[0, 1, 2], [4, 5]]
 *
 * groupWith(['a', 'a', 'b', 'c', 'c'], (a, b) => a === b);
 * // => [['a', 'a'], ['b'], ['c', 'c']]
 *
 * groupWith([20, 21, 22, 15, 16], (a, b) => Math.abs(a - b) <= 2);
 * // => [[20, 21, 22], [15, 16]]
 * ```
 */
export function groupWith<T>(
  array: readonly T[],
  predicate: (a: T, b: T) => boolean
): T[][] {
  if (array.length === 0) return [];
  // Stryker disable next-line ConditionalExpression: equivalent mutant, loop naturally handles length=1
  if (array.length === 1) return [[array[0]]];

  const result: T[][] = [];
  let currentGroup: T[] = [array[0]];

  for (let i = 1; i < array.length; i++) {
    if (predicate(array[i - 1], array[i])) {
      currentGroup.push(array[i]);
    } else {
      result.push(currentGroup);
      currentGroup = [array[i]];
    }
  }

  result.push(currentGroup);

  return result;
}
