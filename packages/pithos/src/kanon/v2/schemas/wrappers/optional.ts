/**
 * Optional schema wrapper
 *
 * This file contains the optional wrapper for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";

/**
 * Optional schema - allows undefined values
 *
 * @since 2.0.0
 */
export interface OptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = TWrapped extends BaseSchema<any, infer O> ? O | undefined : never
> extends BaseSchema<unknown, TOutput, BaseIssue<unknown>> {
  readonly type: "optional";
  readonly expects: string;
  readonly wrapped: TWrapped;
}

/**
 * Creates an optional schema (allows undefined)
 *
 * @since 2.0.0
 */
export function optional<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): OptionalSchema<TWrapped> {
  return {
    kind: "schema",
    type: "optional",
    expects: `${wrapped.expects} | undefined`,
    wrapped,
    async: false,
    message,
    reference: optional,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<any, BaseIssue<unknown>> {
      // If value is undefined, accept it
      if (dataset.value === undefined) {
        (dataset as any).status = "success";
        return dataset as OutputDataset<any, BaseIssue<unknown>>;
      }

      // Otherwise, delegate to wrapped schema
      return wrapped["~run"](dataset, config);
    },
  };
}
