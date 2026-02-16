import { differenceBy } from "../../arkhe/array/difference-by";

/**
 * Removes all given values from array using an iteratee for equality comparisons.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param values - The values to remove.
 * @param iteratee - A function or property key to compute the comparison value.
 * @returns The mutated array.
 * @deprecated Use `differenceBy` instead for immutable operations.
 * Reason: Pithos design philosophy always favors immutability.
 * @see differenceBy
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach (mutates array)
 * const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
 * pullAllBy(array, [{ x: 1 }, { x: 3 }], 'x');
 * console.log(array); // [{ x: 2 }]
 *
 * // ✅ Recommended approach (immutable)
 * const array = [{ x: 1 }, { x: 2 }, { x: 3 }];
 * const result = differenceBy(array, [{ x: 1 }, { x: 3 }], 'x');
 * console.log(result); // [{ x: 2 }]
 * console.log(array);  // [{ x: 1 }, { x: 2 }, { x: 3 }] (unchanged)
 * ```
 */
export function pullAllBy<T>(
  array: T[],
  values: readonly T[],
  iteratee: ((item: T) => unknown) | keyof T
): T[] {
  const kept = differenceBy(array, values, iteratee);

  array.length = 0;
  array.push(...kept);

  return array;
}
