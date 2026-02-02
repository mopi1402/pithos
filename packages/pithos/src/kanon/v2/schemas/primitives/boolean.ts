/**
 * Boolean schema implementation
 *
 * This file contains the boolean schema with optimized performance.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue, _isBoolean } from "@kanon/v2/utils/helpers";

/**
 * Boolean schema
 *
 * @since 2.0.0
 */
export interface BooleanSchema extends BaseSchema<unknown, boolean, BaseIssue> {
  readonly type: "boolean";
  readonly expects: "boolean";
}

/**
 * Creates a boolean schema
 *
 * This function creates a boolean schema with optimized performance.
 *
 * @since 2.0.0
 */
export function boolean(
  message?: string | ((issue: BaseIssue) => string)
): BooleanSchema {
  return {
    kind: "schema",
    type: "boolean",
    expects: "boolean",
    async: false,
    message,
    reference: boolean,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<boolean, BaseIssue> {
      if (dataset.status === "success") {
        return dataset as OutputDataset<boolean, BaseIssue>;
      }

      if (!_isBoolean(dataset.value)) {
        _addIssue(
          {
            kind: "schema",
            type: "boolean",
            expects: "boolean",
            message: message || "Invalid type",
          },
          "boolean",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<boolean, BaseIssue>;
      }

      (dataset as any).status = "success";
      return dataset as OutputDataset<boolean, BaseIssue>;
    },
  };
}
