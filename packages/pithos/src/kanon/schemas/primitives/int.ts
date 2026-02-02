import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { IntSchema } from "@kanon/types/primitives";

const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.int;

  return (value: unknown) => {
    // Stryker disable next-line ConditionalExpression: typeof check is perf optimization - Number.isInteger handles non-numbers
    if (typeof value === "number" && Number.isInteger(value)) return true;
    return errorMsg;
  };
};

const createIntSchema = (message?: string): IntSchema => {
  return {
    type: "int" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };
};

/**
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_INT_SCHEMA = Object.freeze(createIntSchema());

/**
 * Integer schema - validates integer numbers.
 *
 * @param message - Custom error message (optional).
 * @returns IntSchema
 * @since 3.0.0
 */
export function int(message?: string): IntSchema {
  return message ? createIntSchema(message) : DEFAULT_INT_SCHEMA;
}
