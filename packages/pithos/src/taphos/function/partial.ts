/**
 * Creates a function that invokes func with partials prepended to the arguments it receives.
 *
 * @template Func - The type of the function to partially apply.
 * @param func - The function to partially apply arguments to.
 * @param partials - The arguments to be partially applied.
 * @returns The new partially applied function.
 * @deprecated Use arrow functions with closure or `Function.bind()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind | Function.bind() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_function_bind | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const greet = (greeting: string, name: string, punctuation: string) =>
 *   `${greeting} ${name}${punctuation}`;
 *
 * // ❌ Deprecated approach
 * const sayHello = partial(greet, 'Hello');
 * console.log(sayHello('John', '!')); // "Hello John!"
 *
 * // ✅ Recommended approach with bind
 * const sayHelloBind = greet.bind(null, 'Hello');
 * console.log(sayHelloBind('John', '!')); // "Hello John!"
 *
 * // ✅ Alternative with arrow function
 * const sayHelloArrow = (name: string, punctuation: string) =>
 *   greet('Hello', name, punctuation);
 * console.log(sayHelloArrow('John', '!')); // "Hello John!"
 * ```
 */
// INTENTIONAL: `any` required for Function.bind() compatibility - partials have no type constraints in native bind
export function partial<Func extends (...args: any[]) => any>(
  func: Func,
  ...partials: any[]
): (...args: any[]) => ReturnType<Func> {
  return func.bind(null, ...partials);
}