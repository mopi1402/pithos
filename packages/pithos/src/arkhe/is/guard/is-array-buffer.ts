/**
 * Checks if a value is an ArrayBuffer.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an ArrayBuffer, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isArrayBuffer(new ArrayBuffer(8)); // => true
 * isArrayBuffer([]);                 // => false
 *
 * // Use instead
 * value instanceof ArrayBuffer;      // => true
 * ```
 */
export const isArrayBuffer = (value: unknown): value is ArrayBuffer =>
    value instanceof ArrayBuffer;
