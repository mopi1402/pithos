/**
 * String schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../types/base";
import { PithosError } from "../../errors";

import { PithosOptional } from "../concepts/wrappers/optional";
import { PithosNullable } from "../concepts/wrappers/nullable";
import { PithosDefault } from "../concepts/wrappers/default";
import { PithosRefined } from "../concepts/wrappers/refined";

/**
 * String schema implementation
 *
 * @since 1.1.0
 */
export class PithosString implements PithosType<string, string> {
  _output!: string;
  _input!: string;

  private readonly validations: Array<
    | { type: "toLowerCase"; message?: string }
    | { type: "toUpperCase"; message?: string }
    | { type: "trim"; message?: string }
    | { type: "min"; value: number; message?: string }
    | { type: "max"; value: number; message?: string }
    | { type: "length"; value: number; message?: string }
    | { type: "email"; message?: string }
    | { type: "url"; message?: string }
    | { type: "uuid"; message?: string }
    | { type: "regex"; value: RegExp; message?: string }
    | { type: "nonempty"; message?: string }
  > = [];

  parse(data: unknown): string {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<string> {
    if (typeof data !== "string") {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected string",
            path: [],
          },
        ]),
      };
    }

    let value = data;

    // Apply transformations first
    for (const validation of this.validations) {
      if (validation.type === "toLowerCase") {
        value = value.toLowerCase();
      } else if (validation.type === "toUpperCase") {
        value = value.toUpperCase();
      } else if (validation.type === "trim") {
        value = value.trim();
      }
    }

    // Apply validations
    for (const validation of this.validations) {
      if (validation.type === "min") {
        if (value.length < validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_small",
                message:
                  validation.message ||
                  `String must contain at least ${validation.value} character(s)`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "max") {
        if (value.length > validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_big",
                message:
                  validation.message ||
                  `String must contain at most ${validation.value} character(s)`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "length") {
        if (value.length !== validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_string",
                message:
                  validation.message ||
                  `String must contain exactly ${validation.value} character(s)`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "email") {
        // Regex email
        const emailRegex =
          /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

        if (!emailRegex.test(value)) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_format",
                message: validation.message || "Invalid email",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "url") {
        try {
          new URL(value);
        } catch {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_format",
                message: validation.message || "Invalid URL",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "uuid") {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_format",
                message: validation.message || "Invalid UUID",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "regex") {
        if (!validation.value.test(value)) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_string",
                message: validation.message || "Invalid format",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "nonempty") {
        if (value.length === 0) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_small",
                message:
                  validation.message ||
                  "String must contain at least 1 character(s)",
                path: [],
              },
            ]),
          };
        }
      }
    }

    return { success: true, data: value };
  }

  async parseAsync(data: unknown): Promise<string> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<string>> {
    return this.safeParse(data);
  }

  min(minLength: number, message?: string): this {
    this.validations.push({ type: "min", value: minLength, message });
    return this;
  }

  max(maxLength: number, message?: string): this {
    this.validations.push({ type: "max", value: maxLength, message });
    return this;
  }

  length(length: number, message?: string): this {
    this.validations.push({ type: "length", value: length, message });
    return this;
  }

  email(message?: string): this {
    this.validations.push({ type: "email", message });
    return this;
  }

  url(message?: string): this {
    this.validations.push({ type: "url", message });
    return this;
  }

  uuid(message?: string): this {
    this.validations.push({ type: "uuid", message });
    return this;
  }

  regex(regex: RegExp, message?: string): this {
    this.validations.push({ type: "regex", value: regex, message });
    return this;
  }

  nonempty(message?: string): this {
    this.validations.push({ type: "nonempty", message });
    return this;
  }

  toLowerCase(): this {
    this.validations.push({ type: "toLowerCase" });
    return this;
  }

  toUpperCase(): this {
    this.validations.push({ type: "toUpperCase" });
    return this;
  }

  trim(): this {
    this.validations.push({ type: "trim" });
    return this;
  }

  optional(): this {
    const optionalSchema = new PithosOptional(this) as any;
    optionalSchema.optional = true;
    return optionalSchema;
  }

  nullable(): this {
    return new PithosNullable(this) as any;
  }

  default(defaultValue: unknown | (() => unknown)): this {
    return new PithosDefault(this, defaultValue) as any;
  }

  refine(
    check: (data: string) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
