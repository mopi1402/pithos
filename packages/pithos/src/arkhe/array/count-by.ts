//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Counts elements by a key derived from each element.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to iterate over.
 * @param iteratee - A function that returns the grouping key for each element.
 * @returns An object with keys and their occurrence counts.
 * @since 1.1.0
 *
 * @note Keys are always strings (JavaScript object behavior).
 *
 * @performance O(n) time & space, uses `for` loop to avoid array method overhead.
 *
 * @example
 * ```typescript
 * countBy([1.2, 1.8, 2.1, 2.9], Math.floor);
 * // => { '1': 2, '2': 2 }
 *
 * countBy(
 *   [{ age: 25 }, { age: 30 }, { age: 25 }],
 *   (u) => u.age
 * );
 * // => { '25': 2, '30': 1 }
 * ```
 */
export function countBy<T>(
  array: readonly T[],
  iteratee: (value: T) => string | number
): Record<string, number> {
  const result: Record<string, number> = {};

  for (let i = 0; i < array.length; i++) {
    const key = String(iteratee(array[i]));
    result[key] = (result[key] ?? 0) + 1;
  }

  return result;
}
