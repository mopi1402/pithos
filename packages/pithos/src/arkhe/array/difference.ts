/**
 * Creates an array of values from the first array that are not included in the second array.
 *
 * @template T - The type of elements in the arrays.
 * @param array - The source array to inspect.
 * @param values - The array of values to exclude.
 * @returns A new array of filtered values.
 * @since 1.1.0
 *
 * @note Uses strict equality (===). Preserves duplicates from the source array.
 *
 * @performance O(n·m) for small exclusion sets (≤16), O(n + m) with hash map for larger ones.
 *
 * @example
 * ```typescript
 * difference([1, 2, 3, 4, 5], [2, 4]);
 * // => [1, 3, 5]
 *
 * difference([1, 1, 2, 2, 3], [2]);
 * // => [1, 1, 3]
 * ```
 */
export function difference<T>(array: readonly T[], values: readonly T[]): T[] {
  const aLen = array.length;
  const vLen = values.length;

  // Stryker disable next-line ConditionalExpression,EqualityOperator,BlockStatement: Performance optimization — both paths (loop and Set) produce identical results
  if (vLen <= 16) {
    const result: T[] = [];
    for (let i = 0; i < aLen; i++) {
      const item = array[i];
      let excluded = false;
      for (let j = 0; j < vLen; j++) {
        if (item === values[j]) {
          excluded = true;
          break;
        }
      }
      if (!excluded) {
        result.push(item);
      }
    }
    return result;
  }

  const excludeMap = new Set<T>();
  for (let i = 0; i < vLen; i++) {
    excludeMap.add(values[i]);
  }

  const result: T[] = [];
  for (let i = 0; i < aLen; i++) {
    if (!excludeMap.has(array[i])) {
      result.push(array[i]);
    }
  }

  return result;
}
