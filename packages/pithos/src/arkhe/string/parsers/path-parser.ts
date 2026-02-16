/**
 * Parses a path string into an array of keys for object property access.
 *
 * @param path - The path string to parse.
 * @returns The array of parsed keys (strings and numbers).
 * @since 2.0.0
 *
 * @note Supports dot notation, bracket notation, and quoted keys. Numeric indices become numbers.
 *
 * @example
 * ```typescript
 * parsePath('a.b.c');
 * // => ['a', 'b', 'c']
 *
 * parsePath('items[0].name');
 * // => ['items', 0, 'name']
 *
 * parsePath('data[1][2].value');
 * // => ['data', 1, 2, 'value']
 *
 * parsePath('obj["key"].value');
 * // => ['obj', 'key', 'value']
 * ```
 */
export function parsePath(path: string): (string | number)[] {
  const result: (string | number)[] = [];
  const length = path.length;

  // Stryker disable next-line ConditionalExpression,BlockStatement: Fast-path optimization - while loop doesn't execute on empty string, result stays []
  if (length === 0) {
    return result;
  }

  let index = 0;
  let key = '';
  let quoteChar = '';
  let bracket = false;
  let wasQuoted = false;

  while (index < length) {
    const char = path[index];

    if (quoteChar) {
      if (char === '\\' && index + 1 < length) {
        // Escape character
        index++;
        key += path[index];
      } else if (char === quoteChar) {
        // End of quote
        quoteChar = '';
        wasQuoted = true;
      } else {
        key += char;
      }
    } else if (bracket) {
      if (char === '"' || char === "'") {
        // Start of quoted string inside brackets
        quoteChar = char;
      } else if (char === ']') {
        // End of bracketed segment
        bracket = false;
        // Convert to number only if not quoted and all digits
        result.push(!wasQuoted && isNumericString(key) ? Number(key) : key);
        key = '';
        wasQuoted = false;
      } else {
        key += char;
      }
    } else {
      if (char === '[') {
        // Start of bracketed segment
        bracket = true;
        if (key) {
          // Dot notation keys: convert to number if all digits
          result.push(isNumericString(key) ? Number(key) : key);
          key = '';
        }
      } else if (char === '.') {
        if (key) {
          // Dot notation keys: convert to number if all digits
          result.push(isNumericString(key) ? Number(key) : key);
          key = '';
        }
      } else {
        key += char;
      }
    }

    index++;
  }

  if (key) {
    // Final key: convert to number if all digits
    result.push(isNumericString(key) ? Number(key) : key);
  }

  return result;
}

function isNumericString(str: string): boolean {
  if (str.length === 0) return false;
  // Stryker disable next-line EqualityOperator: out-of-bounds charCodeAt returns NaN which fails both comparisons, equivalent to returning true for already-validated chars
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 48 || code > 57) return false; // '0' = 48, '9' = 57
  }
  return true;
}
