import { StringConstraint } from "@kanon/types/constraints";
import { CoercedResult } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addStringConstraints } from "@kanon/schemas/constraints/string";

/**
 * Coerce String schema - converts anything to string with constraints.
 *
 * @param message - Custom error message.
 * @returns Schema that coerces to string with chainable constraints.
 * @since 3.0.0
 *
 * @example
 * ```ts
 * // Basic coercion
 * coerceString()
 *
 * // With constraints
 * coerceString().minLength(2).maxLength(100)
 * coerceString().email()
 * ```
 */
export function coerceString(message?: string): StringConstraint {
  const baseSchema = {
    type: "string" as const,
    message,
    refinements: undefined,
    validator: (value: unknown): true | string | CoercedResult<string> => {
      if (typeof value === "string") {
        return true; // Already a string
      }
      // Try/catch for objects with broken toString/valueOf (e.g., {toString: false})
      try {
        return { coerced: String(value) };
      } catch {
        return message || ERROR_MESSAGES_COMPOSITION.coerceString;
      }
    },
  };

  return addStringConstraints(baseSchema);
}
