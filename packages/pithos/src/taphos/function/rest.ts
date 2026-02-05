/**
 * Creates a function that invokes func with the this binding of the created function
 * and an array of arguments.
 *
 * @template Result - The return type of the function.
 * @param func - The function to apply a rest parameter to.
 * @param start - The start position of the rest parameter. Defaults to func.length - 1.
 * @returns The new function.
 * @deprecated Use rest parameters `(...args)` syntax directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters | Rest parameters - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const say = rest((what: string, names: string[]) => {
 *   return what + ' ' + names.join(', ');
 * });
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, pebbles'
 *
 * // ✅ Recommended approach
 * const say = (what: string, ...names: string[]) => {
 *   return what + ' ' + names.join(', ');
 * };
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, pebbles'
 * ```
 */
export function rest<Result>(
  func: (...args: unknown[]) => Result,
  start?: number
): (...args: unknown[]) => Result {
  const startIndex = start === undefined ? Math.max(func.length - 1, 0) : start;

  // Stryker disable next-line ConditionalExpression,BlockStatement: Fast-path optimization - generic fallback with slice(0) produces identical result
  if (startIndex === 0) {
    return function (this: unknown, ...args: unknown[]): Result {
      return func.call(this, args);
    };
  }

  return function (this: unknown, ...args: unknown[]): Result {
    const leadingArgs = args.slice(0, startIndex);
    const restArgs = args.slice(startIndex);
    return func.apply(this, [...leadingArgs, restArgs]);
  };
}
