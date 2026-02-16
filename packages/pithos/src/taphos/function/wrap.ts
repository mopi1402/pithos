/**
 * Creates a function that provides value to wrapper as its first argument.
 *
 * @template Arg - The type of the first argument.
 * @template Args - The types of additional arguments.
 * @template Result - The return type.
 * @param value - The value to wrap.
 * @param wrapper - The wrapper function.
 * @returns The new function.
 * @deprecated Use a closure or higher-order function directly instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const p = wrap(escape, (func, text) => `<p>${func(text)}</p>`);
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 *
 * // ✅ Recommended approach
 * const p = (text: string) => `<p>${escape(text)}</p>`;
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 * ```
 */
export function wrap<Arg, Args extends unknown[], Result>(
  value: Arg,
  wrapper: (value: Arg, ...args: Args) => Result
): (...args: Args) => Result {
  return (...args: Args): Result => wrapper(value, ...args);
}
