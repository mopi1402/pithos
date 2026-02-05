/**
 * Converts the first character of a string to uppercase and the rest to lowercase.
 *
 * @param str - The string to convert.
 * @returns The string with its first character converted to uppercase and the rest lowercased.
 * @deprecated Use `capitalize` from Arkhe directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase | String.toUpperCase() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * upperFirst('hello'); // => 'Hello'
 * upperFirst('HELLO'); // => 'Hello'
 *
 * // ✅ Recommended approach
 * import { capitalize } from 'pithos/arkhe/string/capitalize';
 * capitalize('hello'); // => 'Hello'
 * ```
 */
export function upperFirst(str: string): string {
    // Stryker disable next-line ConditionalExpression: Fast-path optimization - charAt(0) and slice(1) on empty string produce identical "" result
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}