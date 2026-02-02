import { BigIntConstraint } from "@kanon/v3/types/constraints";
import { CoercedResult } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { addBigIntConstraints } from "@kanon/v3/schemas/constraints/bigint";

/**
 * Coerce BigInt schema - converts values to bigint with constraints.
 *
 * Handles conversion from number, string, boolean, and other types to BigInt.
 * Returns the coerced value directly for optimal performance.
 *
 * @param message - Custom error message
 * @returns Schema that converts to bigint with chainable constraints.
 * @since 3.0.0
 *
 * @example
 * ```ts
 * // Basic coercion
 * coerceBigInt()
 *
 * // With constraints
 * coerceBigInt().min(0n).max(100n)
 * coerceBigInt().positive()
 * ```
 */
export function coerceBigInt(message?: string): BigIntConstraint {
  const baseSchema = {
    type: "bigint" as const,
    message,
    refinements: undefined,
    validator: (value: unknown): true | string | CoercedResult<bigint> => {
      if (typeof value === "bigint") return true;
      if (value === null) return message || ERROR_MESSAGES_COMPOSITION.coerceNullToBigInt;
      if (value === undefined) return message || ERROR_MESSAGES_COMPOSITION.coerceUndefinedToBigInt;
      try {
        return { coerced: BigInt(value as string | number | boolean) };
      } catch {
        return message || ERROR_MESSAGES_COMPOSITION.coerceBigInt;
      }
    },
  };

  return addBigIntConstraints(baseSchema);
}
