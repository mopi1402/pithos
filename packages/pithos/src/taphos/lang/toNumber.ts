/**
 * Converts value to a number.
 *
 * @param value - The value to convert.
 * @returns The converted number.
 * @deprecated Use `Number()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number | Number() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toNumber('42');       // => 42
 * toNumber('3.14');     // => 3.14
 * toNumber(true);       // => 1
 * toNumber(null);       // => 0
 *
 * // ✅ Recommended approach
 * Number('42');         // => 42
 * Number('3.14');       // => 3.14
 * Number(true);         // => 1
 * Number(null);         // => 0
 * ```
 */
export function toNumber(value: unknown): number {
  return Number(value);
}
