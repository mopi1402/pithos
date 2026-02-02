/**
 * Checks if value is a DOM element.
 *
 * @param value - The value to check.
 * @returns `true` if value is a DOM element, else `false`.
 * @deprecated Use `instanceof Element` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element | Element - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isElement(document.body);           // => true
 * isElement('<body>');                // => false
 *
 * // ✅ Recommended approach
 * document.body instanceof Element;   // => true
 * '<body>' instanceof Element;        // => false
 * ```
 */
export function isElement(value: unknown): value is Element {
  // Stryker disable next-line ConditionalExpression,BooleanLiteral,StringLiteral: Environment check for Element availability cannot be tested in Node.js where Element is never defined
  return typeof Element !== "undefined" && value instanceof Element;
}
