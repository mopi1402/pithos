/**
 * Union schema implementation
 *
 * This file contains the union schema for V2.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";

/**
 * Union issue
 *
 * @since 2.0.0
 */
export interface UnionIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "union";
}

/**
 * Union schema
 *
 * @since 2.0.0
 */
export interface UnionSchema<
  TOptions extends BaseSchema[],
  TOutput = TOptions[number] extends BaseSchema<any, infer O> ? O : never
> extends BaseSchema<unknown, TOutput, UnionIssue> {
  readonly type: "union";
  readonly expects: string;
  readonly options: TOptions;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a union schema (tries each option until one succeeds)
 *
 * @since 2.0.0
 */
export function union<TOptions extends BaseSchema[]>(
  options: TOptions,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): UnionSchema<TOptions> {
  return {
    kind: "schema",
    type: "union",
    expects: options.map((o) => o.expects).join(" | "),
    options,
    async: false,
    message,
    reference: union,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<any, UnionIssue> {
      const value = dataset.value;

      // Try each option until one succeeds
      for (const option of options) {
        const optionDataset = {
          value,
          status: "unknown" as const,
          issues: undefined,
        };

        const result = option["~run"](optionDataset, config);

        if (result.status === "success") {
          (dataset as any).status = "success";
          (dataset as any).value = result.value;
          return dataset as OutputDataset<any, UnionIssue>;
        }
      }

      // No option matched
      const issue: UnionIssue = {
        kind: "schema",
        type: "union",
        input: value,
        expected: options.map((o) => o.expects).join(" | "),
        received: typeof value,
        message:
          typeof message === "function"
            ? message({
                kind: "schema",
                type: "union",
                input: value,
                message: "Invalid union",
              })
            : message || "Invalid union",
      };

      if (dataset.issues) {
        dataset.issues.push(issue);
      } else {
        (dataset as any).issues = [issue];
      }
      (dataset as any).status = "failure";
      return dataset as OutputDataset<any, UnionIssue>;
    },
  };
}
