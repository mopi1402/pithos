/**
 * Coerce Boolean schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosOptional } from "../wrappers/optional";
import { PithosNullable } from "../wrappers/nullable";
import { PithosDefault } from "../wrappers/default";
import { PithosRefined } from "../wrappers/refined";

/**
 * Coerce Boolean schema implementation
 *
 * @since 1.1.0
 */
export class PithosCoerceBoolean implements PithosType<boolean, unknown> {
  _output!: boolean;
  _input!: unknown;

  parse(data: unknown): boolean {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<boolean> {
    // Coercition vers boolean
    let coercedValue: boolean;

    if (typeof data === "string") {
      // Les chaînes non-vides sont truthy, y compris "false"
      coercedValue = Boolean(data);
    } else if (typeof data === "number") {
      coercedValue = data !== 0;
    } else if (data === null || data === undefined) {
      coercedValue = false;
    } else {
      coercedValue = Boolean(data);
    }

    return { success: true, data: coercedValue };
  }

  async parseAsync(data: unknown): Promise<boolean> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<boolean>> {
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
    check: (data: boolean) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
