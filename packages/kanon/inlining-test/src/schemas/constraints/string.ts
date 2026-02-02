// /schemas/constraints/string.ts
import { StringSchema } from "../primitives/string.js";
import {
  EMAIL_REGEX,
  URL_REGEX,
  UUID_REGEX,
} from "../../core/consts/patterns.js";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages.js";

export function refineString(
  baseSchema: StringSchema,
  validator: (value: string) => true | string
): StringSchema {
  return {
    type: "string",
    validator: (value: unknown) => {
      const baseResult = baseSchema.validator(value);
      if (baseResult !== true) {
        return baseResult;
      }
      return validator(value as string);
    },
  };
}

export function addStringConstraints(baseSchema: StringSchema) {
  return {
    email: (errorMessage?: string) =>
      refineString(
        baseSchema,
        (value: string) =>
          EMAIL_REGEX.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.email
      ),

    url: (errorMessage?: string) =>
      refineString(
        baseSchema,
        (value: string) =>
          URL_REGEX.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.url
      ),

    uuid: (errorMessage?: string) =>
      refineString(
        baseSchema,
        (value: string) =>
          UUID_REGEX.test(value) ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.uuid
      ),

    minLength: (min: number, errorMessage?: string) =>
      refineString(
        baseSchema,
        (value: string) =>
          value.length >= min ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.minLength(min)
      ),

    maxLength: (max: number, errorMessage?: string) =>
      refineString(
        baseSchema,
        (value: string) =>
          value.length <= max ||
          errorMessage ||
          ERROR_MESSAGES_COMPOSITION.maxLength(max)
      ),
  };
}




