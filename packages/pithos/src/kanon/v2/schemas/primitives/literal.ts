/**
 * Literal schema implementation
 *
 * This file contains the literal schema for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

/**
 * Literal issue
 *
 * @since 2.0.0
 */
export interface LiteralIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "literal";
}

/**
 * Literal schema
 *
 * @since 2.0.0
 */
export interface LiteralSchema<T extends string | number | boolean | null>
  extends BaseSchema<unknown, T, LiteralIssue> {
  readonly type: "literal";
  readonly expects: string;
  readonly literal: T;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a literal schema
 *
 * @since 2.0.0
 */
export function literal<T extends string | number | boolean | null>(
  value: T,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): LiteralSchema<T> {
  return {
    kind: "schema",
    type: "literal",
    expects: JSON.stringify(value),
    literal: value,
    async: false,
    message,
    reference: literal,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<T, LiteralIssue> {
      if (dataset.value !== value) {
        _addIssue(
          {
            kind: "schema",
            type: "literal",
            expects: JSON.stringify(value),
            message: message || `Expected ${JSON.stringify(value)}`,
          },
          "literal",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<T, LiteralIssue>;
      }

      (dataset as any).status = "success";
      return dataset as OutputDataset<T, LiteralIssue>;
    },
  };
}
