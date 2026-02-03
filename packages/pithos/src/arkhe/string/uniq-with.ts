/**
 * Creates a duplicate-free version of a string using a custom comparator.
 *
 * @param str - The string to process.
 * @param comparator - Function to compare characters for equality.
 * @returns The string with unique characters (first occurrence kept).
 * @since 1.1.0
 *
 * @note Keeps first occurrence of each character. O(n²) complexity.
 *
 * @performance O(n²) time, O(n) space where n is string length. Uses `every()` for each character check.
 *
 * @example
 * ```typescript
 * uniqWith('hello', (a, b) => a === b);
 * // => 'helo'
 *
 * uniqWith('Hello', (a, b) => a.toLowerCase() === b.toLowerCase());
 * // => 'Helo'
 *
 * uniqWith('hello   world', (a, b) => /\s/.test(a) && /\s/.test(b));
 * // => 'hello world'
 * ```
 */
export function uniqWith(
  str: string,
  comparator: (a: string, b: string) => boolean
): string {
  const result: string[] = [];

  for (const char of str) {
    const isUnique = result.every((existing) => !comparator(existing, char));

    if (isUnique) {
      result.push(char);
    }
  }

  return result.join("");
}
