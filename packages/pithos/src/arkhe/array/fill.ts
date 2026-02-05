/**
 * Fills elements of array with value from start up to, but not including, end.
 *
 * @info Why wrapping native?: Unlike the native `Array.fill()` which mutates the original array, this function returns a new array, preserving immutability. See [Design Philosophy](/guide/contribution/design-principles/design-philosophy/)
 * @note For ES2023+, consider using `Array.toFilled()`.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to fill.
 * @param value - The value to fill array with.
 * @param start - The start position.
 * @param end - The end position.
 * @returns A new array with the filled values.
 * @since 1.1.0
 *
 * @performance O(n) time & space — three-pass manual copy with fill range.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * const filled = fill(numbers, 0, 1, 3);
 * console.log(filled); // [1, 0, 0, 4, 5]
 * console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)
 * ```
 */
export function fill<T>(
    array: readonly T[],
    value: T,
    start?: number,
    end?: number
  ): T[] {
    const length = array.length;
    const s = start !== undefined ? (start >= 0 ? Math.min(start, length) : Math.max(length + start, 0)) : 0;
    const e = end !== undefined ? (end >= 0 ? Math.min(end, length) : Math.max(length + end, 0)) : length;

    // Stryker disable next-line ArrayDeclaration: Preallocation optimization — all indices are assigned in the loops below
    const result = new Array<T>(length);

    for (let i = 0; i < s; i++) {
      result[i] = array[i];
    }
    for (let i = s; i < e; i++) {
      result[i] = value;
    }
    for (let i = e; i < length; i++) {
      result[i] = array[i];
    }

    return result;
  }
  