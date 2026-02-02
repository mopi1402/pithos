/**
 * Enum schema implementation for V2
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

/**
 * Enum issue
 *
 * @since 2.0.0
 */
export interface EnumIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "enum";
}

/**
 * Enum schema
 *
 * @since 2.0.0
 */
export interface EnumSchema<T extends readonly string[]>
  extends BaseSchema<unknown, T[number], EnumIssue> {
  readonly type: "enum";
  readonly options: T;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates an enum schema
 *
 * @since 2.0.0
 */
export function enum_<T extends readonly string[]>(
  options: T,
  message?: string
): EnumSchema<T> {
  // Pre-create Set for O(1) lookup
  const optionSet = new Set(options);
  const expects = options.join(" | ");

  return {
    kind: "schema",
    type: "enum",
    expects,
    options,
    async: false,
    message,
    reference: enum_,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<T[number], EnumIssue> {
      if (dataset.status === "success") {
        return dataset as OutputDataset<T[number], EnumIssue>;
      }

      const value = dataset.value;
      if (typeof value !== "string" || !optionSet.has(value)) {
        _addIssue(
          {
            kind: "schema",
            type: "enum",
            expects,
            message: message || `Expected one of: ${expects}`,
          },
          "enum",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<T[number], EnumIssue>;
      }

      (dataset as any).status = "success";
      return dataset as OutputDataset<T[number], EnumIssue>;
    },
  };
}
