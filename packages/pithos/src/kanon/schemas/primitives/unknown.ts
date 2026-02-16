import { UnknownSchema } from "@kanon/types/primitives";

/**
 * Factory to create an unknown schema.
 */
const createUnknownSchema = (message?: string): UnknownSchema => {
  return {
    type: "unknown" as const,
    message,
    refinements: undefined,
    validator: () => true,
  };
};

/**
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_UNKNOWN_SCHEMA = Object.freeze(createUnknownSchema());

/**
 * Unknown schema - accepts any value (type-safe variant of any).
 *
 * The `unknown` type accepts any value without validation.
 * A custom message can be provided for API consistency and introspection,
 * but it will never be used by the validator since `unknown` always accepts all values.
 *
 * @param message - Custom message (stored for API consistency and introspection,
 *                  but never used by the validator since `unknown` always accepts all values)
 * @returns UnknownSchema that accepts any value
 * @since 2.0.0
 */
export function unknown(message?: string): UnknownSchema {
  return message ? createUnknownSchema(message) : DEFAULT_UNKNOWN_SCHEMA;
}