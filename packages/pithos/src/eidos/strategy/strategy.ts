/**
 * Functional Strategy Pattern.
 *
 * In OOP, the Strategy pattern requires an interface, concrete classes, and a
 * context class to swap algorithms at runtime. In functional TypeScript, a
 * strategy is simply a function - the pattern becomes composition.
 *
 * @module eidos/strategy
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/strategy/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * import { type Strategy, createStrategies, safeStrategy } from "@pithos/core/eidos/strategy";
 *
 * const sorting = createStrategies({
 *   asc: (data: number[]) => [...data].sort((a, b) => a - b),
 *   desc: (data: number[]) => [...data].sort((a, b) => b - a),
 * });
 *
 * sorting.execute("asc", [3, 1, 2]);  // [1, 2, 3]
 * sorting.use("desc")([3, 1, 2]);     // [3, 2, 1]
 * ```
 */

import { ok, err } from "@zygos/result/result";
import { some, none } from "@zygos/option";
import { ensure } from "@bridges/ensure";
import type { Result } from "@zygos/result/result";
import type { Option } from "@zygos/option";
import type { GenericSchema, Infer } from "@kanon/types/base";

/**
 * A Strategy is a function that transforms an input into an output.
 * This replaces the GoF Strategy interface + concrete classes.
 *
 * @template In - The input type
 * @template Out - The output type
 * @since 2.4.0
 */
export type Strategy<In, Out> = (input: In) => Out;

/**
 * Creates a strategy resolver from a record of named strategies.
 * Replaces the GoF Context class - instead of `setStrategy()` + `execute()`,
 * you simply pick a function by key and call it.
 *
 * @template K - Union of strategy keys
 * @template In - The input type
 * @template Out - The output type
 * @param strategies - Record mapping keys to strategy functions
 * @returns Resolver with `use` (get fn) and `execute` (run by key)
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const pricing = createStrategies({
 *   regular: (price: number) => price,
 *   vip: (price: number) => price * 0.8,
 *   premium: (price: number) => price * 0.7,
 * });
 *
 * const applyVip = pricing.use("vip");
 * applyVip(100); // 80
 *
 * pricing.execute("premium", 100); // 70
 *
 * // Safe lookup for dynamic keys (e.g. from config)
 * const key: string = getFromConfig();
 * pricing.get(key); // Option<Strategy<number, number>>
 * ```
 */
export function createStrategies<K extends string, In, Out>(
  strategies: Record<K, Strategy<In, Out>>,
) {
  return {
    /** Get a strategy by key. Typed keys only. */
    use: (key: K): Strategy<In, Out> => strategies[key],
    /** Execute a strategy by key with the given input. */
    execute: (key: K, input: In): Out => strategies[key](input),
    /** Safe lookup for dynamic/runtime keys. Returns `Option<Strategy>`. */
    get: (key: string): Option<Strategy<In, Out>> => {
      if (key in strategies) {
        // INTENTIONAL: key validated by `in` check, TS can't narrow string to K
        return some(strategies[key as K]);
      }
      return none;
    },
  };
}

/**
 * Wraps a strategy to return a zygos `Result` instead of throwing.
 * Catches any exception and wraps it in `Err<Error>`.
 *
 * @deprecated Use `Result.fromThrowable` from `@zygos/result/result` instead.
 *
 * ```ts
 * import { Result } from "@zygos/result/result";
 *
 * const safeParseJson = Result.fromThrowable(
 *   (input: string) => JSON.parse(input),
 *   (e) => e instanceof Error ? e : new Error(String(e)),
 * );
 * safeParseJson('{"ok":true}'); // Ok({ ok: true })
 * safeParseJson("invalid");     // Err(SyntaxError(...))
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/strategy/ | Full explanation, examples and live demo}
 * @template In - The input type
 * @template Out - The output type
 * @param strategy - The strategy to make safe
 * @returns A new strategy returning `Result<Out, Error>`
 * @since 2.4.0
 */
export function safeStrategy<In, Out>(
  strategy: Strategy<In, Out>,
): Strategy<In, Result<Out, Error>> {
  return (input: In) => {
    try {
      return ok(strategy(input));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
}

/**
 * Composes a primary strategy with a fallback.
 * If the primary throws, the fallback is executed instead.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param primary - The strategy to try first
 * @param fallback - The strategy to use if primary throws
 * @returns A new combined strategy
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const fromCache: Strategy<string, Data> = (key) => cache.get(key);
 * const fromApi: Strategy<string, Data> = (key) => api.fetch(key);
 *
 * const fetchData = withFallback(fromCache, fromApi);
 * fetchData("user:123"); // tries cache, falls back to API
 * ```
 */
export function withFallback<In, Out>(
  primary: Strategy<In, Out>,
  fallback: Strategy<In, Out>,
): Strategy<In, Out> {
  return (input: In): Out => {
    try {
      return primary(input);
    } catch {
      return fallback(input);
    }
  };
}

/**
 * Validates input against a kanon schema before executing the strategy.
 * Bridges kanon validation, zygos Result, and the strategy pattern.
 *
 * @template S - The kanon schema type
 * @template Out - The output type of the strategy
 * @param schema - Kanon schema to validate input against
 * @param strategy - Strategy to execute on validated input
 * @returns A function accepting unknown input and returning `Result<Out, string>`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { number } from "@pithos/core/kanon";
 *
 * const double = withValidation(
 *   number().min(0),
 *   (n) => n * 2,
 * );
 *
 * double(5);       // Ok(10)
 * double(-1);      // Err("Number must be >= 0")
 * double("hello"); // Err("Expected number")
 * ```
 */
export function withValidation<S extends GenericSchema, Out>(
  schema: S,
  strategy: Strategy<Infer<S>, Out>,
): (input: unknown) => Result<Out, string> {
  return (input: unknown) => ensure(schema, input).map(strategy);
}
