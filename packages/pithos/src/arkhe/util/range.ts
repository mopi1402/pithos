/**
 * Creates an array of numbers from start up to, but not including, end.
 *
 * @param start - The start of the range (or end if `end` is omitted, starting from 0).
 * @param end - The end of the range (exclusive).
 * @param step - The increment/decrement value. Defaults to `1` or `-1` based on direction.
 * @returns The range of numbers.
 * @throws {RangeError} If step is zero.
 * @since 2.0.0
 *
 * @note Automatically determines direction when step is omitted.
 *
 * @performance O(n) time & space where n is range size. Uses for loop with pre-allocated array. Separate loops for positive/negative steps.
 *
 * @example
 * ```typescript
 * range(5);        // => [0, 1, 2, 3, 4]
 * range(0, 10, 2); // => [0, 2, 4, 6, 8]
 * range(5, 0);     // => [5, 4, 3, 2, 1]
 * range(5, 0, -2); // => [5, 3, 1]
 * ```
 */
export function range(start: number, end?: number, step?: number): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (step === undefined) {
    // Stryker disable next-line EqualityOperator: When start === end, both < and <= produce empty array (0 iterations)  
    step = start < end ? 1 : -1;
  }

  if (step === 0) {
    throw new RangeError("Step must not be zero");
  }

  const length = Math.max(Math.ceil((end - start) / step), 0);
  // Stryker disable next-line ArrayDeclaration: preallocation optimization - loop fills array identically
  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = start + i * step;
  }

  return result;
}
