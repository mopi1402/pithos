import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { addStringConstraints } from "@kanon/v3/schemas/constraints/string";
import { StringConstraint } from "@kanon/v3/types/constraints";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.string;

  return (value: unknown) => {
    if (typeof value === "string") return true;
    return errorMsg;
  };
};

/**
 * Factory to create a string schema.
 */
const createStringSchema = (message?: string): StringConstraint => {
  const baseSchema = {
    type: "string" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };

  return addStringConstraints(baseSchema);
};

/**
 * Singleton for the default case (reused for each call without message).
 * 
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 * Constraint methods (minLength, email, etc.) create new objects, so they don't mutate this singleton.
 */
const DEFAULT_STRING_SCHEMA = Object.freeze(createStringSchema());

/**
 * String schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - string()
 * - string("Custom error")
 * - string().minLength(5)
 * - string().email()
 *
 * @param message - Custom error message (optional).
 * @returns StringConstraint with all constraints.
 * @since 3.0.0
 */
export function string(message?: string): StringConstraint {
  return message ? createStringSchema(message) : DEFAULT_STRING_SCHEMA;
}
