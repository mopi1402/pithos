import { VoidSchema } from "@kanon/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.void;

  return (value: unknown) => {
    if (value === undefined) return true;
    return errorMsg;
  };
};

/**
 * Factory to create a void schema.
 */
const createVoidSchema = (message?: string): VoidSchema => {
  return {
    type: "void" as const,
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
const DEFAULT_VOID_SCHEMA = Object.freeze(createVoidSchema());

/**
 * Void schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - void_()
 * - void_("Custom error")
 *
 * The `void` type accepts only `undefined` - used for functions with no return value.
 *
 * @param message - Custom error message (optional).
 * @returns VoidSchema
 * @since 3.0.0
 */
export function void_(message?: string): VoidSchema {
  return message ? createVoidSchema(message) : DEFAULT_VOID_SCHEMA;
}
