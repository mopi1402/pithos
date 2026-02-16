/**
 * Pads string on the left and right sides if it's shorter than length.
 *
 * @param str - The string to pad.
 * @param length - The target length.
 * @param chars - The string used as padding.
 * @returns The padded string.
 * @deprecated Use `padStart` and `padEnd` combination directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart | String.padStart() - MDN}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd | String.padEnd() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * pad('abc', 8);           // => '  abc   '
 * pad('abc', 8, '_-');     // => '_-abc_-_'
 * pad('abc', 3);           // => 'abc'
 *
 * // ✅ Recommended approach
 * const str = 'abc';
 * const length = 8;
 * const padLength = Math.max(0, length - str.length);
 * const leftPad = Math.floor(padLength / 2);
 * const rightPad = padLength - leftPad;
 * str.padStart(str.length + leftPad).padEnd(length);
 * // => '  abc   '
 * ```
 */
export function pad(
  str: string | null | undefined,
  length: number | null | undefined,
  // Stryker disable next-line StringLiteral: Empty string default is handled by `chars || " "` below
  chars = " "
): string {
  const s = str ?? "";
  const len = length ?? 0;

  // Stryker disable next-line EqualityOperator: When s.length === len, no padding needed, returning s is correct
  if (s.length >= len) {
    return s;
  }

  const padLength = len - s.length;
  const leftPad = Math.floor(padLength / 2);
  const rightPad = padLength - leftPad;

  const padChar = chars || " ";
  // Stryker disable next-line ArithmeticOperator,MethodExpression: Division vs multiplication doesn't matter because slice() trims to exact length
  const leftStr = padChar.repeat(Math.ceil(leftPad / padChar.length)).slice(0, leftPad);
  // Stryker disable next-line ArithmeticOperator,MethodExpression: Division vs multiplication doesn't matter because slice() trims to exact length
  const rightStr = padChar.repeat(Math.ceil(rightPad / padChar.length)).slice(0, rightPad);

  return leftStr + s + rightStr;
}
