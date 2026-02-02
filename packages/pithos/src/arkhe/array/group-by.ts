//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-17
/**
 * Groups array elements by a key derived from each element.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the grouping key.
 * @param array - The array to group.
 * @param iteratee - A function that returns the grouping key for each element.
 * @returns An object with keys mapping to arrays of elements.
 * @since 1.1.0
 *
 * @note Prefer native `Object.groupBy()` when targeting ES2024+.
 *
 * @performance O(n) time & space.
 *
 * @see {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy | Object.groupBy()}
 *
 * @example
 * ```typescript
 * const byAge = groupBy(
 *   [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }, { name: 'Bob', age: 25 }],
 *   (u) => u.age
 * );
 * // => { '25': [...], '30': [...] }
 *
 * byAge[25];   // => [{ name: 'John', age: 25 }, { name: 'Bob', age: 25 }]
 * byAge['25']; // => same — object keys are coerced to strings at runtime
 *
 * groupBy(['one', 'two', 'three'], (s) => s.length);
 * // => { '3': ['one', 'two'], '5': ['three'] }
 * ```
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  iteratee: (value: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};

  for (let i = 0; i < array.length; i++) {
    const key = iteratee(array[i]);
    (result[key] ??= []).push(array[i]);
  }

  return result;
}
