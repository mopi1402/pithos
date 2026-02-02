import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { LiteralSchema } from "@kanon/v3/types/primitives";

/**
 * Literal schema - accepts only a specific value.
 *
 * @param value - The literal value to validate against.
 * @param message - Custom error message.
 * @returns Schema that validates only this specific value.
 * @since 3.0.0
 */
export function literal<T extends string | number | boolean>(
  value: T,
  message?: string
): LiteralSchema<T> {
  return {
    type: "literal" as const,
    message,
    refinements: undefined,
    literalValue: value,
    validator: (input: unknown) => {
      if (input === value) {
        return true;
      }

      return message || ERROR_MESSAGES_COMPOSITION.literal(value, typeof input);
    },
  };
}
