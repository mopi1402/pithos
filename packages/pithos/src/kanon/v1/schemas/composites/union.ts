/**
 * Union schema implementation
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
 * Union schema implementation
 *
 * @since 1.1.0
 */
export class PithosUnion<T extends PithosType[]>
  implements PithosType<T[number]["_output"], T[number]["_input"]>
{
  _output!: T[number]["_output"];
  _input!: T[number]["_input"];

  constructor(private readonly schemas: T) {}

  parse(data: unknown): T[number]["_output"] {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<T[number]["_output"]> {
    const issues: PithosIssue[] = [];

    for (const schema of this.schemas) {
      const result = schema.safeParse(data);
      if (result.success) {
        return result;
      }
      issues.push(...result.error.issues);
    }

    return {
      success: false,
      error: new PithosError(issues),
    };
  }

  async parseAsync(data: unknown): Promise<T[number]["_output"]> {
    const result = await this.safeParseAsync(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async safeParseAsync(
    data: unknown
  ): Promise<PithosSafeParseResult<T[number]["_output"]>> {
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
    check: (data: T[number]["_output"]) => boolean | Promise<boolean>,
    options?: { message?: string } | string
  ): this {
    const message = typeof options === "string" ? options : options?.message;
    return new PithosRefined(this, check, message) as any;
  }
}
