//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Gets a random element from an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to sample from.
 * @returns A random element, or `undefined` if the array is empty.
 * @since 1.1.0
 *
 * @performance O(1) time & space, direct index access with early return for empty arrays.
 *
 * @example
 * ```typescript
 * sample([1, 2, 3, 4, 5]);
 * // => 3 (random)
 *
 * sample([{ name: 'John' }, { name: 'Jane' }]);
 * // => { name: 'Jane' } (random)
 * ```
 */
export function sample<T>(array: readonly T[]): T | undefined {
  return array.length
    ? array[Math.floor(Math.random() * array.length)]
    : undefined;
}
