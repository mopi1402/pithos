import { parse } from "@kanon/core/parser";
import { okAsync, errAsync } from "@zygos/result/result-async";
import type { Schema } from "@kanon/types/base";
import type { ResultAsync } from "@zygos/result/result-async";

/**
 * Parses a value against a Kanon schema and returns a Zygos `ResultAsync`.
 *
 * Async variant of `ensure` — designed for `ResultAsync` chains
 * where validation is one step in an async pipeline.
 *
 * @template T - The expected output type of the schema.
 * @param schema - Kanon schema to validate against.
 * @param input - Value to validate.
 * @returns `OkAsync<T>` if validation succeeds, `ErrAsync<string>` otherwise.
 * @since 2.1.0
 *
 * @example
 * ```typescript
 * import { ensureAsync } from "pithos/bridges/ensureAsync";
 * import { object, string, number } from "pithos/kanon";
 *
 * safeFetch("/api/user")
 *   .andThen(res => safeJson(res))
 *   .andThen(data => ensureAsync(UserSchema, data))
 *   .map(user => user.name);
 * ```
 */
export function ensureAsync<T>(
  schema: Schema<T>,
  input: unknown,
): ResultAsync<T, string> {
  const result = parse(schema, input);
  return result.success ? okAsync(result.data) : errAsync(result.error);
}
