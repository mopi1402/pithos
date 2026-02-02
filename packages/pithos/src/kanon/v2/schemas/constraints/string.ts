/**
 * String constraints for V2
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue } from "@kanon/v2/utils/helpers";

// Cached regex patterns
const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

const URL_REGEX =
  /^https?:\/\/(?:[a-zA-Z0-9._~-]+(?::[a-zA-Z0-9._~-]*)?@)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*|(?:\d{1,3}\.){3}\d{1,3})(?::[0-9]{1,5})?(?:\/[^\s?#]*)?(?:\?[^\s?#]+)?(?:#[^\s#]+)?$/;

/**
 * Constraint issue
 *
 * @since 2.0.0
 */
export interface StringConstraintIssue extends BaseIssue<string> {
  readonly kind: "validation";
  readonly type: "string_constraint";
}

/**
 * String with constraints schema
 *
 * @since 2.0.0
 */
export interface StringConstraintSchema
  extends BaseSchema<unknown, string, StringConstraintIssue> {
  readonly type: "string_constraint";
  readonly wrapped: BaseSchema;
  readonly message?: string | ((issue: BaseIssue<unknown>) => string);
}

/**
 * Creates a minLength constraint wrapper
 *
 * @since 2.0.0
 */
export function minLength(
  wrapped: BaseSchema,
  min: number,
  message?: string
): StringConstraintSchema {
  return {
    kind: "schema",
    type: "string_constraint",
    expects: `string (min ${min})`,
    wrapped,
    async: false,
    message,
    reference: minLength,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringConstraintIssue> {
      // First run wrapped schema
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<string, StringConstraintIssue>;
      }

      const value = result.value as string;
      if (value.length < min) {
        _addIssue(
          {
            kind: "validation",
            type: "string_constraint",
            expects: `min ${min} characters`,
            message: message || `String must have at least ${min} characters`,
          },
          "string_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringConstraintIssue>;
      }

      return result as OutputDataset<string, StringConstraintIssue>;
    },
  };
}

/**
 * Creates a maxLength constraint wrapper
 *
 * @since 2.0.0
 */
export function maxLength(
  wrapped: BaseSchema,
  max: number,
  message?: string
): StringConstraintSchema {
  return {
    kind: "schema",
    type: "string_constraint",
    expects: `string (max ${max})`,
    wrapped,
    async: false,
    message,
    reference: maxLength,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<string, StringConstraintIssue>;
      }

      const value = result.value as string;
      if (value.length > max) {
        _addIssue(
          {
            kind: "validation",
            type: "string_constraint",
            expects: `max ${max} characters`,
            message: message || `String must have at most ${max} characters`,
          },
          "string_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringConstraintIssue>;
      }

      return result as OutputDataset<string, StringConstraintIssue>;
    },
  };
}

/**
 * Creates an email constraint wrapper
 *
 * @since 2.0.0
 */
export function email(
  wrapped: BaseSchema,
  message?: string
): StringConstraintSchema {
  return {
    kind: "schema",
    type: "string_constraint",
    expects: "email",
    wrapped,
    async: false,
    message,
    reference: email,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<string, StringConstraintIssue>;
      }

      const value = result.value as string;
      if (!EMAIL_REGEX.test(value)) {
        _addIssue(
          {
            kind: "validation",
            type: "string_constraint",
            expects: "email",
            message: message || "Invalid email",
          },
          "string_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringConstraintIssue>;
      }

      return result as OutputDataset<string, StringConstraintIssue>;
    },
  };
}

/**
 * Creates a URL constraint wrapper
 *
 * @since 2.0.0
 */
export function url(
  wrapped: BaseSchema,
  message?: string
): StringConstraintSchema {
  return {
    kind: "schema",
    type: "string_constraint",
    expects: "url",
    wrapped,
    async: false,
    message,
    reference: url,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<string, StringConstraintIssue>;
      }

      const value = result.value as string;
      if (!URL_REGEX.test(value)) {
        _addIssue(
          {
            kind: "validation",
            type: "string_constraint",
            expects: "url",
            message: message || "Invalid URL",
          },
          "string_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringConstraintIssue>;
      }

      return result as OutputDataset<string, StringConstraintIssue>;
    },
  };
}

/**
 * Creates a pattern constraint wrapper
 *
 * @since 2.0.0
 */
export function pattern(
  wrapped: BaseSchema,
  regex: RegExp,
  message?: string
): StringConstraintSchema {
  return {
    kind: "schema",
    type: "string_constraint",
    expects: `pattern ${regex}`,
    wrapped,
    async: false,
    message,
    reference: pattern,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<string, StringConstraintIssue> {
      const result = wrapped["~run"](dataset, config);
      if (result.status !== "success") {
        return result as OutputDataset<string, StringConstraintIssue>;
      }

      const value = result.value as string;
      if (!regex.test(value)) {
        _addIssue(
          {
            kind: "validation",
            type: "string_constraint",
            expects: `pattern ${regex}`,
            message: message || "Invalid format",
          },
          "string_constraint",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<string, StringConstraintIssue>;
      }

      return result as OutputDataset<string, StringConstraintIssue>;
    },
  };
}
