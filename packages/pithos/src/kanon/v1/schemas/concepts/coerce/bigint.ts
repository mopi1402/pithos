/**
 * Coerce BigInt schema implementation
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
 * Coerce BigInt schema implementation
 *
 * @since 1.1.0
 */
export class PithosCoerceBigInt implements PithosType<bigint, unknown> {
  _output!: bigint;
  _input!: unknown;

  parse(data: unknown): bigint {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<bigint> {
    try {
      // Coercition vers bigint
      let coercedValue: bigint;

      if (typeof data === "number") {
        coercedValue = BigInt(data);
      } else if (typeof data === "string") {
        coercedValue = BigInt(data);
      } else {
        coercedValue = BigInt(data as any);
      }

      return { success: true, data: coercedValue };
    } catch {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Cannot coerce to bigint",
            path: [],
          },
        ]),
      };
    }
  }

  async parseAsync(data: unknown): Promise<bigint> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<bigint>> {
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
    check: (data: bigint) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
