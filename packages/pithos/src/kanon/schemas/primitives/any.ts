import { AnySchema } from "@kanon/types/primitives";

/**
 * Factory to create an any schema.
 */
const createAnySchema = (message?: string): AnySchema => {
  return {
    type: "any" as const,
    message,
    refinements: undefined,
    validator: () => true,
  };
};

/**
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_ANY_SCHEMA: AnySchema = Object.freeze(createAnySchema());

/**
 * Any schema - accepts any value.
 *
 * The `any` type accepts any value without validation.
 * A custom message can be provided for API consistency and introspection,
 * but it will never be used by the validator since `any` always accepts all values.
 *
 * @param message - Custom message (stored for API consistency and introspection,
 *                  but never used by the validator since `any` always accepts all values)
 * @returns AnySchema that accepts any value
 * @since 2.0.0
 */
export function any(message?: string): AnySchema {
  return message ? createAnySchema(message) : DEFAULT_ANY_SCHEMA;
}
