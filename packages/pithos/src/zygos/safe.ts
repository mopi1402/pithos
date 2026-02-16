import { Result, err, ok } from "@zygos/result/result";

/**
 * Wraps a function to return a Result instead of throwing errors.
 * @template TArgs - The argument types.
 * @template TReturn - The return type.
 * @param fn - The function to wrap.
 * @returns A new function that returns a `Result<TReturn, Error>`.
 * @since 2.0.0
 * @example
 * ```typescript
 * import { chunk } from './chunk';
 *
 * const safeChunk = safe(chunk);
 * const result = safeChunk([1, 2, 3, 4, 5], -1);
 *
 * if (result.isOk()) {
 *   console.log(result.value); // Array of chunks
 * } else {
 *   console.log(result.error.message); // "Chunk size must be strictly positive"
 * }
 * ```
 */
export const safe = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
) => {
  return (...args: TArgs): Result<TReturn, Error> => {
    try {
      return ok(fn(...args));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
};
