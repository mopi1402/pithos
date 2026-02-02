import { capitalize } from "../../arkhe/string/capitalize";

/**
 * Converts the first character of a string to uppercase.
 *
 * Alias for {@link capitalize}.
 *
 * @param str - The string to convert.
 * @returns The string with its first character converted to uppercase.
 * @deprecated Use `capitalize` from Arkhe directly instead.
 * Reason: Alias of {@link capitalize}
 * @see {@link capitalize}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * upperFirst('hello'); // => 'Hello'
 *
 * // ✅ Recommended approach
 * import { capitalize } from 'pithos/arkhe/string/capitalize';
 * capitalize('hello'); // => 'Hello'
 * ```
 */
export function upperFirst(str: string): string {
    return capitalize(str);
}