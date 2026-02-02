import { NullSchema } from "@kanon/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.null;

  return (value: unknown) => {
    if (value === null) return true;
    return errorMsg;
  };
};

/**
 * Factory to create a null schema.
 */
const createNullSchema = (message?: string): NullSchema => {
  return {
    type: "null" as const,
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
const DEFAULT_NULL_SCHEMA = Object.freeze(createNullSchema());

/**
 * Null schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - null_()
 * - null_("Custom error")
 *
 * @param message - Custom error message (optional).
 * @returns NullSchema
 * @since 3.0.0
 */
export function null_(message?: string): NullSchema {
  return message ? createNullSchema(message) : DEFAULT_NULL_SCHEMA;
}
