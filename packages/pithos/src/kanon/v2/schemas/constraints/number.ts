/**
 * Number constraints for V2
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

/**
 * Number constraint issue
 *
 * @since 2.0.0
 */
export interface NumberConstraintIssue extends BaseIssue<number> {
  readonly kind: "validation";
  readonly type: "number_constraint";
}

/**
 * Number with constraints schema
 *
 * @since 2.0.0
 */
export interface NumberConstraintSchema
  extends BaseSchema<unknown, number, NumberConstraintIssue> {
  readonly type: "number_constraint";
  readonly wrapped: BaseSchema;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a min constraint wrapper
 *
 * @since 2.0.0
 */
export function min(
  wrapped: BaseSchema,
  minValue: number,
  message?: string
): NumberConstraintSchema {
  return {
    kind: "schema",
    type: "number_constraint",
    expects: `number (min ${minValue})`,
    wrapped,
    async: false,
    message,
    reference: min,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<number, NumberConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<number, NumberConstraintIssue>;
      }

      const value = result.value as number;
      if (value < minValue) {
        _addIssue(
          {
            kind: "validation",
            type: "number_constraint",
            expects: `min ${minValue}`,
            message: message || `Number must be at least ${minValue}`,
          },
          "number_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<number, NumberConstraintIssue>;
      }

      return result as OutputDataset<number, NumberConstraintIssue>;
    },
  };
}

/**
 * Creates a max constraint wrapper
 *
 * @since 2.0.0
 */
export function max(
  wrapped: BaseSchema,
  maxValue: number,
  message?: string
): NumberConstraintSchema {
  return {
    kind: "schema",
    type: "number_constraint",
    expects: `number (max ${maxValue})`,
    wrapped,
    async: false,
    message,
    reference: max,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<number, NumberConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<number, NumberConstraintIssue>;
      }

      const value = result.value as number;
      if (value > maxValue) {
        _addIssue(
          {
            kind: "validation",
            type: "number_constraint",
            expects: `max ${maxValue}`,
            message: message || `Number must be at most ${maxValue}`,
          },
          "number_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<number, NumberConstraintIssue>;
      }

      return result as OutputDataset<number, NumberConstraintIssue>;
    },
  };
}
