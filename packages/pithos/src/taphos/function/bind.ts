/**
 * Creates a function bound to a given object (thisArg), with optional partial application of arguments.
 *
 * @template Func - The type of the function to bind.
 * @param func - The function to bind.
 * @param thisArg - The this binding of func.
 * @param partials - The arguments to be partially applied.
 * @returns The new bound function.
 * @deprecated Use `function.bind(thisArg, ...args)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind | Function.bind() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_function_bind | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const obj = {
 *   name: 'John',
 *   greet: function(greeting: string, punctuation: string) {
 *     return `${greeting} ${this.name}${punctuation}`;
 *   }
 * };
 *
 * // ❌ Deprecated approach
 * const boundGreet = bind(obj.greet, obj, 'Hello');
 * console.log(boundGreet('!')); // "Hello John!"
 *
 * // ✅ Recommended approach
 * const boundGreetNative = obj.greet.bind(obj, 'Hello');
 * console.log(boundGreetNative('!')); // "Hello John!"
 *
 * // ✅ Alternative with arrow function (no this binding needed)
 * const greetArrow = (greeting: string, punctuation: string) =>
 *   `${greeting} ${obj.name}${punctuation}`;
 * const boundGreetArrow = greetArrow.bind(null, 'Hello');
 * console.log(boundGreetArrow('!')); // "Hello John!"
 * ```
 */
// INTENTIONAL: `any` required for Function.bind() compatibility - thisArg and partials have no type constraints in native bind
export function bind<Func extends (...args: any[]) => any>(
  func: Func,
  thisArg: any,
  ...partials: any[]
): (...args: any[]) => ReturnType<Func> {
  return func.bind(thisArg, ...partials);
}