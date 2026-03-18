/**
 * Functional Proxy Pattern.
 *
 * In OOP, the Proxy pattern requires a Subject interface, a RealSubject class,
 * and a Proxy class that wraps it to control access (lazy init, caching,
 * access control, logging...).
 * In functional TypeScript, Proxy provides ready-made higher-order functions
 * for the most common proxy use cases.
 *
 * Compared to Decorator (generic hooks via before/after/around), Proxy
 * offers opinionated, named wrappers for specific access-control scenarios.
 *
 * Several proxy use cases are already covered by arkhe utilities,
 * re-exported here for discoverability:
 * - `memoize` - caching proxy with custom key resolvers, cache injection (LRU, TTL)
 * - `once` - single-use proxy, executes once then caches the result
 * - `throttle` - rate-limiting proxy, at most one call per time window
 * - `debounce` - debounce proxy, defers execution until inactivity
 *
 * @module eidos/proxy
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { lazy, memoize, once, throttle, guarded } from "@pithos/core/eidos/proxy/proxy";
 *
 * // Lazy initialization proxy
 * const query = lazy(() => {
 *   const conn = createConnection();
 *   return (sql: string) => conn.execute(sql);
 * });
 *
 * // Caching proxy
 * const fetchUser = memoize((id: string) => db.query(id));
 *
 * // Single-use proxy
 * const init = once(() => bootstrap());
 *
 * // Rate-limiting proxy
 * const onScroll = throttle(() => recalcLayout(), 200);
 *
 * // Access control proxy
 * const deleteUser = guarded(
 *   (id: string) => db.delete(id),
 *   (id) => id !== "admin" ? true : "Cannot delete admin",
 * );
 * ```
 */

import { ok, err } from "@zygos/result/result";
import type { Result } from "@zygos/result/result";

/** Caching proxy - re-exported from arkhe for discoverability. */
export { memoize } from "@arkhe/function/memoize";
export type { MemoizedFunction, MemoizeOptions, MemoizeCache } from "@arkhe/function/memoize";

/** Single-use proxy - re-exported from arkhe for discoverability. */
export { once } from "@arkhe/function/once";

/** Rate-limiting proxy - re-exported from arkhe for discoverability. */
export { throttle } from "@arkhe/function/throttle";

/** Debounce proxy - re-exported from arkhe for discoverability. */
export { debounce } from "@arkhe/function/debounce";

/**
 * Lazy proxy - defers function creation until first call.
 * The factory is called once on the first invocation, then
 * the created function is used directly for all subsequent calls.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param factory - A function that creates the real function on demand
 * @returns A proxy that initializes lazily
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Expensive connection is only created when first needed
 * const query = lazy(() => {
 *   const conn = createConnection(); // heavy init
 *   return (sql: string) => conn.execute(sql);
 * });
 *
 * // Nothing happens yet...
 * query("SELECT 1"); // NOW the connection is created, then query runs
 * query("SELECT 2"); // reuses the same connection
 * ```
 */
export function lazy<In, Out>(
  factory: () => (input: In) => Out,
): (input: In) => Out {
  let fn: ((input: In) => Out) | null = null;
  return (input: In): Out => {
    if (!fn) fn = factory();
    return fn(input);
  };
}

/**
 * Guarded proxy - checks access before calling the function.
 * The check returns `true` to allow, or a rejection reason string to deny.
 * Returns a zygos `Result`: `Ok(output)` if allowed, `Err(reason)` if denied.
 *
 * @template In - The input type
 * @template Out - The output type
 * @param fn - The function to guard
 * @param check - Access check. Return `true` to allow, or a string reason to deny.
 * @returns A proxy returning `Result<Out, string>`
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const deleteUser = guarded(
 *   (id: string) => db.delete(id),
 *   (id) => id !== "admin" ? true : "Cannot delete admin user",
 * );
 *
 * deleteUser("user-1"); // Ok(void)
 * deleteUser("admin");  // Err("Cannot delete admin user")
 * ```
 */
export function guarded<In, Out>(
  fn: (input: In) => Out,
  check: (input: In) => true | string,
): (input: In) => Result<Out, string> {
  return (input: In) => {
    const result = check(input);
    if (result !== true) return err(result);
    return ok(fn(input));
  };
}
