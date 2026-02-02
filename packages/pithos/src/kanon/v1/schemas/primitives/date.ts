/**
 * Date schema implementation
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
 * Date schema implementation
 *
 * @since 1.1.0
 */
export class PithosDate implements PithosType<Date, Date> {
  _output!: Date;
  _input!: Date;

  parse(data: unknown): Date {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<Date> {
    if (!(data instanceof Date)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected date",
            path: [],
          },
        ]),
      };
    }

    // Vérifier si la date est valide
    if (isNaN(data.getTime())) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected valid date",
            path: [],
          },
        ]),
      };
    }

    // Vérifier les limites de date
    const time = data.getTime();
    if (time > Number.MAX_SAFE_INTEGER || time < Number.MIN_SAFE_INTEGER) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected valid date",
            path: [],
          },
        ]),
      };
    }

    return { success: true, data };
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
