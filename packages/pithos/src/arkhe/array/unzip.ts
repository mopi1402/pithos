/**
 * Maps each index of tuple T to an array of that index's type.
 * @template T - The tuple type to transform.
 * @example
 * ```typescript
 * type Result = UnzipResult<[string, number, boolean]>;
 * // => [string[], number[], boolean[]]
 * ```
 */
type UnzipResult<T extends readonly unknown[]> = {
  [K in keyof T]: T[K][];
} & unknown[];

/**
 * Transposes an array of tuples into separate arrays grouped by index position.
 *
 * Performs the inverse of `zip`, separating combined tuples back into their constituent arrays.
 *
 * @template T - A tuple type representing the structure of each element.
 * @param tuples - The array of tuples to unzip.
 * @returns An array of arrays where `result[i]` contains all values from position `i` of each tuple.
 * @throws {RangeError} If tuples have inconsistent lengths.
 * @see zip
 * @since 1.1.0
 *
 * @performance O(n × m) time & space where n = tuple length, m = number of tuples. Pre-allocates result arrays with `new Array(n)` for minimal allocation overhead.
 *
 * @example
 * ```typescript
 * unzip([['a', 1], ['b', 2], ['c', 3]] as const);
 * // => [['a', 'b', 'c'], [1, 2, 3]]
 * // Type: [string[], number[]]
 *
 * unzip([[1, true, 'x'], [2, false, 'y']] as const);
 * // => [[1, 2], [true, false], ['x', 'y']]
 * // Type: [number[], boolean[], string[]]
 * ```
 */
export function unzip<T extends readonly unknown[]>(
  tuples: readonly T[]
): UnzipResult<T> {
  // Stryker disable next-line EqualityOperator: empty array returns empty result
  if (tuples.length === 0) return [] as UnzipResult<T>;

  const tupleLength = tuples[0].length;
  const numTuples = tuples.length;
  const result = new Array(tupleLength) as UnzipResult<T>;

  for (let i = 0; i < tupleLength; i++) {
    // Stryker disable next-line ArrayDeclaration: Preallocation optimization — all indices are assigned in the transpose loop below
    result[i] = new Array(numTuples);
  }

  for (let i = 0; i < numTuples; i++) {
    const tuple = tuples[i];

    if (tuple.length !== tupleLength) {
      throw new RangeError(
        // Stryker disable next-line StringLiteral: error message content is not critical
        `Tuple at index ${i} has length ${tuple.length}, expected ${tupleLength}`
      );
    }

    for (let j = 0; j < tupleLength; j++) {
      (result[j] as unknown[])[i] = tuple[j];
    }
  }

  return result;
}
