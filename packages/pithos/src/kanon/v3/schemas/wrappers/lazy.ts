import { LazySchema } from "@kanon/v3/types/wrappers";
import { Schema } from "@kanon/v3/types/base";

/**
 * Lazy schema - allows creating recursive types by deferring evaluation.
 *
 * @param getter - Function that returns the schema to evaluate.
 * @param message - Custom error message.
 * @returns Lazy schema that evaluates the schema on demand.
 * @since 3.0.0
 */
export function lazy<T>(
  getter: () => Schema<T>,
  message?: string
): LazySchema<T> {
  let cachedSchema: Schema<T> | null = null;

  return {
    type: "lazy" as const,
    message,
    getter,
    validator: (value: unknown) => {
      cachedSchema ??= getter();
      return cachedSchema.validator(value);
    },
  };
}
