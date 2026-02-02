import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addBigIntConstraints } from "@kanon/schemas/constraints/bigint";
import { BigIntConstraint } from "@kanon/types/constraints";

/**
 * Creates the base validator.
 */
const createValidator = (message?: string) => {
  const errorMsg = message || ERROR_MESSAGES_COMPOSITION.bigint;

  return (value: unknown) => {
    if (typeof value === "bigint") return true;
    return errorMsg;
  };
};

/**
 * Factory to create a bigint schema.
 */
const createBigIntSchema = (message?: string): BigIntConstraint => {
  const baseSchema = {
    type: "bigint" as const,
    message,
    refinements: undefined,
    validator: createValidator(message),
  };

  return addBigIntConstraints(baseSchema);
};

/**
 * Singleton for the default case (reused for each call without message).
 * 
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 * Constraint methods (min, max, positive, negative) create new objects, so they don't mutate this singleton.
 */
const DEFAULT_BIGINT_SCHEMA = Object.freeze(createBigIntSchema());

/**
 * BigInt schema with 0 overhead after tsup + Terser build.
 *
 * Usage identical to before:
 * - bigint()
 * - bigint("Custom error")
 * - bigint().min(5n)
 * - bigint().positive()
 *
 * @param message - Custom error message (optional).
 * @returns BigIntSchema with all constraints.
 * @since 3.0.0
 */
export function bigint(message?: string): BigIntConstraint {
  return message ? createBigIntSchema(message) : DEFAULT_BIGINT_SCHEMA;
}
