/**
 * Coerce String schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../../types/base";
import { PithosOptional } from "../wrappers/optional";
import { PithosNullable } from "../wrappers/nullable";
import { PithosDefault } from "../wrappers/default";
import { PithosRefined } from "../wrappers/refined";

/**
 * Coerce String schema implementation
 *
 * @since 1.1.0
 */
export class PithosCoerceString implements PithosType<string, unknown> {
  _output!: string;
  _input!: unknown;

  parse(data: unknown): string {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<string> {
    // Coercition vers string
    let coercedValue: string;

    if (data === null) {
      coercedValue = "null";
    } else if (data === undefined) {
      coercedValue = "undefined";
    } else if (typeof data === "object") {
      coercedValue = data instanceof Array ? "" : "[object Object]";
    } else {
      coercedValue = String(data);
    }

    return { success: true, data: coercedValue };
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
    check: (data: string) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
