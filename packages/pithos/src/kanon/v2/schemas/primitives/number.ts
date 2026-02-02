/**
 * Number schema implementation
 *
 * This file contains the number schema with optimized performance.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue, _isNumber } from "@kanon/v2/utils/helpers";

/**
 * Number schema
 *
 * @since 2.0.0
 */
export interface NumberSchema extends BaseSchema<unknown, number, BaseIssue> {
  readonly type: "number";
  readonly expects: "number";
}

/**
 * Creates a number schema
 *
 * This function creates a number schema with optimized performance.
 *
 * @since 2.0.0
 */
export function number(
  message?: string | ((issue: BaseIssue) => string)
): NumberSchema {
  return {
    kind: "schema",
    type: "number",
    expects: "number",
    async: false,
    message,
    reference: number,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<number, BaseIssue> {
      if (dataset.status === "success") {
        return dataset as OutputDataset<number, BaseIssue>;
      }

      if (!_isNumber(dataset.value)) {
        _addIssue(
          {
            kind: "schema",
            type: "number",
            expects: "number",
            message: message || "Invalid type",
          },
          "number",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<number, BaseIssue>;
      }

      (dataset as any).status = "success";
      return dataset as OutputDataset<number, BaseIssue>;
    },
  };
}
