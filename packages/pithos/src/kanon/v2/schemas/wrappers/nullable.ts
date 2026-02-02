/**
 * Nullable schema wrapper
 *
 * This file contains the nullable wrapper for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";

/**
 * Nullable schema - allows null values
 *
 * @since 2.0.0
 */
export interface NullableSchema<
  TWrapped extends BaseSchema,
  TOutput = TWrapped extends BaseSchema<any, infer O> ? O | null : never
> extends BaseSchema<unknown, TOutput, BaseIssue<unknown>> {
  readonly type: "nullable";
  readonly expects: string;
  readonly wrapped: TWrapped;
}

/**
 * Creates a nullable schema (allows null)
 *
 * @since 2.0.0
 */
export function nullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): NullableSchema<TWrapped> {
  return {
    kind: "schema",
    type: "nullable",
    expects: `${wrapped.expects} | null`,
    wrapped,
    async: false,
    message,
    reference: nullable,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<any, BaseIssue<unknown>> {
      // If value is null, accept it
      if (dataset.value === null) {
        (dataset as any).status = "success";
        return dataset as OutputDataset<any, BaseIssue<unknown>>;
      }

      // Otherwise, delegate to wrapped schema
      return wrapped["~run"](dataset, config);
    },
  };
}
