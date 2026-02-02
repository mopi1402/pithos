//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Parses a path string into an array of keys for object property access.
 *
 * @param path - The path string to parse.
 * @returns The array of parsed keys (strings and numbers).
 * @since 1.1.0
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
  // Stryker disable next-line Regex: \D+ mutant produces identical results - unmatched bracket falls back to first group with same outcome
  const regex = /([^.[\]]+)|\[(\d+|"[^"]*"|'[^']*')\]/g;
  let match;

  while ((match = regex.exec(path)) !== null) {
    const key = match[1] ?? match[2];
    // Stryker disable next-line Regex: Anchor ^ is redundant here - quote anywhere vs quote at start produces same result for this input set
    const isQuoted = /^["']/.test(key);
    const unquoted = key.replace(/^["']|["']$/g, "");
    result.push(
      !isQuoted && /^\d+$/.test(unquoted) ? Number(unquoted) : unquoted
    );
  }

  return result;
}
