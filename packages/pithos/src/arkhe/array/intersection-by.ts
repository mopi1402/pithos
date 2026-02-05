/**
 * Creates an array of unique values present in all arrays, using an iteratee for comparison.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - An array of arrays to inspect.
 * @param iteratee - A function that returns the comparison value for each element.
 * @returns A new array containing elements present in all input arrays.
 * @since 1.1.0
 *
 * @performance O(n × m) — builds Sets directly (no intermediate arrays), uses delete for dedup.
 *
 * @example
 * ```typescript
 * intersectionBy(
 *   [[{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }]],
 *   (item) => item.id
 * );
 * // => [{ id: 2 }]
 *
 * intersectionBy([[1.2, 2.4], [2.5, 3.1]], Math.floor);
 * // => [2.4]
 * ```
 */
export function intersectionBy<T>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => unknown
): T[] {
  const arrCount = arrays.length;
  if (arrCount === 0) return [];

  const first = arrays[0];
  const fLen = first.length;
  // Stryker disable next-line ConditionalExpression,EqualityOperator: Early return optimization — main loop produces identical empty result when fLen === 0
  if (fLen === 0) return [];

  // Build Sets directly without intermediate .map() arrays
  const sets: Set<unknown>[] = [];
  for (let a = 1; a < arrCount; a++) {
    const arr = arrays[a];
    const s = new Set<unknown>();
    for (let j = 0; j < arr.length; j++) {
      s.add(iteratee(arr[j]));
    }
    sets.push(s);
  }

  const setCount = sets.length;

  // Single array: return deduplicated version
  if (setCount === 0) {
    const seen = new Set<unknown>();
    const result: T[] = [];
    for (let i = 0; i < fLen; i++) {
      const value = iteratee(first[i]);
      if (!seen.has(value)) {
        seen.add(value);
        result.push(first[i]);
      }
    }
    return result;
  }

  const result: T[] = [];
  const firstSet = sets[0];

  for (let i = 0; i < fLen; i++) {
    const item = first[i];
    const value = iteratee(item);
    if (!firstSet.has(value)) continue;

    let inAll = true;
    for (let s = 1; s < setCount; s++) {
      if (!sets[s].has(value)) {
        inAll = false;
        break;
      }
    }

    if (inAll) {
      firstSet.delete(value);
      result.push(item);
    }
  }

  return result;
}
