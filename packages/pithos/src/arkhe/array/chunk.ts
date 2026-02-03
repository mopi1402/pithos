/**
 * Splits an array into groups of the specified size.
 *
 * @template T - The type of elements in the array.
 * @param array - The source array to split into chunks.
 * @param size - The size of each chunk (must be a positive integer).
 * @returns An array of chunks, where each chunk has at most `size` elements.
 * @throws {RangeError} If size is not a positive integer.
 * @since 1.1.0
 *
 * @performance O(n) time & space, pre-allocated result array
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2);
 * // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    // Stryker disable next-line StringLiteral: error message content is not critical
    throw new RangeError("Size must be a positive integer");
  }

  const resultLength = Math.ceil(array.length / size);
  // Stryker disable next-line ArrayDeclaration: pre-allocation is an optimization, not behavior
  const result: T[][] = new Array(resultLength);

  for (let i = 0; i < resultLength; i++) {
    result[i] = array.slice(i * size, (i + 1) * size);
  }

  return result;
}
