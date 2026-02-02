import { DateConstraint } from "@kanon/types/constraints";
import { CoercedResult } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addDateConstraints } from "@kanon/schemas/constraints/date";

/**
 * Coerce Date schema - converts to Date with constraints.
 *
 * @param message - Custom error message.
 * @returns Schema that coerces to Date with chainable constraints.
 * @since 3.0.0
 *
 * @example
 * ```ts
 * // Basic coercion
 * coerceDate()
 *
 * // With constraints
 * coerceDate().min(new Date("2020-01-01"))
 * coerceDate().max(new Date()).before(new Date("2030-01-01"))
 * ```
 */
export function coerceDate(message?: string): DateConstraint {
  const baseSchema = {
    type: "date" as const,
    message,
    refinements: undefined,
    validator: (value: unknown): true | string | CoercedResult<Date> => {
      if (value instanceof Date && !Number.isNaN(value.getTime())) return true;
      if (value === null) return message || ERROR_MESSAGES_COMPOSITION.coerceNullToDate;
      if (value === undefined) return message || ERROR_MESSAGES_COMPOSITION.coerceUndefinedToDate;
      try {
        const coerced = new Date(value as string | number);
        if (Number.isNaN(coerced.getTime())) {
          return message || ERROR_MESSAGES_COMPOSITION.coerceInvalidDate;
        }
        return { coerced };
      } catch {
        return message || ERROR_MESSAGES_COMPOSITION.coerceInvalidDate;
      }
    },
  };

  return addDateConstraints(baseSchema);
}
