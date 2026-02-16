import { UndefinedSchema } from "@kanon/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.undefined;

  return (value: unknown) => {
    if (value === undefined) return true;
    return errorMsg;
  };
};

/**
 * Factory to create an undefined schema.
 */
const createUndefinedSchema = (message?: string): UndefinedSchema => {
  return {
    type: "undefined" as const,
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
const DEFAULT_UNDEFINED_SCHEMA = Object.freeze(createUndefinedSchema());

/**
 * Undefined schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - undefined_()
 * - undefined_("Custom error")
 *
 * @param message - Custom error message (optional).
 * @returns UndefinedSchema
 * @since 2.0.0
 */
export function undefined_(message?: string): UndefinedSchema {
  return message ? createUndefinedSchema(message) : DEFAULT_UNDEFINED_SCHEMA;
}
