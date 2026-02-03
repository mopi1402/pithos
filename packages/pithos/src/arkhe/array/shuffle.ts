/**
 * Creates a shuffled copy of an array using Fisher-Yates algorithm.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to shuffle.
 * @returns A new shuffled array.
 * @since 1.1.0
 *
 * @note Uses Fisher-Yates shuffle algorithm for unbiased randomization.
 * @note Does not mutate the original array.
 *
 * @performance O(n) time & space.
 *
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]);
 * // => [3, 1, 5, 2, 4] (random)
 *
 * const original = ['a', 'b', 'c'];
 * const shuffled = shuffle(original);
 * // original is unchanged
 * ```
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  const length = result.length;

  // Stryker disable next-line EqualityOperator: i >= 0 adds iteration at i=0 where randomIndex=0, swap with self has no effect
  for (let i = length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  return result;
}
