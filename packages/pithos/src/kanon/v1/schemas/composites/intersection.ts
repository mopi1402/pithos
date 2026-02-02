import type { PithosSafeParseResult, PithosType } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Schema for validating type intersections
 *
 * @since 1.1.0
 */
export class PithosIntersection<T1 extends PithosType, T2 extends PithosType>
  implements PithosType<any>
{
  _output!: any;
  _input!: any;

  constructor(private readonly schema1: T1, private readonly schema2: T2) {}

  parse(data: unknown): any {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<any> {
    const issues: any[] = [];

    const result1 = this.schema1.safeParse(data);
    if (!result1.success) {
      issues.push(...result1.error.issues);
    }

    const result2 = this.schema2.safeParse(data);
    if (!result2.success) {
      issues.push(...result2.error.issues);
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    const mergedData =
      result1.data &&
      result2.data &&
      typeof result1.data === "object" &&
      typeof result2.data === "object"
        ? { ...result1.data, ...result2.data }
        : result2.data || result1.data;

    return { success: true, data: mergedData };
  }

  parseAsync(data: unknown): Promise<any> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<any>> {
    return Promise.resolve(this.safeParse(data));
  }
}
