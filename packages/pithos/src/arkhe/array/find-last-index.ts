//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Returns the index of the last element that satisfies the predicate, or -1 if none found.
 *
 * @template T - The type of elements in the array.
 * @param array - The source array to inspect.
 * @param predicate - The function invoked per iteration.
 * @returns The index of the found element, else -1.
 * @since 1.1.0
 *
 * @note Prefer this over native `Array.findLastIndex()` for ES2020 compatibility.
 *
 * @performance O(n) time, O(1) space, reverse iteration with early return on match.
 *
 * @see {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex | Array.findLastIndex()}
 *
 * @example
 * ```typescript
 * findLastIndex([1, 2, 3, 4, 3, 2, 1], (v) => v > 2);
 * // => 4
 *
 * findLastIndex(
 *   [{ name: 'Bob', age: 30 }, { name: 'Alice', age: 30 }],
 *   (u) => u.age === 30
 * );
 * // => 1
 * ```
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): number {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }

  return -1;
}
