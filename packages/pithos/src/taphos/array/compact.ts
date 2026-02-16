type Truthy<T> = Exclude<T, false | null | 0 | 0n | '' | undefined>;

/**
 * Removes all falsy values from an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to compact.
 * @returns A new array with all falsy values removed.
 * @deprecated Use `array.filter(Boolean)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array.filter() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_filter | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const mixed = [1, 0, false, '', 'hello', null, undefined];
 *
 * // ❌ Deprecated approach
 * const compacted = compact(mixed);
 * console.log(compacted); // [1, 'hello']
 *
 * // ✅ Recommended approach
 * const filtered = mixed.filter(Boolean);
 * console.log(filtered); // [1, 'hello']
 * ```
 */
export function compact<T>(array: readonly T[]): Truthy<T>[] {
  const result: Truthy<T>[] = [];

  // Stryker disable next-line EqualityOperator: out-of-bounds array[length] is undefined (falsy), always filtered out by the if(item) guard
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (item) {
      result.push(item as Truthy<T>);
    }
  }

  return result;
}