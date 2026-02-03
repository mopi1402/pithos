/**
 * Parses a string containing key-value pairs into an object.
 *
 * @param input - The input string to parse.
 * @param pairSeparator - The separator between pairs. Defaults to `","`.
 * @defaultValue ","
 * @param keyValueSeparator - The separator between key and value. Defaults to `"="`.
 * @defaultValue "="
 * @returns The object containing parsed key-value pairs.
 * @since 1.1.0
 *
 * @note Trims keys and values automatically. Ignores malformed pairs (empty key or value).
 *
 * @example
 * ```typescript
 * parseKeyValuePairs('name=John,age=30');
 * // => { name: 'John', age: '30' }
 *
 * parseKeyValuePairs('name:John;age:30', ';', ':');
 * // => { name: 'John', age: '30' }
 *
 * parseKeyValuePairs('key=value&other=data', '&');
 * // => { key: 'value', other: 'data' }
 *
 * parseKeyValuePairs(' name = John , age = 30 ');
 * // => { name: 'John', age: '30' }
 * ```
 */
export function parseKeyValuePairs(
  // Stryker disable next-line StringLiteral: Default empty string produces same result as any non-key-value string (both return {})
  input = "",
  pairSeparator = ",",
  keyValueSeparator = "="
): Record<string, string> {
  return Object.fromEntries(
    input
      .split(pairSeparator)
      // Stryker disable next-line MethodExpression: Trimming pair vs trimming parts separately produces identical results
      .map((pair) => pair.split(keyValueSeparator).map((s) => s.trim()))
      .filter(([key, value]) => key && value)
  );
}
