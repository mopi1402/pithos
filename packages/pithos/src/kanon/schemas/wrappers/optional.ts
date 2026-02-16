import { Schema } from "@kanon/types/base";
import { OptionalSchema } from "@kanon/types/wrappers";

/**
 * Makes a schema optional (accepts undefined).
 *
 * @param schema - The schema to make optional
 * @returns Schema that accepts the original type or undefined
 * @since 2.0.0
 */
export function optional<T>(schema: Schema<T>): OptionalSchema<Schema<T>> {
  return {
    type: "optional" as const,
    innerSchema: schema,
    message: schema.message,
    validator: (value: unknown) => {
      if (value === undefined) {
        return true;
      }
      return schema.validator(value);
    },
  };
}
