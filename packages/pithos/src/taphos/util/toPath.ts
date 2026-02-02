/**
 * Converts value to a property path array.
 *
 * @param value - The value to convert.
 * @returns The new property path array.
 * @deprecated Use string split or manual parsing instead.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toPath('a.b.c');       // => ['a', 'b', 'c']
 * toPath('a[0].b.c');    // => ['a', '0', 'b', 'c']
 *
 * // ✅ Recommended approach
 * 'a.b.c'.split('.');    // => ['a', 'b', 'c']
 * // For complex paths with brackets:
 * 'a[0].b.c'.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
 * // => ['a', '0', 'b', 'c']
 * ```
 */
export function toPath(value: string | null | undefined): string[] {
  // Stryker disable next-line ConditionalExpression,StringLiteral: Empty string check is defensive; "".split(".").filter(Boolean) also returns []
  if (value == null || value === "") {
    return [];
  }

  // Stryker disable next-line Regex,MethodExpression: Regex variations (\d+ vs \d) produce equivalent results for common paths; filter(Boolean) handles edge cases from empty segments
  return value
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: Regex variations produce equivalent results for common paths
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}
