/**
 * Number schema implementation
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
 * Number schema implementation
 *
 * @since 1.1.0
 */
export class PithosNumber implements PithosType<number, number> {
  _output!: number;
  _input!: number;

  private readonly validations: Array<
    | { type: "min"; value: number; message?: string }
    | { type: "max"; value: number; message?: string }
    | { type: "positive"; message?: string }
    | { type: "negative"; message?: string }
    | { type: "int"; message?: string }
  > = [];

  parse(data: unknown): number {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<number> {
    if (typeof data !== "number" || isNaN(data) || !isFinite(data)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected number",
            path: [],
          },
        ]),
      };
    }

    const value = data;

    for (const validation of this.validations) {
      if (validation.type === "min") {
        if (value < validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_small",
                message:
                  validation.message ||
                  `Number must be greater than or equal to ${validation.value}`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "max") {
        if (value > validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_big",
                message:
                  validation.message ||
                  `Number must be less than or equal to ${validation.value}`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "positive") {
        if (value <= 0) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_small",
                message: validation.message || "Number must be positive",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "negative") {
        if (value >= 0) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_big",
                message: validation.message || "Number must be negative",
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "int") {
        if (!Number.isInteger(value)) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_type",
                message: validation.message || "Expected integer",
                path: [],
              },
            ]),
          };
        }
      }
    }

    return { success: true, data: value };
  }

  async parseAsync(data: unknown): Promise<number> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<number>> {
    return this.safeParse(data);
  }

  min(minValue: number, message?: string): this {
    this.validations.push({ type: "min", value: minValue, message });
    return this;
  }

  max(maxValue: number, message?: string): this {
    this.validations.push({ type: "max", value: maxValue, message });
    return this;
  }

  positive(message?: string): this {
    this.validations.push({ type: "positive", message });
    return this;
  }

  negative(message?: string): this {
    this.validations.push({ type: "negative", message });
    return this;
  }

  int(message?: string): this {
    this.validations.push({ type: "int", message });
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
    check: (data: number) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}

/**
 * Integer schema implementation
 *
 * @since 1.1.0
 */
export class PithosInt extends PithosNumber {
  override safeParse(data: unknown): PithosSafeParseResult<number> {
    const result = super.safeParse(data);
    if (!result.success) return result;

    const value = result.data;
    if (!Number.isInteger(value)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected integer",
            path: [],
          },
        ]),
      };
    }

    return result;
  }
}
