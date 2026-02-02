/**
 * Any schema implementation
 *
 * @since 1.1.0
 */

import type { PithosType, PithosSafeParseResult } from "../../types/base";
import { PithosOptional } from "../concepts/wrappers/optional";
import { PithosNullable } from "../concepts/wrappers/nullable";
import { PithosDefault } from "../concepts/wrappers/default";
import { PithosRefined } from "../concepts/wrappers/refined";

/**
 * Any schema implementation
 *
 * @since 1.1.0
 */
export class PithosAny implements PithosType<any, any> {
  _output!: any;
  _input!: any;

  parse(data: unknown): any {
    return data;
  }

  safeParse(data: unknown): PithosSafeParseResult<any> {
    return { success: true, data };
  }

  async parseAsync(data: unknown): Promise<any> {
    return data;
  }

  async safeParseAsync(data: unknown): Promise<PithosSafeParseResult<any>> {
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
    check: (data: any) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
