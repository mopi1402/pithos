import { parse } from "@kanon/core/parser";
import { ok, err } from "@zygos/result/result";
import type { Schema, GenericSchema, Infer } from "@kanon/types/base";
import type { Result } from "@zygos/result/result";

/**
 * Parses a value against a Kanon schema and returns a Zygos `Result`.
 *
 * Bridge between Kanon validation and Zygos error handling:
 * instead of checking `result.success`, you get a chainable `Result<T, string>`.
 *
 * @template T - The expected output type of the schema.
 * @param schema - Kanon schema to validate against.
 * @param input - Value to validate.
 * @returns `Ok<T>` if validation succeeds, `Err<string>` otherwise.
 * @since 2.1.0
 *
 * @example
 * ```typescript
 * import { ensure } from "@pithos/core/bridges/ensure";
 * import { object, string, number } from "@pithos/core/kanon";
 *
 * const schema = object({ name: string(), age: number() });
 *
 * ensure(schema, data)
 *   .map(user => user.name.toUpperCase())
 *   .mapErr(error => `Validation failed: ${error}`);
 * ```
 */
export function ensure<T>(schema: Schema<T>, input: unknown): Result<T, string>;
/**
 * Overload accepting a union of schemas (e.g. `bookFields[name]`).
 * Infers the output type from the union, so you don't need a switch/case
 * to narrow each schema individually.
 *
 * @since 2.2.0
 */
export function ensure<S extends GenericSchema>(schema: S, input: unknown): Result<Infer<S>, string>;
export function ensure(
  schema: GenericSchema,
  input: unknown,
): Result<unknown, string> {
  const result = parse(schema, input);
  return result.success ? ok(result.data) : err(result.error);
}
