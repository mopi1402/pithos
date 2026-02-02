/**
 * Null schema implementation
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
 * Null schema implementation
 *
 * @since 1.1.0
 */
export class PithosNull implements PithosType<null, null> {
  _output!: null;
  _input!: null;

  parse(data: unknown): null {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<null> {
    if (data !== null) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            message: "Expected null",
            path: [],
          },
        ]),
      };
    }
    return { success: true, data: null };
  }

  async parseAsync(data: unknown): Promise<null> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<null>> {
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
    check: (data: null) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
