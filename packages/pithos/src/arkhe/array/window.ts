//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates a sliding window array of consecutive elements.
 *
 * Returns an array of overlapping subarrays of the specified size,
 * each shifted by one element from the previous.
 *
 * @template T - The type of elements in the array.
 * @param array - The source array to process.
 * @param size - The size of each window (must be a positive integer).
 * @returns An array of subarrays, each containing `size` consecutive elements.
 * @throws {RangeError} When size is not a positive integer.
 * @since 1.1.0
 *
 * @performance O(n×m) time & space, pre-allocated array, early return when size > length.
 *
 * @example
 * ```typescript
 * window([1, 2, 3, 4, 5], 3);
 * // => [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * ```
 */
export function window<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0 || !Number.isInteger(size)) {
    // Stryker disable next-line StringLiteral: error message content is not critical
    throw new RangeError("Size must be a positive integer");
  }

  const length = array.length;
  if (length < size) {
    return [];
  }

  const resultLength = length - size + 1;
  // Stryker disable next-line ArrayDeclaration: pre-allocation optimization
  const result: T[][] = new Array(resultLength);

  for (let i = 0; i < resultLength; i++) {
    result[i] = array.slice(i, i + size);
  }

  return result;
}
