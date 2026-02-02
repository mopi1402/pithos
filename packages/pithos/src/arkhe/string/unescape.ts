const HTML_UNESCAPES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const UNESCAPE_PATTERN = /&(?:amp|lt|gt|quot|#39);/g;

/**
 * Unescapes HTML entities to their corresponding characters.
 *
 * @param str - The string to unescape.
 * @returns The unescaped string.
 * @since 1.1.0
 *
 * @note Unescapes `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;`.
 *
 * @performance O(n) time where n is string length. Single regex pass with object lookup.
 *
 * @see escape
 *
 * @example
 * ```typescript
 * unescape('&lt;div&gt;');           // => '<div>'
 * unescape('a &amp; b');             // => 'a & b'
 * unescape('&quot;hello&quot;');     // => '"hello"'
 * unescape('&#39;quoted&#39;');      // => "'quoted'"
 *
 * // Roundtrip with escape
 * const original = '<script>alert("XSS")</script>';
 * unescape(escape(original)) === original; // => true
 * ```
 */
export function unescape(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string replace returns "" anyway
  if (str.length === 0) return "";

  return str.replace(UNESCAPE_PATTERN, (match) => HTML_UNESCAPES[match]);
}
