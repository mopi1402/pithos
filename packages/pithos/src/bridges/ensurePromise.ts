import { parse } from "@kanon/core/parser";
import { ResultAsync, okAsync, errAsync } from "@zygos/result/result-async";
import type { Schema } from "@kanon/types/base";

/**
 * Resolves a Promise, validates the result against a Kanon schema,
 * and returns a `ResultAsync`.
 *
 * Eliminates the `ResultAsync.fromPromise(...).andThen(...)` boilerplate
 * when you need to fetch data and validate it in one step.
 *
 * @template T - The expected output type of the schema.
 * @param schema - Kanon schema to validate against.
 * @param promise - Promise that resolves to the value to validate.
 * @returns `ResultAsync<T, string>` — `Ok<T>` if the promise resolves and validation succeeds, `Err<string>` otherwise.
 * @since 2.1.0
 *
 * @example
 * ```typescript
 * import { ensurePromise } from "pithos/bridges/ensurePromise";
 * import { object, string, number } from "pithos/kanon";
 *
 * const UserSchema = object({ name: string(), age: number() });
 *
 * ensurePromise(UserSchema, fetch("/api/user").then(r => r.json()))
 *   .map(user => user.name.toUpperCase());
 * ```
 */
export function ensurePromise<T>(
  schema: Schema<T>,
  promise: Promise<unknown>,
): ResultAsync<T, string> {
  return ResultAsync.fromPromise(
    promise,
    (e) => e instanceof Error ? e.message : String(e),
  ).andThen((data) => {
    const result = parse(schema, data);
    return result.success ? okAsync(result.data) : errAsync(result.error);
  });
}
