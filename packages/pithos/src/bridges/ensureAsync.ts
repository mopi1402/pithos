import { parse } from "@kanon/core/parser";
import { okAsync, errAsync } from "@zygos/result/result-async";
import type { Schema, GenericSchema, Infer } from "@kanon/types/base";
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
 * import { ensureAsync } from "@pithos/core/bridges/ensureAsync";
 * import { object, string, number } from "@pithos/core/kanon";
 *
 * safeFetch("/api/user")
 *   .andThen(res => safeJson(res))
 *   .andThen(data => ensureAsync(UserSchema, data))
 *   .map(user => user.name);
 * ```
 */
export function ensureAsync<T>(schema: Schema<T>, input: unknown): ResultAsync<T, string>;
/**
 * Overload accepting a union of schemas.
 * Infers the output type from the union.
 *
 * @since 2.2.0
 */
export function ensureAsync<S extends GenericSchema>(schema: S, input: unknown): ResultAsync<Infer<S>, string>;
export function ensureAsync(
  schema: GenericSchema,
  input: unknown,
): ResultAsync<unknown, string> {
  const result = parse(schema, input);
  return result.success ? okAsync(result.data) : errAsync(result.error);
}
