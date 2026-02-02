/**
 * Coerce Number schema implementation
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
 * Coerce Number schema implementation
 *
 * @since 1.1.0
 */
export class PithosCoerceNumber implements PithosType<number, unknown> {
  _output!: number;
  _input!: unknown;

  parse(data: unknown): number {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<number> {
    // Coercition vers number
    let coercedValue: number;

    if (typeof data === "boolean") {
      coercedValue = data ? 1 : 0;
    } else if (data === "") {
      coercedValue = 0;
    } else {
      coercedValue = Number(data);
    }

    if (isNaN(coercedValue)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Cannot coerce to number",
            path: [],
          },
        ]),
      };
    }
    return { success: true, data: coercedValue };
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
    check: (data: number) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
