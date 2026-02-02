type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/**
 * Checks if value is a TypedArray.
 *
 * @param value - The value to check.
 * @returns `true` if value is a TypedArray, else `false`.
 * @deprecated Use `ArrayBuffer.isView()` directly instead.
 * Note: `ArrayBuffer.isView()` also returns true for DataView.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView | ArrayBuffer.isView() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_arraybuffer_isview | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isTypedArray(new Uint8Array(2));  // => true
 * isTypedArray(new Float32Array()); // => true
 * isTypedArray([1, 2, 3]);          // => false
 *
 * // ✅ Recommended approach
 * ArrayBuffer.isView(new Uint8Array(2));  // => true
 * ArrayBuffer.isView(new Float32Array()); // => true
 * ArrayBuffer.isView([1, 2, 3]);          // => false
 *
 * // Note: ArrayBuffer.isView also matches DataView
 * ArrayBuffer.isView(new DataView(new ArrayBuffer(2))); // => true
 * ```
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}
