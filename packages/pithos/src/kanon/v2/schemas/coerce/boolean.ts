/**
 * Coerce Boolean schema implementation
 *
 * This file contains the coerce boolean schema for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";

/**
 * Coerce boolean issue
 *
 * @since 2.0.0
 */
export interface CoerceBooleanIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "coerce_boolean";
}

/**
 * Coerce boolean schema
 *
 * @since 2.0.0
 */
export interface CoerceBooleanSchema
  extends BaseSchema<unknown, boolean, CoerceBooleanIssue> {
  readonly type: "coerce_boolean";
  readonly expects: "boolean";
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a coerce boolean schema (converts strings/numbers to booleans)
 *
 * @since 2.0.0
 */
export function coerceBoolean(
  message?: string | ((issue: BaseIssue<unknown>) => string)
): CoerceBooleanSchema {
  return {
    kind: "schema",
    type: "coerce_boolean",
    expects: "boolean",
    async: false,
    message,
    reference: coerceBoolean,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<boolean, CoerceBooleanIssue> {
      const value = dataset.value;
      let coercedValue: boolean;

      if (typeof value === "string") {
        // "true" -> true, "false" -> false, other strings -> truthy
        coercedValue = value === "true" ? true : value === "false" ? false : Boolean(value);
      } else if (typeof value === "number") {
        coercedValue = value !== 0;
      } else if (value === null || value === undefined) {
        coercedValue = false;
      } else {
        coercedValue = Boolean(value);
      }

      (dataset as any).status = "success";
      (dataset as any).value = coercedValue;
      return dataset as OutputDataset<boolean, CoerceBooleanIssue>;
    },
  };
}
