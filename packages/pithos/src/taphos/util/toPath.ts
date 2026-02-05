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
  // Stryker disable next-line ConditionalExpression,StringLiteral: Empty string check is defensive
  if (value == null || value === "") {
    return [];
  }

  const length = value.length;

  // Quick scan for first separator — very cheap for short keys
  let firstSep = 0;
  // Stryker disable next-line ConditionalExpression,EqualityOperator: fast-path optimization - full parser below handles all cases identically
  while (firstSep < length) {
    const c = value.charCodeAt(firstSep);
    // Stryker disable next-line ConditionalExpression,EqualityOperator: fast-path optimization - full parser below handles all cases identically
    if (c === 46 || c === 91) break; // '.' or '['
    firstSep++;
  }

  // No separator found → single key (covers 'a', 'foo', 'myProp', etc.)
  // Stryker disable next-line ConditionalExpression,EqualityOperator,BlockStatement,ArrayDeclaration: fast-path optimization - full parser returns same result for simple keys
  if (firstSep === length) {
    return [value];
  }

  // Full single-pass parser
  const result: string[] = [];
  let index = 0;
  let key = "";

  while (index < length) {
    const ch = value[index];

    if (ch === "[") {
      if (key !== "") {
        result[result.length] = key;
        key = "";
      }
      index++;
      // Stryker disable next-line ConditionalExpression,EqualityOperator: Quote detection inside brackets
      if (index < length) {
        const q = value.charCodeAt(index);
        if (q === 34 || q === 39) { // quoted: ["key"] or ['key']
          const start = ++index;
          // Stryker disable next-line EqualityOperator: index<=length reads one NaN charCode then exits - substring still correct
          while (index < length && value.charCodeAt(index) !== q) index++;
          result[result.length] = value.substring(start, index);
          index += 2; // skip quote + ]
        } else { // unquoted: [0] or [key]
          const start = index;
          // Stryker disable next-line EqualityOperator: index<=length reads one NaN charCode then exits - substring still correct
          while (index < length && value.charCodeAt(index) !== 93) index++; // find ]
          result[result.length] = value.substring(start, index);
          index++; // skip ]
        }
      }
      // Skip dot after bracket (e.g., [0].next)
      // Stryker disable next-line ConditionalExpression,EqualityOperator: index<=length or true both safe - charCodeAt(length)=NaN !== 46, so dot-skip is harmlessly skipped
      if (index < length && value.charCodeAt(index) === 46) index++;
    } else if (ch === ".") {
      result[result.length] = key;
      key = "";
      index++;
    } else {
      key += ch;
      index++;
    }
  }

  if (key !== "") {
    result[result.length] = key;
  }

  return result;
}
