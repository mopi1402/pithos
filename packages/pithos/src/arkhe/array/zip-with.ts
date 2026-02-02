//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-31
/**
 * Creates an array of grouped elements, applying a function to each group.
 *
 * @template T - The type of elements in the arrays.
 * @template R - The type of the result.
 * @param arrays - The arrays to process.
 * @param iteratee - The function to combine grouped values.
 * @returns A new array of combined values.
 * @since 1.1.0
 *
 * @note When arrays have unequal lengths, shorter arrays contribute `undefined` for missing indices.
 * 
 * @performance O(n × m) where n is the length of the longest array and m is the number of arrays.
 *
 * @example
 * ```typescript
 * zipWith([[1, 2], [10, 20], [100, 200]], (a, b, c) => a + b + c);
 * // => [111, 222]
 *
 * zipWith([[1, 2, 3], [4, 5, 6]], (a, b) => a * b);
 * // => [4, 10, 18]
 * ```    
 */
export function zipWith<T, R>(   
  arrays: readonly (readonly T[])[],
  iteratee: (...values: T[]) => R
): R[] {
  // Stryker disable next-line EqualityOperator,ConditionalExpression: Early return optimization - Math.max() returns -Infinity, loop never executes
  if (arrays.length === 0) return [];

  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result: R[] = [];

  for (let i = 0; i < maxLength; i++) {
    const group = arrays.map((arr) => arr[i]);
    result.push(iteratee(...group));
  }

  return result;
}
