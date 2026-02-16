/**
 * Computes the intersection of multiple arrays.
 *
 * This function takes multiple arrays and returns a new array containing
 * only the elements that are present in all input arrays.
 *
 * @template T - The type of the elements in the input arrays.
 * @param arrays - Arrays of type T to compute the intersection from.
 * @returns A new array containing the common elements found in all input arrays.
 * @since 2.0.0
 *
 * @performance O(n × m) time & space where n = first array length, m = number of arrays. Uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
 * // => [3]
 *
 * intersection(['a', 'b'], ['b', 'c'], ['b', 'd']);
 * // => ['b']
 * ```
 */
export function intersection<T>(...arrays: readonly (readonly T[])[]): T[] {
  if (arrays.length === 0) return [];

  const first = arrays[0];
  // Stryker disable next-line ConditionalExpression: equivalent mutant, filter on empty array returns []
  if (first.length === 0) return [];

  const setCount = arrays.length - 1;
  // Stryker disable next-line ArrayDeclaration: Preallocation optimization — all indices are assigned in the loop below
  const sets = new Array(setCount);
  // Stryker disable next-line EqualityOperator: Extra Set from undefined is never accessed by the check loop (j < setCount)
  for (let i = 0; i < setCount; i++) {
    sets[i] = new Set(arrays[i + 1]);
  }

  const result: T[] = [];
  const seen = new Set<T>();

  for (let i = 0; i < first.length; i++) {
    const item = first[i];

    if (seen.has(item)) continue;
    seen.add(item);

    let inAll = true;
    for (let j = 0; j < setCount; j++) {
      if (!sets[j].has(item)) {
        inAll = false;
        break;
      }
    }

    if (inAll) {
      result.push(item);
    }
  }

  return result;
}
