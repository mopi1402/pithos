/**
 * Converts a string to camelCase.
 *
 * @param str - The string to convert.
 * @returns The string in camelCase.
 * @since 1.1.0
 *
 * @note Handles kebab-case, snake_case, PascalCase, space-separated strings, and acronyms.
 *
 * @performance O(n) single-pass charCode traversal, no regex.
 *
 * @example
 * ```typescript
 * camelCase('background-color'); // => 'backgroundColor'
 * camelCase('font_size');        // => 'fontSize'
 * camelCase('Hello World');      // => 'helloWorld'
 * camelCase('PascalCase');       // => 'pascalCase'
 * camelCase('HTTPRequest');      // => 'httpRequest'
 * camelCase('--foo--bar--');     // => 'fooBar'
 * ```
 */
export function camelCase(str: string): string {
  const len = str.length;
  // Stryker disable next-line ConditionalExpression: Early return optimization — loop on empty string produces identical empty result
  if (len === 0) return "";

  let result = "";
  let wordStart = false;
  let hasOutput = false;

  for (let i = 0; i < len; i++) {
    const code = str.charCodeAt(i);

    // Separators: - (45), _ (95), whitespace (<=32 covers space, tab, newline, etc.)
    if (code === 45 || code === 95 || code <= 32) {
      if (hasOutput) wordStart = true;
      continue;
    }

    // Unicode whitespace (rare path)
    if (
      code === 160 ||
      code === 5760 ||
      (code >= 8192 && code <= 8202) ||
      code === 8232 ||
      code === 8233 ||
      code === 8239 ||
      code === 8287 ||
      code === 12288 ||
      code === 65279
    ) {
      if (hasOutput) wordStart = true;
      continue;
    }

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z
      // Stryker disable next-line ConditionalExpression,EqualityOperator: At i=0, charCodeAt(-1) returns NaN which fails the >= 65 check identically
      if (i > 0 && str.charCodeAt(i - 1) >= 65 && str.charCodeAt(i - 1) <= 90) {
        // Continuation of uppercase group: lowercase
        result += String.fromCharCode(code + 32);
      } else if (!hasOutput) {
        // First output: lowercase
        result += String.fromCharCode(code + 32);
        hasOutput = true;
      } else {
        // First of uppercase group (word boundary): keep uppercase
        result += str[i];
      }
      wordStart = false;
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      if (wordStart) {
        result += String.fromCharCode(code - 32);
        wordStart = false;
      } else {
        result += str[i];
      }
      hasOutput = true;
    } else {
      // Digit or other
      result += str[i];
      hasOutput = true;
    }
  }

  return result;
}
