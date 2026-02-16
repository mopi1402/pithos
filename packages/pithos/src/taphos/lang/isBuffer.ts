/**
 * Checks if value is a Buffer (Node.js only).
 *
 * @param value - The value to check.
 * @returns `true` if value is a Buffer, else `false`.
 * @deprecated Use `Buffer.isBuffer()` directly instead (Node.js only).
 * @see {@link https://nodejs.org/api/buffer.html#static-method-bufferisbufferobj | Buffer.isBuffer() - Node.js}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isBuffer(Buffer.from('hello'));  // => true
 * isBuffer(new Uint8Array(2));     // => false
 *
 * // ✅ Recommended approach (Node.js)
 * Buffer.isBuffer(Buffer.from('hello'));  // => true
 * Buffer.isBuffer(new Uint8Array(2));     // => false
 * ```
 */
export function isBuffer(value: unknown): value is Buffer {
  // Stryker disable next-line ConditionalExpression,BooleanLiteral,StringLiteral: Environment check for Buffer availability cannot be tested in Node.js where Buffer is always defined
  return typeof Buffer !== "undefined" && Buffer.isBuffer(value);
}
