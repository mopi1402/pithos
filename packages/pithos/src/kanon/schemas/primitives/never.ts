import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { NeverSchema } from "@kanon/types/primitives";

/**
 * INTENTIONAL: Object.freeze() protects the singleton from direct mutations.
 */
const DEFAULT_NEVER_SCHEMA: NeverSchema = Object.freeze({
  type: "never" as const,
  message: undefined,
  refinements: undefined,
  validator: () => ERROR_MESSAGES_COMPOSITION.never,
});

/**
 * Never schema - always rejects any value.
 *
 * Useful for impossible branches or dead code.
 *
 * @param message - Custom error message.
 * @returns NeverSchema that rejects any value
 * @since 3.0.0
 */
export function never(message?: string): NeverSchema {
  if (!message) {
    return DEFAULT_NEVER_SCHEMA;
  }

  return {
    type: "never" as const,
    message,
    refinements: undefined,
    validator: () => message,
  };
}
