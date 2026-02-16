import { differenceWith } from "../../arkhe/array/difference-with";

/**
 * Removes all given values from array using a comparator function for equality.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param values - The values to remove.
 * @param comparator - The function invoked to compare elements.
 * @returns The mutated array.
 * @deprecated Use `differenceWith` instead for immutable operations.
 * Reason: Pithos design philosophy always favors immutability.
 * @see differenceWith
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach (mutates array)
 * const array = [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }];
 * pullAllWith(array, [{ x: 3, y: 4 }], (a, b) => a.x === b.x && a.y === b.y);
 * console.log(array); // [{ x: 1, y: 2 }, { x: 5, y: 6 }]
 *
 * // ✅ Recommended approach (immutable)
 * const array = [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }];
 * const result = differenceWith(array, [{ x: 3, y: 4 }], (a, b) => a.x === b.x && a.y === b.y);
 * console.log(result); // [{ x: 1, y: 2 }, { x: 5, y: 6 }]
 * console.log(array);  // unchanged
 * ```
 */
export function pullAllWith<T>(
  array: T[],
  values: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  const kept = differenceWith(array, values, comparator);

  array.length = 0;
  array.push(...kept);

  return array;
}
