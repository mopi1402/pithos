/**
 * Refine constraint for V2
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

/**
 * Refine issue
 *
 * @since 2.0.0
 */
export interface RefineIssue extends BaseIssue<unknown> {
  readonly kind: "validation";
  readonly type: "refine";
}

/**
 * Refine schema
 *
 * @since 2.0.0
 */
export interface RefineSchema<TOutput>
  extends BaseSchema<unknown, TOutput, RefineIssue> {
  readonly type: "refine";
  readonly wrapped: BaseSchema;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a refine constraint wrapper
 * The check function should return true if valid, or a string error message if invalid
 *
 * @since 2.0.0
 */
export function refine<TOutput>(
  wrapped: BaseSchema<unknown, TOutput, any>,
  check: (value: TOutput) => boolean | string,
  message?: string
): RefineSchema<TOutput> {
  return {
    kind: "schema",
    type: "refine",
    expects: "refined",
    wrapped,
    async: false,
    message,
    reference: refine,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<TOutput, RefineIssue> {
      // First run wrapped schema
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<TOutput, RefineIssue>;
      }

      const value = result.value as TOutput;
      const checkResult = check(value);

      if (checkResult !== true) {
        const errorMessage =
          typeof checkResult === "string" ? checkResult : message || "Validation failed";
        _addIssue(
          {
            kind: "validation",
            type: "refine",
            expects: "refined",
            message: errorMessage,
          },
          "refine",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<TOutput, RefineIssue>;
      }

      return result as OutputDataset<TOutput, RefineIssue>;
    },
  };
}
