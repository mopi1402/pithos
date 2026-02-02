/**
 * Coerce Number schema implementation
 *
 * This file contains the coerce number schema for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

/**
 * Coerce number issue
 *
 * @since 2.0.0
 */
export interface CoerceNumberIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "coerce_number";
}

/**
 * Coerce number schema
 *
 * @since 2.0.0
 */
export interface CoerceNumberSchema
  extends BaseSchema<unknown, number, CoerceNumberIssue> {
  readonly type: "coerce_number";
  readonly expects: "number";
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a coerce number schema (converts strings to numbers)
 *
 * @since 2.0.0
 */
export function coerceNumber(
  message?: string | ((issue: BaseIssue<unknown>) => string)
): CoerceNumberSchema {
  return {
    kind: "schema",
    type: "coerce_number",
    expects: "number",
    async: false,
    message,
    reference: coerceNumber,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<number, CoerceNumberIssue> {
      let coercedValue: number;
      const value = dataset.value;

      if (typeof value === "boolean") {
        coercedValue = value ? 1 : 0;
      } else if (value === "") {
        coercedValue = 0;
      } else {
        coercedValue = Number(value);
      }

      if (isNaN(coercedValue)) {
        _addIssue(
          {
            kind: "schema",
            type: "coerce_number",
            expects: "number",
            message: message || "Cannot coerce to number",
          },
          "coerce_number",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<number, CoerceNumberIssue>;
      }

      (dataset as any).status = "success";
      (dataset as any).value = coercedValue;
      return dataset as OutputDataset<number, CoerceNumberIssue>;
    },
  };
}
