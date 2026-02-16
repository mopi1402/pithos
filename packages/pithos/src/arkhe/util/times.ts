/**
 * Invokes a function n times, returning an array of the results.
 *
 * @template T - The type of elements returned by the iteratee.
 * @param n - The number of times to invoke (must be a non-negative integer).
 * @param iteratee - The function to invoke for each index. Defaults to identity (returns indices).
 * @returns An array containing the results of invoking iteratee n times.
 * @throws {RangeError} If n is negative or not an integer.
 * @since 2.0.0
 *
 * @note Without iteratee, returns `[0, 1, 2, ..., n-1]`.
 *
 * @performance O(n) time & space. Uses for loop with pre-allocated array and early return for n === 0.
 *
 * @example
 * ```typescript
 * times(3);                      // => [0, 1, 2]
 * times(3, (index) => index * 2);        // => [0, 2, 4]
 * times(3, (index) => `item-${index}`);  // => ['item-0', 'item-1', 'item-2']
 * times(3, () => 'x');           // => ['x', 'x', 'x']
 * ```
 */

export function times<T>(n: number, iteratee: (index: number) => T): T[];
export function times(n: number): number[];
export function times<T>(
  n: number,
  iteratee?: (index: number) => T
): T[] | number[] {
  if (n < 0) {
    throw new RangeError("n must not be negative");
  }

  if (!Number.isInteger(n)) {
    throw new RangeError("n must be an integer");
  }

  // Stryker disable next-line BlockStatement,ConditionalExpression: Early return optimization - loop handles n=0 correctly
  if (n === 0) {
    return [];
  }

  // Stryker disable next-line ArrayDeclaration: preallocation optimization - loop fills array identically
  const result = new Array(n);

  if (iteratee) {
    for (let i = 0; i < n; i++) {
      result[i] = iteratee(i);
    }
  } else {
    for (let i = 0; i < n; i++) {
      result[i] = i;
    }
  }

  return result;
}
