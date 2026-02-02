import { StringConstraint } from "@kanon/v3/types/constraints";
import { refineString } from "@kanon/v3/schemas/constraints/refine/string";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { StringSchema } from "@kanon/v3/types/primitives";
import {
  EMAIL_REGEX,
  URL_REGEX,
  UUID_REGEX,
} from "@kanon/v3/core/consts/patterns";

/**
 * Adds string constraints to a base schema.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export function addStringConstraints(
  baseSchema: StringSchema
): StringConstraint {
  return {
  ...baseSchema,

  minLength: (min: number, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.length >= min ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.minLength(min)
      )
    ),

  maxLength: (max: number, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.length <= max ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.maxLength(max)
      )
    ),

  length: (length: number, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.length === length ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.length(length)
      )
    ),

  email: (errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          EMAIL_REGEX.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.email
      )
    ),

  url: (errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          URL_REGEX.test(value) || errorMessage || ERROR_MESSAGES_COMPOSITION.url
      )
    ),

  uuid: (errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          UUID_REGEX.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.uuid
      )
    ),

  pattern: (regex: RegExp, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          regex.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.pattern(regex)
      )
    ),

  includes: (substring: string, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.includes(substring) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.includes(substring)
      )
    ),

  startsWith: (prefix: string, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.startsWith(prefix) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.startsWith(prefix)
      )
    ),

  endsWith: (suffix: string, errorMessage?: string) =>
    /*@__INLINE__*/ addStringConstraints(
      refineString(
        baseSchema,
        (value: string) =>
          value.endsWith(suffix) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.endsWith(suffix)
      )
    ),
  };
}
