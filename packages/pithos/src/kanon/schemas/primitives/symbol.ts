import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { SymbolSchema } from "@kanon/types/primitives";

const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.symbol;

  return (value: unknown) => {
    if (typeof value === "symbol") return true;
    return errorMsg;
  };
};

const createSymbolSchema = (message?: string): SymbolSchema => {
  return {
    type: "symbol" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };
};

/**
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_SYMBOL_SCHEMA = Object.freeze(createSymbolSchema());

/**
 * Symbol schema - validates symbol values.
 *
 * @param message - Custom error message (optional).
 * @returns SymbolSchema
 * @since 2.0.0
 */
export function symbol(message?: string): SymbolSchema {
  return message ? createSymbolSchema(message) : DEFAULT_SYMBOL_SCHEMA;
}
