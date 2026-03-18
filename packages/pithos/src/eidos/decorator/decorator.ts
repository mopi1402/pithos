/**
 * Functional Decorator Pattern.
 *
 * In OOP, the Decorator pattern requires a Component interface, an abstract
 * Decorator class, and concrete decorator subclasses with inheritance.
 * In functional TypeScript, a decorator is a higher-order function that
 * wraps another function while preserving its signature.
 *
 * @module eidos/decorator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { decorate, before, after } from "@pithos/core/eidos/decorator/decorator";
 *
 * const greet = (name: string) => `Hello, ${name}!`;
 *
 * const enhanced = decorate(
 *   greet,
 *   before((name) => console.log(`calling with: ${name}`)),
 *   after((_name, result) => console.log(`returned: ${result}`)),
 * );
 *
 * enhanced("Alice");
 * // logs: calling with: Alice
 * // logs: returned: Hello, Alice!
 * // returns: "Hello, Alice!"
 * ```
 */

/**
 * A Decorator is a higher-order function that wraps a function,
 * adding behavior while preserving its signature.
 * Replaces the GoF abstract Decorator class + inheritance chain.
 *
 * @template In - The input type
 * @template Out - The output type
 * @since 2.4.0
 */
export type Decorator<In, Out> = (
  fn: (input: In) => Out,
) => (input: In) => Out;

/**
 * Applies one or more decorators to a function.
 * Decorators are applied left-to-right: the first decorator is the
 * innermost wrapper, the last is the outermost.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param fn - The function to decorate
 * @param decorators - Decorators to apply
 * @returns The decorated function
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const add = (n: number) => n + 1;
 *
 * const enhanced = decorate(
 *   add,
 *   before((n) => console.log("input:", n)),
 *   after((_n, result) => console.log("output:", result)),
 * );
 *
 * enhanced(5); // logs: input: 5, output: 6, returns 6
 * ```
 */
export function decorate<In, Out>(
  fn: (input: In) => Out,
  ...decorators: Decorator<In, Out>[]
): (input: In) => Out {
  return decorators.reduce<(input: In) => Out>((acc, dec) => dec(acc), fn);
}

/**
 * Creates a decorator that runs a hook before the function executes.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param hook - Function to run before, receives the input
 * @returns A Decorator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const withLog = before<string, string>((name) => {
 *   console.log(`calling greet with: ${name}`);
 * });
 *
 * const greet = withLog((name) => `Hello, ${name}!`);
 * greet("Alice"); // logs then returns "Hello, Alice!"
 * ```
 */
export function before<In, Out>(
  hook: (input: In) => void,
): Decorator<In, Out> {
  return (fn) => (input) => {
    hook(input);
    return fn(input);
  };
}

/**
 * Creates a decorator that runs a hook after the function executes.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param hook - Function to run after, receives input and output
 * @returns A Decorator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const withAudit = after<number, number>((input, output) => {
 *   auditLog.record({ input, output });
 * });
 *
 * const double = withAudit((n) => n * 2);
 * double(5); // returns 10, audit log records { input: 5, output: 10 }
 * ```
 */
export function after<In, Out>(
  hook: (input: In, output: Out) => void,
): Decorator<In, Out> {
  return (fn) => (input) => {
    const output = fn(input);
    hook(input, output);
    return output;
  };
}

/**
 * Creates a decorator with full control over execution.
 * The wrapper receives both the original function and the input,
 * and decides how (or whether) to call it. This is the most
 * powerful form - `before` and `after` are special cases of `around`.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param wrapper - Function that controls execution
 * @returns A Decorator
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Retry decorator
 * const withRetry = around<string, Response>((fn, input) => {
 *   try { return fn(input); }
 *   catch { return fn(input); } // one retry
 * });
 *
 * // Caching decorator
 * const cache = new Map<string, Data>();
 * const withCache = around<string, Data>((fn, key) => {
 *   const cached = cache.get(key);
 *   if (cached) return cached;
 *   const result = fn(key);
 *   cache.set(key, result);
 *   return result;
 * });
 * ```
 */
export function around<In, Out>(
  wrapper: (fn: (input: In) => Out, input: In) => Out,
): Decorator<In, Out> {
  return (fn) => (input) => wrapper(fn, input);
}
