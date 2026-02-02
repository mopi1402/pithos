/**
 * Creates an array of grouped elements from corresponding elements of multiple arrays.
 *
 * @template A, B, C, D, E - The types of elements in each input array.
 * @template T - The type of elements when using rest parameters.
 * @param arrays - One or more arrays to zip together.
 * @returns An array of tuples, where tuple[i] contains the i-th element from each input array.
 * @see unzip
 * @since 1.1.0
 *
 * @note Result length is determined by the shortest input array.
 *
 * @performance O(n × m) time & space where n = min array length, m = number of arrays. Pre-allocates result array and computes minLength in single pass.
 *
 * @example
 * ```typescript
 * zip(['a', 'b', 'c'], [1, 2, 3]);
 * // => [['a', 1], ['b', 2], ['c', 3]]
 *
 * zip([1, 2], [3, 4], [5, 6]);
 * // => [[1, 3, 5], [2, 4, 6]]
 *
 * zip([1, 2, 3], [4, 5]);
 * // => [[1, 4], [2, 5]]
 * ```
 */

/** @ignore TypeDoc: Overload with no parameters excluded from documentation. */
export function zip(): [];
export function zip<A>(a: A[]): [A][];
export function zip<A, B>(a: A[], b: B[]): [A, B][];
export function zip<A, B, C>(a: A[], b: B[], c: C[]): [A, B, C][];
export function zip<A, B, C, D>(a: A[], b: B[], c: C[], d: D[]): [A, B, C, D][];
export function zip<A, B, C, D, E>(
  a: A[],
  b: B[],
  c: C[],
  d: D[],
  e: E[]
): [A, B, C, D, E][];
export function zip<T>(...arrays: T[][]): T[][];
export function zip(...arrays: unknown[][]): unknown[][] {
  if (arrays.length === 0) return [];

  let minLength = arrays[0].length;
  for (let i = 1; i < arrays.length; i++) {
    // Stryker disable next-line EqualityOperator: equivalent mutant, <= produces same minLength
    if (arrays[i].length < minLength) {
      minLength = arrays[i].length;
    }
  }

  // Stryker disable next-line ArrayDeclaration: pre-allocation optimization
  const result: unknown[][] = new Array(minLength);

  for (let i = 0; i < minLength; i++) {
    // Stryker disable next-line ArrayDeclaration: pre-allocation optimization
    const tuple: unknown[] = new Array(arrays.length);
    for (let j = 0; j < arrays.length; j++) {
      tuple[j] = arrays[j][i];
    }
    result[i] = tuple;
  }

  return result;
}
