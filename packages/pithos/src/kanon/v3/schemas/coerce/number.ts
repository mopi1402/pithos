import { NumberConstraint } from "@kanon/v3/types/constraints";
import { CoercedResult } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { addNumberConstraints } from "@kanon/v3/schemas/constraints/number";

/**
 * Coerce Number schema - converts to number with constraints.
 *
 * @param message - Custom error message.
 * @returns Schema that coerces to number with chainable constraints.
 * @since 3.0.0
 *
 * @example
 * ```ts
 * // Basic coercion
 * coerceNumber()
 *
 * // With constraints
 * coerceNumber().min(0).max(100)
 * coerceNumber().int().positive()
 * ```
 */
export function coerceNumber(message?: string): NumberConstraint {
  const baseSchema = {
    type: "number" as const,
    message,
    refinements: undefined,
    validator: (value: unknown): true | string | CoercedResult<number> => {
      if (typeof value === "number" && !Number.isNaN(value)) return true;
      try {
        const coerced = Number(value);
        if (Number.isNaN(coerced)) {
          return message || ERROR_MESSAGES_COMPOSITION.coerceNumber;
        }
        return { coerced };
      } catch {
        return message || ERROR_MESSAGES_COMPOSITION.coerceNumber;
      }
    },
  };

  return addNumberConstraints(baseSchema);
}
