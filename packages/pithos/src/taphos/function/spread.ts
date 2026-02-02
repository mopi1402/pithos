/**
 * Creates a function that invokes func with the this binding of the create function
 * and an array of arguments much like Function#apply.
 *
 * @template Result - The return type of the function.
 * @param func - The function to spread arguments over.
 * @param start - The start position of the spread. Defaults to 0.
 * @returns The new function.
 * @deprecated Use the spread operator `...` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax | Spread syntax - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const say = spread((who: string, what: string) => who + ' says ' + what);
 * say(['fred', 'hello']);
 * // => 'fred says hello'
 *
 * // ✅ Recommended approach
 * const say = (who: string, what: string) => who + ' says ' + what;
 * const args: [string, string] = ['fred', 'hello'];
 * say(...args);
 * // => 'fred says hello'
 * ```
 */
export function spread<Result>(
  func: (...args: unknown[]) => Result,
  start = 0
): (args: unknown[]) => Result {
  return function (this: unknown, args: unknown[]): Result {
    const leadingArgs = args.slice(0, start);
    const spreadArgs = args.slice(start);
    return func.apply(this, [...leadingArgs, ...spreadArgs]);
  };
}
