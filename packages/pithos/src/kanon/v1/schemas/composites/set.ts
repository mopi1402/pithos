import type { PithosSafeParseResult, PithosType } from "../../types/base";
import { PithosError } from "../../errors";

/**
 * Schema for validating ES6 Sets
 *
 * @since 1.1.0
 */
export class PithosSet<T extends PithosType> implements PithosType<Set<any>> {
  _output!: Set<any>;
  _input!: Set<any>;

  constructor(private readonly itemSchema: T) {}

  parse(data: unknown): Set<any> {
    const result = this.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  safeParse(data: unknown): PithosSafeParseResult<Set<any>> {
    if (!(data instanceof Set)) {
      return {
        success: false,
        error: new PithosError([
          {
            code: "invalid_type",
            expected: "Set",
            received: typeof data,
            message: "Expected Set",
            path: [],
          },
        ]),
      };
    }

    const issues: any[] = [];
    const result = new Set();

    for (const item of data) {
      const itemResult = this.itemSchema.safeParse(item);
      if (!itemResult.success) {
        issues.push(
          ...itemResult.error.issues.map((issue) => ({
            ...issue,
            path: [item, ...issue.path],
          }))
        );
      } else {
        result.add(itemResult.data);
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

  parseAsync(data: unknown): Promise<Set<any>> {
    return Promise.resolve(this.parse(data));
  }

  safeParseAsync(data: unknown): Promise<PithosSafeParseResult<Set<any>>> {
    return Promise.resolve(this.safeParse(data));
  }
}
