/**
 * BigInt schema implementation
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
 * BigInt schema implementation
 *
 * @since 1.1.0
 */
export class PithosBigInt implements PithosType<bigint, bigint> {
  _output!: bigint;
  _input!: bigint;

  parse(data: unknown): bigint {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<bigint> {
    if (typeof data === "bigint") {
      return { success: true, data };
    }

    if (typeof data === "number" && Number.isInteger(data)) {
      return { success: true, data: BigInt(data) };
    }

    if (typeof data === "string") {
      try {
        const bigIntValue = BigInt(data);
        return { success: true, data: bigIntValue };
      } catch {
        // Invalid string for BigInt
      }
    }

    return {
      success: false,
      error: new PithosError([
        {
          code: "invalid_type",
          message: "Expected bigint, number, or string convertible to bigint",
          path: [],
        },
      ]),
    };
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
