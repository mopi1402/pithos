import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addNumberConstraints } from "@kanon/schemas/constraints/number";
import { NumberConstraint } from "@kanon/types/constraints";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.number;

  return (value: unknown) => {
    if (typeof value === "number" && !Number.isNaN(value)) return true;
    return errorMsg;
  };
};

/**
 * Factory to create a number schema.
 */
const createNumberSchema = (message?: string): NumberConstraint => {
  const baseSchema = {
    type: "number" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };

  return addNumberConstraints(baseSchema);
};

/**
 * Singleton for the default case (reused for each call without message).
 * 
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 * Constraint methods (min, max, int, etc.) create new objects, so they don't mutate this singleton.
 */
const DEFAULT_NUMBER_SCHEMA = Object.freeze(createNumberSchema());

/**
 * Number schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - number()
 * - number("Custom error")
 * - number().min(5)
 * - number().positive()
 *
 * @param message - Custom error message (optional).
 * @returns NumberConstraint with all constraints.
 * @since 2.0.0
 */
export function number(message?: string): NumberConstraint {
  return message ? createNumberSchema(message) : DEFAULT_NUMBER_SCHEMA;
}
