/**
 * Returns the item at the given index, allowing for positive and negative integers.
 *
 * Negative integers count back from the last item in the array.
 *
 * @template T - The type of elements in the array.
 * @param arr - The array to query.
 * @param index - The index of the element to return.
 * @returns The element at the given index, or `undefined` if out of bounds.
 * @deprecated Use `array.at(index)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_at | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const first = at(numbers, 0);
 * console.log(first); // 1
 *
 * const last = at(numbers, -1);
 * console.log(last); // 5
 *
 * // ✅ Recommended approach
 * const firstNative = numbers[0];
 * console.log(firstNative); // 1
 *
 * const lastNative = numbers[numbers.length - 1];
 * console.log(lastNative); // 5
 *
 * // ✅ Modern approach with ES2022
 * const firstModern = numbers.at(0);
 * console.log(firstModern); // 1
 *
 * const lastModern = numbers.at(-1);
 * console.log(lastModern); // 5
 * ```
 */
export function at<T>(arr: T[], index: number): T | undefined {
  const len = arr.length;
  const normalizedIndex = index < 0 ? len + index : index;

  // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator: Early return optimization - arr[normalizedIndex] returns undefined for out-of-bounds indices anyway
  if (normalizedIndex < 0 || normalizedIndex >= len) return undefined;

  return arr[normalizedIndex];
}
