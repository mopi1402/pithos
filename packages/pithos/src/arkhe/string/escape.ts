//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes HTML special characters to their corresponding entities.
 *
 * @param str - The string to escape.
 * @returns The escaped string.
 * @since 1.1.0
 *
 * @note Escapes `&`, `<`, `>`, `"`, and `'`. Essential for XSS prevention.
 *
 * @performance O(n) time where n is string length. Single regex pass with object lookup.
 *
 * @see unescape for the inverse operation.
 *
 * @example
 * ```typescript
 * escape('<div>');   // => '&lt;div&gt;'
 * escape('a & b');   // => 'a &amp; b'
 * escape('"hello"'); // => '&quot;hello&quot;'
 * escape('<script>alert("XSS")</script>');
 * // => '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * ```
 */
export function escape(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string replace returns "" anyway
  if (str.length === 0) return "";

  return str.replace(/[&<>"']/g, (match) => HTML_ESCAPES[match]);
}
