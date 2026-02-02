/**
 * Options for the truncate function.
 * @since 1.1.0
 */
export interface TruncateOptions {
  /** Maximum string length (default: 30). */
  length?: number;
  /** The string to indicate text is omitted (default: '...'). */
  omission?: string;
  /** The separator pattern to truncate to. */
  separator?: string | RegExp;
}

/**
 * Truncates string if it's longer than the given maximum length.
 *
 * @param str - The string to truncate.
 * @param options - The options object.
 * @returns The truncated string.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 *
 * truncate('hi-diddly-ho there, neighborino', { length: 24 });
 * // => 'hi-diddly-ho there, n...'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   separator: ' '
 * });
 * // => 'hi-diddly-ho there,...'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   separator: /,? +/
 * });
 * // => 'hi-diddly-ho there...'
 *
 * truncate('hi-diddly-ho there, neighborino', {
 *   omission: ' [...]'
 * });
 * // => 'hi-diddly-ho there, neig [...]'
 * ```
 */
export function truncate(str: string, options: TruncateOptions = {}): string {
  const { length = 30, omission = "...", separator } = options;

  if (str.length <= length) {
    return str;
  }

  const maxLength = length - omission.length;
  // Stryker disable next-line EqualityOperator: equivalent mutant - when maxLength === 0, str.slice(0, 0) + omission equals omission.slice(0, length)
  if (maxLength < 0) {
    return omission.slice(0, length);
  }

  let truncated = str.slice(0, maxLength);

  if (separator !== undefined) {
    if (typeof separator === "string") {
      const lastIndex = truncated.lastIndexOf(separator);
      if (lastIndex > 0) {
        truncated = truncated.slice(0, lastIndex);
      }
    } else {
      let lastMatch: RegExpExecArray | null = null;
      const globalSeparator = new RegExp(
        separator.source,
        separator.flags.includes("g") ? separator.flags : separator.flags + "g"
      );

      let match;
      while ((match = globalSeparator.exec(truncated)) !== null) {
        lastMatch = match;
      }

      if (lastMatch && lastMatch.index > 0) {
        truncated = truncated.slice(0, lastMatch.index);
      }
    }
  }

  return truncated + omission;
}
