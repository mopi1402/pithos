/**
 * Creates a deep clone of a value using the native structuredClone API.
 *
 * @template T - The type of the value to clone.
 * @param value - The value to clone deeply.
 * @returns A deep clone of the input value.
 * @deprecated Use the native `structuredClone()` function directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone | structuredClone() - MDN}
 * @see {@link https://caniuse.com/mdn-api_structuredclone | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 *
 * // ❌ Deprecated approach
 * const cloned = cloneDeep(original);
 * cloned.b.c = 3;
 * console.log(original.b.c); // 2 (unchanged)
 *
 * // ✅ Recommended approach
 * const clonedNative = structuredClone(original);
 * clonedNative.b.c = 3;
 * console.log(original.b.c); // 2 (unchanged)
 * ```
 */
export function cloneDeep<T>(value: T): T {
    return structuredClone(value);
}
