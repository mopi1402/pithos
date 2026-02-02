/**
 * Array schema implementation
 *
 * @since 1.1.0
 */

import type {
  PithosType,
  PithosSafeParseResult,
  PithosIssue,
} from "../../types/base";
import { PithosError } from "../../errors";
import { PithosOptional } from "../concepts/wrappers/optional";
import { PithosNullable } from "../concepts/wrappers/nullable";
import { PithosDefault } from "../concepts/wrappers/default";
import { PithosRefined } from "../concepts/wrappers/refined";

/**
 * Array schema implementation
 *
 * @since 1.1.0
 */
export class PithosArray<T extends PithosType>
  implements PithosType<T["_output"][], T["_input"][]>
{
  _output!: T["_output"][];
  _input!: T["_input"][];

  private readonly validations: Array<
    | { type: "min"; value: number; message?: string }
    | { type: "max"; value: number; message?: string }
    | { type: "length"; value: number; message?: string }
  > = [];

  constructor(private readonly itemSchema: T) {}

  parse(data: unknown): T["_output"][] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T["_output"][]> {
    if (!Array.isArray(data)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected array",
            path: [],
          },
        ]),
      };
    }

    const validatedItems: T["_output"][] = [];
    const issues: PithosIssue[] = [];

    for (let i = 0; i < data.length; i++) {
      const itemResult = this.itemSchema.safeParse(data[i]);
      if (itemResult.success) {
        validatedItems.push(itemResult.data);
      } else {
        issues.push(
          ...itemResult.error.issues.map((issue) => ({
            ...issue,
            path: [i, ...issue.path],
          }))
        );
      }
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    // Apply array validations
    for (const validation of this.validations) {
      if (validation.type === "min") {
        if (validatedItems.length < validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_small",
                message:
                  validation.message ||
                  `Array must contain at least ${validation.value} element(s)`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "max") {
        if (validatedItems.length > validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "too_big",
                message:
                  validation.message ||
                  `Array must contain at most ${validation.value} element(s)`,
                path: [],
              },
            ]),
          };
        }
      } else if (validation.type === "length") {
        if (validatedItems.length !== validation.value) {
          return {
            success: false,
            error: new PithosError([
              {
                code: "invalid_string",
                message:
                  validation.message ||
                  `Array must contain exactly ${validation.value} element(s)`,
                path: [],
              },
            ]),
          };
        }
      }
    }

    return { success: true, data: validatedItems };
  }

  async parseAsync(data: unknown): Promise<T["_output"][]> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T["_output"][]>> {
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

  optional(): this {
    return new PithosOptional(this) as any;
  }

  nullable(): this {
    return new PithosNullable(this) as any;
  }

  default(defaultValue: unknown | (() => unknown)): this {
    return new PithosDefault(this, defaultValue) as any;
  }

  refine(
    check: (data: T["_output"][]) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
