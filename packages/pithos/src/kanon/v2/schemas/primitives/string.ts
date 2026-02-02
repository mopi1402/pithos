/**
 * String schema implementation
 *
 * This file contains the string schema with optimized performance.
 */

import type {
  BaseSchema,
  StringIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue, _isString } from "@kanon/v2/utils/helpers";

/**
 * String schema
 *
 * @since 2.0.0
 */
export interface StringSchema extends BaseSchema<unknown, string, StringIssue> {
  readonly type: "string";
  readonly expects: "string";
  message?: string | ((issue: any) => string);
}

/**
 * Creates a string schema
 *
 * This function creates a string schema with optimized performance.
 *
 * @since 2.0.0
 */
export function string(
  message?: string | ((issue: any) => string)
): StringSchema {
  return {
    kind: "schema",
    type: "string",
    expects: "string",
    async: false,
    message,
    reference: string,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringIssue> {
      if (dataset.status === "success") {
        return dataset as OutputDataset<string, StringIssue>;
      }

      if (!_isString(dataset.value)) {
        _addIssue(
          {
            kind: "schema",
            type: "string",
            expects: "string",
            message: message || "Invalid type",
          },
          "string",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringIssue>;
      }

      (dataset as any).status = "success";
      return dataset as OutputDataset<string, StringIssue>;
    },
  };
}
