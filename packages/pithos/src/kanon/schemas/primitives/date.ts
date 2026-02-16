import { DateConstraint } from "@kanon/types/constraints";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addDateConstraints } from "@kanon/schemas/constraints/date";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.date;

  return (value: unknown) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return true;
    return errorMsg;
  };
};

/**
 * Factory to create a date schema.
 */
const createDateSchema = (message?: string): DateConstraint => {
  const baseSchema = {
    type: "date" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };

  return addDateConstraints(baseSchema);
};

/**
 * Singleton for the default case (reused for each call without message).
 * 
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 * Constraint methods (min, max, before, after) create new objects, so they don't mutate this singleton.
 */
const DEFAULT_DATE_SCHEMA = Object.freeze(createDateSchema());

/**
 * Date schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - date()
 * - date("Custom error")
 * - date().min(new Date())
 * - date().max(new Date())
 *
 * @param message - Custom error message (optional).
 * @returns DateConstraint with all constraints.
 * @since 2.0.0
 */
export function date(message?: string): DateConstraint {
  return message ? createDateSchema(message) : DEFAULT_DATE_SCHEMA;
}
