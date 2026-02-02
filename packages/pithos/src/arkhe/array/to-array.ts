//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
import { Arrayable } from "@arkhe/types/common/arrayable";

/**
 * Normalizes a value to an array.
 *
 * @template T - The type of elements.
 * @param value - A single value or array of values.
 * @returns The value wrapped in an array, or the original array if already one.
 * @since 1.1.0
 *
 * @note Uses `Array.isArray()` for type discrimination — required for union types.
 *
 * @performance O(1) time & space, returns original array if already one, otherwise creates single-element array.
 *
 * @example
 * ```typescript
 * toArray(5);
 * // => [5]
 *
 * toArray([1, 2, 3]);
 * // => [1, 2, 3]
 *
 * toArray('hello');
 * // => ['hello']
 * ```
 */
export function toArray<T>(value: Arrayable<T>): T[] {
  return Array.isArray(value) ? value : [value];
}
