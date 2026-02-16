/**
 * Creates a duplicate-free version of an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to inspect.
 * @returns A new array with unique values, preserving order of first occurrence.
 * @since 2.0.0
 *
 * @note Uses strict equality (===). First occurrence wins.
 *
 * @performance O(n·k) linear scan for small arrays (≤200), O(n) with Set for larger ones.
 *
 * @example
 * ```typescript
 * uniq([1, 2, 2, 3, 4, 4, 5]);
 * // => [1, 2, 3, 4, 5]
 *
 * uniq([11, 2, 3, 44, 11, 2, 3]);
 * // => [11, 2, 3, 44]
 * ```
 */
export function uniq<T>(array: readonly T[]): T[] {
  const len = array.length;

  // Stryker disable next-line ConditionalExpression,EqualityOperator,BlockStatement: Performance optimization — both paths (loop and Set) produce identical results
  if (len <= 200) {
    // Small array: linear scan avoids Set allocation overhead
    const result: T[] = [];
    let rLen = 0;
    for (let i = 0; i < len; i++) {
      const item = array[i];
      let found = false;
      for (let j = 0; j < rLen; j++) {
        if (result[j] === item) {
          found = true;
          break;
        }
      }
      if (!found) {
        result.push(item);
        rLen++;
      }
    }
    return result;
  }

  // Large array: Set for O(1) lookups
  const seen = new Set<T>();
  const result: T[] = [];
  for (let i = 0; i < len; i++) {
    const item = array[i];
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}
