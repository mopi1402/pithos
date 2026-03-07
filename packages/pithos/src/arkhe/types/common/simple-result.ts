/**
 * A lightweight discriminated union for success/failure outcomes.
 *
 * Use this when you need a typed return value without the full
 * `Result<T, E>` class from Zygos. No methods, no runtime cost,
 * just a plain object.
 *
 * @template E - The error type. Defaults to `string`.
 * @since 2.2.0
 * @example
 * ```typescript
 * function save(data: string): SimpleResult {
 *   if (data.length > 1000) {
 *     return { ok: false, error: 'Payload too large' }
 *   }
 *   return { ok: true }
 * }
 *
 * const result = save(payload)
 * if (!result.ok) {
 *   console.error(result.error)
 * }
 * ```
 */
export type SimpleResult<E = string> = { ok: true } | { ok: false; error: E };
