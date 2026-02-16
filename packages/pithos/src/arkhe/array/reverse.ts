/**
 * Reverses array so that the first element becomes the last, the second element becomes the second to last, and so on.
 *
 * @info Why wrapping native?: Unlike the native `Array.reverse()` which mutates the original array, this function returns a new array, preserving immutability. See [Design Philosophy](/guide/contribution/design-principles/design-philosophy/)
 * @note For ES2023+, consider using `Array.toReversed()`.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to reverse.
 * @returns A new array with elements in reverse order.
 * @since 2.0.0
 *
 * @performance O(n) time and space — creates a shallow copy then reverses in place.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * const reversed = reverse(numbers);
 * console.log(reversed); // [5, 4, 3, 2, 1]
 * console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)
 * ```
 */
export function reverse<T>(array: readonly T[]): T[] {
    return [...array].reverse();
  }
  