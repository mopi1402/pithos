/**
 * Splits an array into two groups based on a predicate function.
 *
 * @template T - The type of elements in the array.
 * @template U - The type being filtered for (when using type guard).
 * @param array - The array to partition.
 * @param predicate - A function that returns true for elements in the first group.
 * @returns A tuple of [matching, non-matching] elements.
 * @since 1.1.0
 *
 * @performance O(n) — single pass through the array.
 *
 * @example
 * ```typescript
 * partition([1, 2, 3, 4], (n) => n % 2 === 0);
 * // => [[2, 4], [1, 3]]
 *
 * partition(
 *   [{ active: true }, { active: false }, { active: true }],
 *   (u) => u.active
 * );
 * // => [[{ active: true }, { active: true }], [{ active: false }]]
 * ```
 */

export function partition<T, U extends T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => value is U
): [truthy: U[], falsy: Array<Exclude<T, U>>];

export function partition<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): [truthy: T[], falsy: T[]];

export function partition<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (predicate(element, i, array)) {
      truthy.push(element);
    } else {
      falsy.push(element);
    }
  }

  return [truthy, falsy];
}
