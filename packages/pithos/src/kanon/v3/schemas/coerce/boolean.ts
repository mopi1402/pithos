import { BooleanSchema } from "@kanon/v3/types/primitives";
import { CoercedResult } from "@kanon/v3/types/base";

/**
 * Coerce Boolean schema - converts to boolean.
 *
 * @param message - Custom error message (optional).
 * @returns Schema that coerces to boolean.
 * @since 3.0.0
 */
export function coerceBoolean(message?: string): BooleanSchema {
  return {
    type: "boolean" as const,
    message,
    refinements: undefined,
    validator: (value: unknown): true | CoercedResult<boolean> => {
      if (typeof value === "boolean") {
        return true; // Already a boolean
      }
      return { coerced: Boolean(value) };
    },
  };
}
