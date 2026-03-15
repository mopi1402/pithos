/**
 * Barrel re-export for Result.
 *
 * Provides a single import point for all Result-related exports.
 *
 * @example
 * ```typescript
 * import { Result, ok, err, Ok, Err, ResultAsync } from '@pithos/core/zygos/result';
 *
 * const r: Result<number, string> = ok(42);
 * const safe = Result.fromThrowable(JSON.parse);
 * const combined = Result.combine([ok(1), ok(2)]);
 * ```
 *
 * @since 2.4.0
 */

export {
  // Type + Namespace (declaration merging: works as both)
  Result,

  // Classes
  Ok,
  Err,

  // Constructors
  ok,
  err,

  // Utilities
  safeTry,
  safeAsyncTry,

  // Conversions
  fromOption,
  fromEither,
  toEither,
} from "./result.js";

export {
  ResultAsync,
  okAsync,
  errAsync,
} from "./result-async.js";
