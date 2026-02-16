/**
 * Creates a slice of array excluding elements dropped from the end.
 * Elements are dropped until predicate returns falsey.
 *
 * @template T - The type of elements in the array.
 * @param array - The source array to query.
 * @param predicate - The function invoked per iteration.
 * @returns A new array with the trailing elements dropped.
 * @since 2.0.0
 *
 * @performance O(n) time & space. Uses for loop with early return (break) for optimal performance when dropping few elements.
 *
 * @example
 * ```typescript
 * dropRightWhile([1, 2, 3, 4, 5], (v) => v > 2);
 * // => [1, 2]
 *
 * dropRightWhile(
 *   [{ name: 'Alice', active: true }, { name: 'Bob', active: false }],
 *   (u) => !u.active
 * );
 * // => [{ name: 'Alice', active: true }]
 * ```
 */
export function dropRightWhile<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): T[] {
  // INTENTIONAL: Manual reverse iteration for ES2020 compatibility.
  // Note: Could use Array.findLastIndex() (ES2023) when targeting ES2023+ (planned for 2028).
  let lastIndex = -1;

  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i], i, array)) {
      lastIndex = i;
      break;
    }
  }

  // Stryker disable next-line ConditionalExpression: slice(0, 0) also returns [], mutation equivalent
  return lastIndex === -1 ? [] : array.slice(0, lastIndex + 1);
}
