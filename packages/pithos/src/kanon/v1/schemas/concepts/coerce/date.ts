/**
 * Coerce Date schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosError } from "../../../errors";
import { PithosOptional } from "../wrappers/optional";
import { PithosNullable } from "../wrappers/nullable";
import { PithosDefault } from "../wrappers/default";
import { PithosRefined } from "../wrappers/refined";

/**
 * Coerce Date schema implementation
 *
 * @since 1.1.0
 */
export class PithosCoerceDate implements PithosType<Date, unknown> {
  _output!: Date;
  _input!: unknown;

  parse(data: unknown): Date {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<Date> {
    try {
      // Coercition vers date
      let coercedValue: Date;

      if (typeof data === "number") {
        coercedValue = new Date(data);
      } else if (typeof data === "string") {
        coercedValue = new Date(data);
      } else {
        coercedValue = new Date(data as any);
      }

      if (isNaN(coercedValue.getTime())) {
        throw new Error("Invalid date");
      }

      return { success: true, data: coercedValue };
    } catch {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Cannot coerce to date",
            path: [],
          },
        ]),
      };
    }
  }

  async parseAsync(data: unknown): Promise<Date> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<Date>> {
    return this.safeParse(data);
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
    check: (data: Date) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
