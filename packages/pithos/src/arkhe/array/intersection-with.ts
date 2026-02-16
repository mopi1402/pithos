/**
 * Creates an array of unique values present in all arrays, using a comparator for equality.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - An array of arrays to inspect.
 * @param comparator - A function that returns true if two elements are equivalent.
 * @returns A new array containing elements present in all input arrays.
 * @since 2.0.0
 *
 * @performance O(n² × m) — custom comparators cannot leverage Set optimization.
 *
 * @example
 * ```typescript
 * intersectionWith(
 *   [[{ x: 1 }, { x: 2 }], [{ x: 2 }, { x: 3 }]],
 *   (a, b) => a.x === b.x
 * );
 * // => [{ x: 2 }]
 *
 * intersectionWith(
 *   [[1.1, 2.2], [2.3, 3.1]],
 *   (a, b) => Math.floor(a) === Math.floor(b)
 * );
 * // => [2.2]
 * ```
 */
export function intersectionWith<T>(
  arrays: readonly (readonly T[])[],
  comparator: (a: T, b: T) => boolean
): T[] {
  if (arrays.length === 0) return [];

  const first = arrays[0];
  const firstLen = first.length;

  // Stryker disable next-line ConditionalExpression: equivalent mutant, filter on empty array returns []
  if (firstLen === 0) return [];

  if (arrays.length === 1) {
    const unique: T[] = [];
    for (let i = 0; i < firstLen; i++) {
      const item = first[i];
      let isDuplicate = false;
      let j = unique.length;
      while (j--) {
        if (comparator(unique[j], item)) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) unique.push(item);
    }
    return unique;
  }

  let result: T[] = [];
  const second = arrays[1];
  const secondLen = second.length;

  for (let i = 0; i < firstLen; i++) {
    const item = first[i];
    let foundInSecond = false;
    for (let j = 0; j < secondLen; j++) {
      if (comparator(item, second[j])) {
        foundInSecond = true;
        break;
      }
    }
    if (!foundInSecond) continue;
    let alreadyAdded = false;
    let k = result.length;
    while (k--) {
      if (comparator(result[k], item)) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) result.push(item);
  }

  for (let k = 2; k < arrays.length; k++) {
    const arr = arrays[k];
    const arrLen = arr.length;
    // Stryker disable next-line ConditionalExpression: empty intersection with empty array = []
    if (arrLen === 0) return [];

    const nextResult: T[] = [];
    const resultLen = result.length;
    for (let i = 0; i < resultLen; i++) {
      const item = result[i];
      for (let j = 0; j < arrLen; j++) {
        if (comparator(item, arr[j])) {
          nextResult.push(item);
          break;
        }
      }
    }
    result = nextResult;
    // Stryker disable next-line ConditionalExpression,EqualityOperator: Early return optimization — iterating over empty result in next loop produces identical empty array
    if (result.length === 0) return [];
  }

  return result;
}
