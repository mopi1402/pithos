import type { PithosSafeParseResult, PithosType } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Schema for validating ES6 Maps
 *
 * @since 1.1.0
 */
export class PithosMap<TKey extends PithosType, TValue extends PithosType>
  implements PithosType<Map<any, any>>
{
  _output!: Map<any, any>;
  _input!: Map<any, any>;

  constructor(
    private readonly keySchema: TKey,
    private readonly valueSchema: TValue
  ) {}

  parse(data: unknown): Map<any, any> {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<Map<any, any>> {
    if (!(data instanceof Map)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "Map",
            received: typeof data,
            message: "Expected Map",
            path: [],
          },
        ]),
      };
    }

    const issues: any[] = [];
    const result = new Map();

    for (const [key, value] of data.entries()) {
      const keyResult = this.keySchema.safeParse(key);
      if (!keyResult.success) {
        issues.push(
          ...keyResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
        continue;
      }

      const valueResult = this.valueSchema.safeParse(value);
      if (!valueResult.success) {
        issues.push(
          ...valueResult.error.issues.map((issue) => ({
            ...issue,
            path: [key, ...issue.path],
          }))
        );
      } else {
        result.set(keyResult.data, valueResult.data);
      }
    }

    if (issues.length) {
      return {
        success: false,
        error: new PithosError(issues),
      };
    }

    return { success: true, data: result };
  }

  parseAsync(data: unknown): Promise<Map<any, any>> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<Map<any, any>>> {
    return Promise.resolve(this.safeParse(data));
  }
}
