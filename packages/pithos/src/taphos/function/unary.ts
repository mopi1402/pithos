/**
 * Creates a function that accepts up to one argument, ignoring any additional arguments.
 *
 * @template Result - The return type of the function.
 * @param func - The function to cap arguments for.
 * @returns The new capped function.
 * @deprecated Use an inline arrow function instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions | Arrow functions - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * ['6', '8', '10'].map(unary(parseInt));
 * // => [6, 8, 10]
 *
 * // ✅ Recommended approach
 * ['6', '8', '10'].map(x => parseInt(x, 10));
 * // => [6, 8, 10]
 * ```
 */
export function unary<Result>(
  func: (arg: unknown) => Result
): (arg: unknown) => Result {
  return (arg: unknown) => func(arg);
}
