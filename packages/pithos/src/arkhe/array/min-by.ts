/**
 * Returns the element with the minimum value computed by iteratee.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to iterate over.
 * @param iteratee - A function that returns the value to compare.
 * @returns The element with the minimum value, or `undefined` if empty.
 * @since 2.0.0
 *
 * @performance O(n) time, O(1) space.
 *
 * @example
 * ```typescript
 * minBy([{ name: 'John', age: 25 }, { name: 'Bob', age: 20 }] as const, (u) => u.age);
 * // => { name: 'Bob', age: 20 }
 *
 * minBy([{ name: 'John', age: 25 }, { name: 'Bob', age: 20 }], (u) => u.age);
 * // => { name: 'Bob', age: 20 }
 *
 * minBy([], (x) => x);
 * // => undefined
 * ```
 */

export function minBy<T>(
  array: readonly [T, ...T[]],
  iteratee: (value: T) => number
): T;
export function minBy<T>(
  array: readonly T[],
  iteratee: (value: T) => number
): T | undefined;
export function minBy<T>(
  array: readonly T[],
  iteratee: (value: T) => number
): T | undefined {
  if (array.length === 0) return undefined;

  let minElement = array[0];
  let minValue = iteratee(minElement);

  for (let i = 1; i < array.length; i++) {
    const item = array[i];
    const value = iteratee(item);
    if (value < minValue) {
      minValue = value;
      minElement = item;
    }
  }

  return minElement;
}
