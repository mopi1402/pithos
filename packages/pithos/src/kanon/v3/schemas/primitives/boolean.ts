import { BooleanSchema } from "@kanon/v3/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.boolean;

  return (value: unknown) => {
    if (typeof value === "boolean") return true;
    return errorMsg;
  };
};

/**
 * Factory to create a boolean schema.
 */
const createBooleanSchema = (message?: string): BooleanSchema => {
  return {
    type: "boolean" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };
};

/**
 * Singleton for the default case (reused for each call without message).
 * 
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_BOOLEAN_SCHEMA = Object.freeze(createBooleanSchema());

/**
 * Boolean schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - boolean()
 * - boolean("Custom error")
 *
 * @param message - Custom error message (optional).
 * @returns BooleanSchema
 * @since 3.0.0
 */
export function boolean(message?: string): BooleanSchema {
  return message ? createBooleanSchema(message) : DEFAULT_BOOLEAN_SCHEMA;
}
