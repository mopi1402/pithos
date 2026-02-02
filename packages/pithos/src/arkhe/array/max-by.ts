//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Returns the element with the maximum value computed by iteratee.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to iterate over.
 * @param iteratee - A function that returns the value to compare.
 * @returns The element with the maximum value, or `undefined` if empty.
 * @since 1.1.0
 *
 * @performance O(n) time, O(1) space.
 *
 * @example
 * ```typescript
 * maxBy([{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }] as const, (u) => u.age);
 * // => { name: 'Jane', age: 30 }
 *
 * maxBy([{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }], (u) => u.age);
 * // => { name: 'Jane', age: 30 }
 *
 * maxBy([], (x) => x);
 * // => undefined
 * ```
 */

export function maxBy<T>(
  array: readonly [T, ...T[]],
  iteratee: (value: T) => number
): T;
export function maxBy<T>(
  array: readonly T[],
  iteratee: (value: T) => number
): T | undefined;
export function maxBy<T>(
  array: readonly T[],
  iteratee: (value: T) => number
): T | undefined {
  if (array.length === 0) return undefined;

  let maxElement = array[0];
  let maxValue = iteratee(maxElement);

  for (let i = 1; i < array.length; i++) {
    const item = array[i];
    const value = iteratee(item);
    if (value > maxValue) {
      maxValue = value;
      maxElement = item;
    }
  }

  return maxElement;
}
