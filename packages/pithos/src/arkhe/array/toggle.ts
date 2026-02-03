/**
 * Toggles the presence of an element in an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The source array.
 * @param element - The element to toggle.
 * @returns A new array with the element added or removed.
 * @since 1.1.0
 *
 * @note Uses strict equality (===). Only the first occurrence is removed.
 *
 * @performance O(n) time & space, uses indexOf and filter/spread operations.
 *
 * @example
 * ```typescript
 * toggle([1, 2, 3], 2);
 * // => [1, 3]
 *
 * toggle([1, 2, 3], 4);
 * // => [1, 2, 3, 4]
 * ```
 */
export function toggle<T>(array: readonly T[], element: T): T[] {
  const index = array.indexOf(element);
  return index === -1
    ? [...array, element]
    : array.filter((_, i) => i !== index);
}
